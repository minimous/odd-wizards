// pages/api/collections/index.ts
import {
  MarketplaceCollectionParams,
  StargazeService
} from '@/lib/stargaze/stargaze-service';
import { FormattedCollection, FormattedPriceInfo } from '@/types/marketplace';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

// Helper functions to format data for your components
function formatPriceInfo(priceData: any): FormattedPriceInfo {
  if (!priceData || !priceData.amount) {
    return {
      value: 0,
      currency: 'STARS',
      usdValue: 0
    };
  }

  // Convert from smallest unit using exponent
  const value =
    parseFloat(priceData.amount) / Math.pow(10, priceData.exponent || 6);

  return {
    value,
    currency: priceData.symbol || 'STARS',
    usdValue: priceData.amountUsd || 0
  };
}

function getVolume(type: string | null, stats: any) {
  if (!type) return stats.volumeUsd24hour;

  switch (type) {
    case 'VOLUME_USD_6_HOUR_DESC':
      return stats.volumeUsd6hour;
    case 'VOLUME_USD_24_HOUR_DESC':
      return stats.volumeUsd24hour;
    case 'VOLUME_USD_7_DAY_DESC':
      return stats.volumeUsd7day;
    case 'VOLUME_USD_30_DAY_DESC':
      return stats.volumeUsd30day;
    default:
      return stats.volumeUsd24hour;
  }
}

function getVolumePercn(type: string | null, stats: any) {
  if (!type) return stats.changeUsd24hourPercent;

  switch (type) {
    case 'VOLUME_USD_6_HOUR_DESC':
      return stats.changeUsd6hourPercent;
    case 'VOLUME_USD_24_HOUR_DESC':
      return stats.changeUsd24hourPercent;
    case 'VOLUME_USD_7_DAY_DESC':
      return stats.changeUsd7dayPercent;
    case 'VOLUME_USD_30_DAY_DESC':
      return stats.changeUsd30dayPercent;
    default:
      return stats.changeUsd24hourPercent;
  }
}

function formatCollection(
  rawCollection: any,
  sortBy: string | null
): FormattedCollection {
  const stats = rawCollection.stats || {};
  const tokenCounts = rawCollection.tokenCounts || {};

  // Calculate for sale percentage
  const activeTokens = tokenCounts.active || 1;
  const listedTokens = tokenCounts.listed || 0;
  const forSalePercentage =
    activeTokens > 0 ? Math.round((listedTokens / activeTokens) * 100) : 0;

  return {
    contractAddress: rawCollection.contractAddress,
    name: rawCollection.name || 'Unknown Collection',
    description: rawCollection.description || '',
    imageUrl:
      rawCollection.media.type == 'animated_image'
        ? rawCollection.media?.url || ''
        : rawCollection.media?.visualAssets?.md?.url || '',
    floorPrice: formatPriceInfo(rawCollection.floor),
    bestOffer: formatPriceInfo(rawCollection.highestOffer?.offerPrice),
    volume: {
      value: getVolume(sortBy, stats) || 0,
      change: stats.changeUsd7dayPercent || 0
    },
    owners: {
      count: stats.numOwners || 0,
      unique: Math.round(getVolumePercn(stats, sortBy) || 0)
    },
    forSale: {
      percentage: forSalePercentage,
      count: listedTokens
    },
    categories: rawCollection.categories?.public || [],
    isExplicit: rawCollection.isExplicit || false
  };
}

// API handler
export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json(
      {
        success: false,
        error: 'Method not allowed'
      },
      {
        status: 405
      }
    );
  }

  try {
    const { searchParams } = req.nextUrl;
    // Parse query parameters
    const offset = searchParams.get('offset');
    const limit = searchParams.get('limit');
    const sortBy = searchParams.get('sortBy');
    const searchQuery = searchParams.get('searchQuery');
    const filterByCategories = searchParams.get('filterByCategories');
    const minMaxFilters = searchParams.get('minMaxFilters');
    const filterByDenoms = searchParams.get('filterByDenoms');
    const filterByVerified = searchParams.get('filterByVerified');

    // Build parameters for Stargaze API
    const params: MarketplaceCollectionParams = {
      offset: offset ? parseInt(offset as string) : 0,
      limit: limit ? parseInt(limit as string) : 50,
      sortBy: (sortBy as string) || 'VOLUME_USD_7_DAY_DESC',
      searchQuery: searchQuery as string,
      filterByCategories: filterByCategories
        ? ((Array.isArray(filterByCategories)
            ? filterByCategories
            : [filterByCategories]) as string[])
        : undefined,
      minMaxFilters: minMaxFilters ? JSON.parse(minMaxFilters as string) : {},
      filterByDenoms: filterByDenoms
        ? ((Array.isArray(filterByDenoms)
            ? filterByDenoms
            : [filterByDenoms]) as string[])
        : undefined,
      filterByVerified: filterByVerified === 'true'
    };

    // Initialize service and fetch data
    const stargazeService = new StargazeService();
    const rawResponse = await stargazeService.getMarketplaceCollection(params);

    // Format the response for your components
    const formattedCollections = rawResponse.collections.map((item) =>
      formatCollection(item, sortBy)
    );

    // Build pagination info
    const pageInfo = {
      total: rawResponse.pageInfo.total,
      offset: rawResponse.pageInfo.offset,
      limit: rawResponse.pageInfo.limit,
      hasNextPage:
        rawResponse.pageInfo.offset + rawResponse.pageInfo.limit <
        rawResponse.pageInfo.total,
      hasPreviousPage: rawResponse.pageInfo.offset > 0
    };

    // Return formatted response
    return NextResponse.json(
      {
        success: true,
        data: {
          collections: formattedCollections,
          pageInfo
        }
      },
      {
        status: 200
      }
    );
  } catch (error) {
    console.error('API Error:', error);

    NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      {
        status: 500
      }
    );
  }
}
