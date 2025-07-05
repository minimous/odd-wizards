import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { StargazeService } from '@/lib/stargaze/stargaze-service';
import { IntergazeService } from '@/lib/intergaze/intergaze-service';
import { GeneralLaunchpad } from '@/types/launchpad';
import { RaribleService } from '@/lib/megaeth/rarible-service';
import { NETWORK_CONSTANT } from '@/constants';

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

// Helper function to normalize Rarible/MegaEth data to general format
function normalizeRaribleLaunchpad(raribleData: any): GeneralLaunchpad {
  const currentTime = Date.now();

  // Convert phases to mint stages format
  const mintStages =
    raribleData.phases?.map((phase: any, index: number) => {
      const startTime = new Date(phase.startDate).getTime();
      const endTime = phase.endDate
        ? new Date(phase.endDate).getTime()
        : undefined;

      // Determine stage status based on current time
      let status: 'ACTIVE' | 'UPCOMING' | 'ENDED' = 'UPCOMING';
      if (currentTime >= startTime) {
        if (endTime && currentTime > endTime) {
          status = 'ENDED';
        } else {
          status = 'ACTIVE';
        }
      }

      return {
        id: index,
        name: phase.type === 'allowlist' ? 'Allowlist' : 'Public Sale',
        type: phase.type === 'allowlist' ? 'PRESALE' : 'PUBLIC',
        presaleType: phase.type === 'allowlist' ? 'REGULAR' : 'NONE',
        status: status,
        startTime: startTime,
        endTime: endTime,
        salePrice: {
          amount: phase.price.amount.toString(),
          denom: phase.price.currency.abbreviation,
          symbol: phase.price.currency.abbreviation,
          exponent: 18 // Default for ETH-based currencies
        },
        addressTokenCounts: {
          limit: phase.maxMintPerWallet || 0,
          mintable: phase.maxMintPerWallet || 0,
          minted: 0
        },
        stageCounts: {
          limit: raribleData.totalSupply,
          mintable: raribleData.totalSupply,
          minted: 0 // Will be updated if getMintedCount is called
        },
        numMembers: undefined,
        isMember: false,
        proofs: null,
        burnConditions: null
      };
    }) || [];

  // Find current active stage
  let currentStage = null;

  // First, try to find an ACTIVE stage
  currentStage = mintStages.find((stage: any) => stage.status === 'ACTIVE');

  // If no active stage, find the next upcoming stage (earliest start time that's in the future)
  if (!currentStage) {
    const upcomingStages = mintStages
      .filter((stage: any) => stage.status === 'UPCOMING')
      .sort((a: any, b: any) => a.startTime - b.startTime);

    currentStage = upcomingStages[0] || null;
  }

  // If still no current stage and we have stages, use the first one as fallback
  if (!currentStage && mintStages.length > 0) {
    currentStage = mintStages[0];
  }

  return {
    id: raribleData.id,
    contractAddress: raribleData.id.split(':')[1], // Extract contract address from collection ID
    name: raribleData.title,
    description: raribleData.description,
    creator: {
      address: raribleData.author || 'Unknown'
    },
    minter: {
      minterType: raribleData.type || 'thirdweb',
      minterAddress: raribleData.id.split(':')[1], // Use contract address as minter address
      mintableTokens: raribleData.totalSupply,
      mintedTokens: 0, // Will be updated if getMintedCount is called
      airdroppedTokens: 0,
      numTokens: raribleData.totalSupply,
      existingTokens: 0,
      currentStage: currentStage,
      mintStages: mintStages
    },
    startTradingTime:
      currentStage?.startTime || mintStages[0]?.startTime || Date.now(),
    media: raribleData.media
      ? {
          type: raribleData.media.type,
          url: raribleData.media.url,
          height: 0,
          width: 0,
          fallbackUrl: raribleData.media.url,
          visualAssets: {
            lg: {
              type: 'image',
              height: 400,
              width: 400,
              url: raribleData.media.url,
              staticUrl: raribleData.media.url
            },
            md: {
              type: 'image',
              height: 300,
              width: 300,
              url: raribleData.media.url,
              staticUrl: raribleData.media.url
            },
            sm: {
              type: 'image',
              height: 200,
              width: 200,
              url: raribleData.media.url,
              staticUrl: raribleData.media.url
            },
            xl: {
              type: 'image',
              height: 500,
              width: 500,
              url: raribleData.media.url,
              staticUrl: raribleData.media.url
            },
            xs: {
              type: 'image',
              height: 100,
              width: 100,
              url: raribleData.media.url,
              staticUrl: raribleData.media.url
            }
          }
        }
      : undefined,
    // Additional Rarible-specific fields
    tokenStandard: raribleData.tokenStandard,
    totalSupply: raribleData.totalSupply,
    isVerified: raribleData.isVerified,
    phases: raribleData.phases,
    fees: raribleData.fees,
    blockchain: raribleData.blockchain
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
            if (
              banner.banner_network?.toLowerCase() === NETWORK_CONSTANT.STARGAZE
            ) {
              const stargazeData = await new StargazeService().getLaunchpad(
                banner.banner_collection_address,
                wallet ?? undefined
              );
              launchpad = normalizeStargazeLaunchpad(stargazeData);
            } else if (
              banner.banner_network?.toLowerCase() ===
              NETWORK_CONSTANT.INTERGAZE
            ) {
              const intergazeData = await new IntergazeService().getLaunchpad(
                banner.banner_collection_address,
                wallet ?? undefined
              );
              launchpad = normalizeIntergazeLaunchpad(intergazeData);
            } else if (
              banner.banner_network?.toLowerCase() ===
              NETWORK_CONSTANT.MEGAETH.toLocaleLowerCase()
            ) {
              const raribleService = new RaribleService();

              // Get launchpad data
              const raribleData = await raribleService.getLaunchpad(
                banner.banner_collection_address
              );

              // Optionally get minted count to update the data
              try {
                const mintedData = await raribleService.getMintedCount(
                  banner.banner_collection_address
                );

                // Update minted count in the normalized data
                launchpad = normalizeRaribleLaunchpad(raribleData);
                if (launchpad.minter) {
                  launchpad.minter.mintedTokens = mintedData.minted;
                  // Update current stage minted count
                  if (launchpad.minter.currentStage?.stageCounts) {
                    launchpad.minter.currentStage.stageCounts.minted =
                      mintedData.minted;
                  }
                  // Update all stages minted count
                  launchpad.minter.mintStages.forEach((stage) => {
                    if (stage.stageCounts) {
                      stage.stageCounts.minted = mintedData.minted;
                    }
                  });
                }
              } catch (mintedError) {
                console.warn(
                  `Could not fetch minted count for ${banner.banner_collection_address}:`,
                  mintedError
                );
                // Still use the launchpad data without minted count
                launchpad = normalizeRaribleLaunchpad(raribleData);
              }
            }
          } catch (error) {
            console.error(
              `Error fetching launchpad for ${banner.banner_collection_address} on ${banner.banner_network}:`,
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
