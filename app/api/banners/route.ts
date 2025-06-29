import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { StargazeService } from '@/lib/stargaze/stargaze-service';
import { IntergazeService } from '@/lib/intergaze/intergaze-service';
import { GeneralLaunchpad } from '@/types/launchpad';

export const dynamic = 'force-dynamic';

// Helper function to normalize Stargaze data to general format
function normalizeStargazeLaunchpad(stargazeData: any): GeneralLaunchpad {
  return {
    id: stargazeData.contractAddress,
    contractAddress: stargazeData.contractAddress,
    contractUri: stargazeData.contractUri,
    name: stargazeData.name,
    description: stargazeData.description,
    website: stargazeData.website,
    isExplicit: stargazeData.isExplicit,
    minterAddress: stargazeData.minterAddress,
    featured: stargazeData.featured,
    floor: stargazeData.floor,
    creator: {
      address: stargazeData.creator.address,
      name: stargazeData.creator.name
    },
    royaltyInfo: stargazeData.royaltyInfo,
    minterV2: stargazeData.minterV2
      ? {
          minterType: stargazeData.minterV2.minterType,
          minterAddress: stargazeData.minterV2.minterAddress,
          mintableTokens: stargazeData.minterV2.mintableTokens,
          mintedTokens: stargazeData.minterV2.mintedTokens,
          airdroppedTokens: stargazeData.minterV2.airdroppedTokens,
          numTokens: stargazeData.minterV2.numTokens,
          currentStage: stargazeData.minterV2.currentStage
            ? {
                id: stargazeData.minterV2.currentStage.id,
                name: stargazeData.minterV2.currentStage.name,
                type: stargazeData.minterV2.currentStage.type,
                presaleType: stargazeData.minterV2.currentStage.presaleType,
                status: stargazeData.minterV2.currentStage.status,
                startTime: stargazeData.minterV2.currentStage.startTime,
                endTime: stargazeData.minterV2.currentStage.endTime,
                salePrice: stargazeData.minterV2.currentStage.salePrice,
                discountPrice: stargazeData.minterV2.currentStage.discountPrice,
                addressTokenCounts:
                  stargazeData.minterV2.currentStage.addressTokenCounts,
                stageCounts: stargazeData.minterV2.currentStage.stageCounts,
                numMembers: stargazeData.minterV2.currentStage.numMembers,
                isMember: stargazeData.minterV2.currentStage.isMember,
                proofs: stargazeData.minterV2.currentStage.proofs,
                burnConditions:
                  stargazeData.minterV2.currentStage.burnConditions
              }
            : undefined,
          mintStages: stargazeData.minterV2.mintStages
        }
      : undefined,
    startTradingTime: stargazeData.startTradingTime,
    media: stargazeData.media
  };
}

// Helper function to normalize Intergaze data to general format
function normalizeIntergazeLaunchpad(intergazeData: any): GeneralLaunchpad {
  return {
    id: intergazeData.id,
    contractAddress: intergazeData.contractAddress,
    name: intergazeData.name,
    description: intergazeData.description,
    creator: {
      address: intergazeData.creator.address
    },
    minter: intergazeData.minter
      ? {
          minterType: intergazeData.minter.minterType,
          minterAddress: intergazeData.minter.minterAddress,
          mintableTokens: intergazeData.minter.mintableTokens,
          mintedTokens: intergazeData.minter.mintedTokens,
          airdroppedTokens: intergazeData.minter.airdroppedTokens,
          numTokens: intergazeData.minter.numTokens,
          existingTokens: intergazeData.minter.existingTokens,
          currentStage: intergazeData.minter.currentStage
            ? {
                id: intergazeData.minter.currentStage.id,
                name: intergazeData.minter.currentStage.name,
                type: intergazeData.minter.currentStage.type,
                presaleType: intergazeData.minter.currentStage.presaleType,
                status: intergazeData.minter.currentStage.status,
                startTime:
                  parseInt(intergazeData.minter.currentStage.startTime) /
                  1000000,
                endTime: intergazeData.minter.currentStage.endTime
                  ? parseInt(intergazeData.minter.currentStage.endTime) /
                    1000000
                  : undefined,
                salePrice: intergazeData.minter.currentStage.salePrice,
                addressTokenCounts:
                  intergazeData.minter.currentStage.addressTokenCounts,
                stageCounts: intergazeData.minter.currentStage.stageCounts,
                numMembers: intergazeData.minter.currentStage.numMembers,
                isMember: intergazeData.minter.currentStage.isMember,
                proofs: intergazeData.minter.currentStage.proofs,
                burnConditions: intergazeData.minter.currentStage.burnConditions
              }
            : undefined,
          mintStages: intergazeData.minter.mintStages
        }
      : undefined,
    startTradingTime: intergazeData.startTradingTime
      ? intergazeData.startTradingTime / 1000000
      : 1000000000000000,
    media: intergazeData.media
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    let wallet = searchParams.get('wallet');

    const banners = await prisma.mst_banners.findMany({
      where: {
        banner_status: 'P'
      },
      orderBy: [
        {
          banner_seqn: 'asc'
        }
      ]
    });

    // Use Promise.all to wait for all launchpad data
    const bannersWithLaunchpad = await Promise.all(
      banners.map(async (banner) => {
        if (banner.banner_collection_address) {
          let launchpad: GeneralLaunchpad | null = null;

          try {
            if (banner.banner_network?.toLowerCase() == 'stargaze') {
              const stargazeData = await new StargazeService().getLaunchpad(
                banner.banner_collection_address,
                wallet ?? undefined
              );
              launchpad = normalizeStargazeLaunchpad(stargazeData);
            } else if (banner.banner_network?.toLowerCase() == 'intergaze') {
              const intergazeData = await new IntergazeService().getLaunchpad(
                banner.banner_collection_address,
                wallet ?? undefined
              );

              launchpad = normalizeIntergazeLaunchpad(intergazeData);
            }
          } catch (error) {
            console.error(
              `Error fetching launchpad for ${banner.banner_collection_address}:`,
              error
            );
            // Continue without launchpad data if API fails
          }

          // Return a new object with the launchpad data
          return {
            ...banner,
            launchpad
          };
        }
        return banner;
      })
    );

    return NextResponse.json(
      {
        message: 'Get Banners successfully',
        data: bannersWithLaunchpad
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0'
        }
      }
    );
  } catch (error) {
    console.error('Get Banners Error:', error);
    return NextResponse.json(
      {
        message: 'Failed to Get Banners',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
