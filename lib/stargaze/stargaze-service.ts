import {
  MARKETPLACE_COLLECTIONS_QUERY,
  LAUNCHPAD_QUERY
} from './query-constants';

// Existing interfaces from the original code
export interface CollectionMinMaxFilters {
  floorMin?: number;
  floorMax?: number;
  volumeMin?: number;
  volumeMax?: number;
}

export interface MarketplaceCollectionParams {
  offset?: number;
  limit?: number;
  sortBy?: string;
  searchQuery?: string;
  filterByCategories?: string[];
  minMaxFilters?: CollectionMinMaxFilters;
  filterByDenoms?: string[];
  filterByVerified?: boolean;
}

export interface MediaAsset {
  type: string;
  url: string;
  height: number;
  width: number;
  staticUrl: string;
  __typename: string;
}

export interface VisualAssets {
  xs: MediaAsset;
  sm: MediaAsset;
  md: MediaAsset;
  lg: MediaAsset;
  xl: MediaAsset;
  __typename: string;
}

export interface Media {
  type: string;
  url: string;
  originalUrl: string;
  height: number;
  width: number;
  visualAssets: VisualAssets;
  __typename: string;
}

export interface TradingAsset {
  denom: string;
  symbol: string;
  price: number;
  exponent: number;
  __typename: string;
}

export interface PriceInfo {
  amount: string;
  amountUsd: number;
  denom: string;
  symbol: string;
  exponent: number;
  __typename: string;
}

export interface HighestOffer {
  offerPrice: PriceInfo;
  __typename: string;
}

export interface TokenCounts {
  listed: number;
  active: number;
  __typename: string;
}

export interface Categories {
  public: string[];
  __typename: string;
}

export interface CollectionStats {
  collectionAddr: string;
  change6HourPercent: number;
  change24HourPercent: number;
  change7DayPercent: number;
  change30dayPercent: number;
  volume6Hour: number;
  volume24Hour: number;
  volume7Day: number;
  volume30Day: number;
  changeUsd6hourPercent: number;
  changeUsd24hourPercent: number;
  changeUsd7dayPercent: number;
  changeUsd30dayPercent: number;
  volumeUsd6hour: number;
  volumeUsd24hour: number;
  volumeUsd7day: number;
  volumeUsd30day: number;
  bestOffer: number;
  bestOfferUsd: number;
  numOwners: number;
  uniqueOwnerPercent: number;
  salesCountTotal: number;
  __typename: string;
}

export interface Collection {
  __typename: string;
  contractAddress: string;
  contractUri: string;
  name: string;
  description: string;
  isExplicit: boolean;
  categories: Categories;
  tradingAsset: TradingAsset;
  floor: PriceInfo;
  highestOffer: HighestOffer;
  tokenCounts: TokenCounts;
  stats: CollectionStats;
  media: Media;
}

export interface PageInfo {
  __typename: string;
  total: number;
  offset: number;
  limit: number;
}

export interface CollectionsResponse {
  __typename: string;
  collections: Collection[];
  pageInfo: PageInfo;
}

export interface MarketplaceCollectionsData {
  collections: CollectionsResponse;
}

// New interfaces for Launchpad functionality
export interface NameRecord {
  name: string;
  value: string;
  verified: boolean;
  __typename: string;
}

export interface CreatorName {
  name: string;
  records: NameRecord[];
  __typename: string;
}

export interface Creator {
  address: string;
  name: CreatorName;
  __typename: string;
}

export interface RoyaltyInfo {
  sharePercent: number;
  __typename: string;
}

export interface BurnCondition {
  collectionAddress: string;
  amountToBurn: number;
  __typename: string;
}

export interface AddressTokenCounts {
  limit: number;
  mintable: number;
  minted: number;
  __typename: string;
}

export interface StageCounts {
  limit: number;
  mintable: number;
  minted: number;
  __typename: string;
}

export interface MintStage {
  id: string;
  name: string;
  type: string;
  presaleType: string;
  status: string;
  startTime: string;
  endTime: string;
  salePrice: PriceInfo;
  discountPrice: PriceInfo;
  burnConditions: BurnCondition[];
  addressTokenCounts: AddressTokenCounts;
  stageCounts: StageCounts;
  numMembers: number;
  isMember: boolean;
  proofs: string[];
  __typename: string;
}

export interface MinterV2 {
  minterType: string;
  minterAddress: string;
  mintableTokens: number;
  mintedTokens: number;
  airdroppedTokens: number;
  numTokens: number;
  currentStage: MintStage;
  mintStages: MintStage[];
  __typename: string;
}

export interface LaunchpadCollection {
  __typename: string;
  contractAddress: string;
  contractUri: string;
  name: string;
  description: string;
  website: string;
  isExplicit: boolean;
  minterAddress: string;
  featured: boolean;
  floor: PriceInfo;
  creator: Creator;
  royaltyInfo: RoyaltyInfo;
  minterV2: MinterV2;
  startTradingTime: string;
  media: Media;
}

export interface LaunchpadData {
  collection: LaunchpadCollection;
}

export interface GraphQLResponse<T = any> {
  data: T;
  errors?: any[];
}

// Configuration interface (you may need to adjust this based on your config structure)
interface Config {
  graphql_url: string;
}

export class StargazeService {
  private readonly apiUrl = 'https://graphql.mainnet.stargaze-apis.com/graphql';
  private config?: Config;

  constructor(config?: Config) {
    this.config = config;
  }

  async getMarketplaceCollection(
    params: MarketplaceCollectionParams = {}
  ): Promise<CollectionsResponse> {
    const {
      offset,
      limit = 100,
      sortBy = 'VOLUME_USD_7_DAY_DESC',
      searchQuery,
      filterByCategories,
      minMaxFilters = {},
      filterByDenoms,
      filterByVerified = false
    } = params;

    const variables = {
      offset,
      limit,
      sortBy,
      searchQuery,
      filterByCategories,
      minMaxFilters,
      filterByDenoms,
      filterByVerified
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operationName: 'MarketplaceCollections',
          variables,
          query: MARKETPLACE_COLLECTIONS_QUERY
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GraphQLResponse<MarketplaceCollectionsData> =
        await response.json();

      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }

      return result.data.collections;
    } catch (error) {
      console.error('Error fetching marketplace collections:', error);
      throw error;
    }
  }

  async getLaunchpad(
    address: string,
    walletAddress?: string
  ): Promise<LaunchpadCollection> {
    if (!this.config) {
      throw new Error('Config not found');
    }

    const variables = {
      address,
      walletAddress
    };

    try {
      const response = await fetch(
        `${this.config.graphql_url}?t=${new Date().getTime()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache', // For HTTP/1.0 compatibility
            Expires: '0' // For older browsers
          },
          body: JSON.stringify({
            query: LAUNCHPAD_QUERY,
            variables,
            operationName: 'MinterV2'
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GraphQLResponse<LaunchpadData> = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }

      return result.data.collection;
    } catch (error) {
      console.error('Error fetching launchpad data:', error);
      throw error;
    }
  }
}
