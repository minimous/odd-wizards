import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { DEFAULT_IMAGE_PROFILE } from '@/constants';
import { OwnedTokensResponse, Token } from '@/types';
import { fetchStargazeTokens, getAssosiatedName } from '@/lib/utils';
import { getLeaderboard, updateNftOwner } from '@/lib/soft-staking-service';
import { IntergazeService } from '@/lib/intergaze/intergaze-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { wallet: string } }
) {
  try {
    const { wallet } = params;
    const { searchParams } = request.nextUrl;

    // Validate wallet address
    if (!wallet || typeof wallet !== 'string') {
      return NextResponse.json(
        { message: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await prisma.mst_users.findUnique({
      where: {
        user_address: wallet
      }
    });

    // If user doesn't exist, create new user
    if (!user) {
      let defaultProfile = DEFAULT_IMAGE_PROFILE;

      if (wallet.startsWith('stars')) {
        const collections = await prisma.mst_collection.findMany({
          where: {
            collection_chain: 'Stargaze'
          }
        });

        try {
          const resp: OwnedTokensResponse = await fetchStargazeTokens({
            owner: wallet,
            collectionAddresses: collections
              .map((collection) => collection.collection_address)
              .filter((addr): addr is string => addr !== null),
            limit: 1,
            offset: 0
          });

          const tokens: Token[] = resp.tokens;
          if (tokens.length > 0 && tokens[0].media?.url) {
            defaultProfile = tokens[0].media.url;
          }
        } catch (error) {
          console.error('Error fetching Stargaze tokens:', error);
          // Continue with default profile
        }
      } else if (wallet.startsWith('init')) {
        const collections = await prisma.mst_collection.findMany({
          where: {
            collection_chain: 'Intergaze'
          }
        });

        for (const collection of collections) {
          if (!collection.collection_address) continue;

          try {
            const resp = await new IntergazeService().getNftsWithPagination(
              wallet,
              collection.collection_address,
              1,
              0
            );

            if (resp.tokens.length > 0 && resp.tokens[0]?.media?.url) {
              defaultProfile = resp.tokens[0].media.url;
              break; // Exit loop once we find a profile image
            }
          } catch (error) {
            console.error(
              `Error fetching Intergaze tokens for collection ${collection.collection_address}:`,
              error
            );
            // Continue to next collection
          }
        }
      }

      // Create new user
      user = await prisma.mst_users.create({
        data: {
          user_address: wallet,
          user_created_date: new Date(),
          user_image_url: defaultProfile
        }
      });
    }

    // Get collections for staking update
    const collections = await prisma.mst_collection.findMany();

    // Update NFT owner for each collection where user is staking
    for (const collection of collections) {
      try {
        const staker = await prisma.mst_staker.findFirst({
          where: {
            staker_address: wallet,
            staker_collection_id: collection.collection_id
          }
        });

        if (staker && collection.collection_address) {
          await updateNftOwner(wallet, collection.collection_address);
        }
      } catch (error) {
        console.error(
          `Error updating NFT owner for collection ${collection.collection_id}:`,
          error
        );
        // Continue with other collections
      }
    }

    // Check for unclaimed rewards
    const distribusiWinner = await prisma.trn_distribusi_reward.findFirst({
      where: {
        distribusi_wallet: wallet,
        distribusi_is_claimed: 'N',
        distribusi_type: 'NFT'
      }
    });

    // Get associated name
    let associatedName = null;
    try {
      associatedName = await getAssosiatedName(wallet);
    } catch (error) {
      console.error('Error getting associated name:', error);
      // Continue without associated name
    }

    // Get staker information
    const stakers = await prisma.mst_staker.findMany({
      where: {
        staker_address: wallet
      },
      include: {
        projects: true
      }
    });

    return NextResponse.json(
      {
        message: 'Successfully retrieved user data',
        data: {
          associated: associatedName,
          user: {
            ...user,
            is_winner: distribusiWinner ? 'Y' : 'N'
          },
          staker: stakers
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get User Error:', error);
    return NextResponse.json(
      {
        message: 'Failed to retrieve user data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
