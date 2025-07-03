import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import {
  getSampleNfts,
  getTotalPoints,
  updateNftOwner
} from '@/lib/soft-staking-service';
import { NETWORK_CONSTANT } from '@/constants';

// Type definitions for better type safety
interface RequestBody {
  staker_address: string;
  project_code: string;
}

interface PointData {
  points: number;
  nft_staked: number;
  staker_id: number;
}

const getPrefix = (network: string): string => {
  switch (network) {
    case NETWORK_CONSTANT.STARGAZE:
      return 'stars';
    case NETWORK_CONSTANT.INTERGAZE:
      return 'init';
    default:
      return 'stars';
  }
};

const validateAddress = (address: string, prefix: string): boolean => {
  return address.startsWith(prefix);
};

const createErrorResponse = (message: string, status: number = 400) => {
  return NextResponse.json({ message }, { status });
};

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    let body: RequestBody;
    try {
      body = await request.json();
    } catch (parseError) {
      return createErrorResponse('Invalid JSON format', 400);
    }

    const { staker_address, project_code } = body;

    // Input validation
    if (!staker_address || typeof staker_address !== 'string') {
      return createErrorResponse('Valid staker_address is required');
    }

    if (!project_code || typeof project_code !== 'string') {
      return createErrorResponse('Valid project_code is required');
    }

    // Sanitize inputs
    const sanitizedStakerAddress = staker_address.trim();
    const sanitizedProjectCode = project_code.trim();

    // Find project with error handling
    const project = await prisma.mst_project.findFirst({
      where: {
        project_code: sanitizedProjectCode
      },
      include: {
        collections: true
      }
    });

    if (!project) {
      return createErrorResponse('Project not found', 404);
    }

    // Validate network address
    const prefix = getPrefix(project.project_network ?? '');
    if (!validateAddress(sanitizedStakerAddress, prefix)) {
      return createErrorResponse(
        `Invalid address format. Address should start with '${prefix}'`
      );
    }

    // Process collections and count tokens
    let totalTokenCount = 0;
    const collectionPromises = project.collections.map(async (collection) => {
      if (!collection.collection_address) {
        console.warn(`Collection ${collection.collection_id} has no address`);
        return 0;
      }

      try {
        // Get NFTs for this collection
        const nftResponse = await getSampleNfts(
          sanitizedStakerAddress,
          collection.collection_address,
          collection?.collection_chain?.toLowerCase() ?? ''
        );

        // Find or create staker
        let staker = await prisma.mst_staker.findFirst({
          where: {
            staker_address: sanitizedStakerAddress,
            staker_collection_id: collection.collection_id
          }
        });

        if (!staker) {
          staker = await prisma.mst_staker.create({
            data: {
              staker_address: sanitizedStakerAddress,
              staker_collection_id: collection.collection_id,
              staker_total_points: 0,
              staker_project_id: project.project_id
            }
          });
        }

        // Update NFT owner (assuming this is async)
        await updateNftOwner(
          sanitizedStakerAddress,
          collection.collection_address
        );

        return nftResponse?.tokens?.length ?? 0;
      } catch (collectionError) {
        console.error(
          `Error processing collection ${collection.collection_id}:`,
          collectionError
        );
        return 0;
      }
    });

    // Wait for all collection processing to complete
    const tokenCounts = await Promise.all(collectionPromises);
    totalTokenCount = tokenCounts.reduce((sum, count) => sum + count, 0);

    if (totalTokenCount === 0) {
      return createErrorResponse(
        'No tokens found for the given owner and collections',
        404
      );
    }

    // Get total points
    const pointsResponse = await getTotalPoints(
      sanitizedStakerAddress,
      project.project_id
    );

    if (!pointsResponse || pointsResponse.point === 0) {
      return createErrorResponse('No points available to claim');
    }

    // Process points in a transaction for data consistency
    await prisma.$transaction(async (tx) => {
      const pointDataList = pointsResponse.listPoints ?? [];

      for (const pointData of pointDataList) {
        // Create point transaction record
        await tx.trn_point.create({
          data: {
            point_amount: pointData.points,
            point_nft_staked: pointData.nft_staked,
            point_staker_id: pointData.staker_id,
            point_claim_date: new Date()
          }
        });

        // Update staker if points are valid
        if (pointData.points >= 1) {
          const currentStaker = await tx.mst_staker.findUnique({
            where: {
              staker_id: pointData.staker_id
            }
          });

          if (currentStaker) {
            await tx.mst_staker.update({
              where: { staker_id: pointData.staker_id },
              data: {
                staker_lastclaim_date: new Date(),
                staker_nft_staked: pointData.nft_staked,
                staker_total_points:
                  (currentStaker.staker_total_points ?? 0) + pointData.points
              }
            });
          }
        }
      }
    });

    return NextResponse.json(
      {
        message: 'Stake created successfully',
        data: {
          total_tokens: totalTokenCount,
          total_points: pointsResponse.point,
          staker_address: sanitizedStakerAddress,
          project_code: sanitizedProjectCode
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Stake Creation Error:', error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return createErrorResponse('Invalid request format', 400);
    }

    if (error && typeof error === 'object' && 'code' in error) {
      // Handle Prisma errors
      if (error.code === 'P2002') {
        return createErrorResponse('Duplicate entry detected', 409);
      }
      if (error.code === 'P2025') {
        return createErrorResponse('Record not found', 404);
      }
    }

    return NextResponse.json(
      {
        message: 'Failed to create stake',
        error:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : 'Unknown error'
            : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
