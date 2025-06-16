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
  
  export interface GraphQLResponse {
    data: MarketplaceCollectionsData;
    errors?: any[];
  }
  
  export class StargazeService {
    private readonly apiUrl = 'https://graphql.mainnet.stargaze-apis.com/graphql';
  
    private readonly marketplaceCollectionsQuery = `
      query MarketplaceCollections($offset: Int, $limit: Int, $sortBy: CollectionSort, $searchQuery: String, $filterByCategories: [String!], $minMaxFilters: CollectionMinMaxFilters, $filterByDenoms: [String!], $filterByVerified: Boolean = false) {
        collections(
          offset: $offset
          limit: $limit
          sortBy: $sortBy
          searchQuery: $searchQuery
          filterByCategories: $filterByCategories
          minMaxFilters: $minMaxFilters
          filterByDenoms: $filterByDenoms
          filterByVerified: $filterByVerified
        ) {
          __typename
          collections {
            __typename
            contractAddress
            contractUri
            name
            description
            isExplicit
            categories {
              public
              __typename
            }
            tradingAsset {
              denom
              symbol
              price
              exponent
              __typename
            }
            floor {
              amount
              amountUsd
              denom
              symbol
              exponent
              __typename
            }
            highestOffer {
              offerPrice {
                amount
                amountUsd
                denom
                symbol
                exponent
                __typename
              }
              __typename
            }
            tokenCounts {
              listed
              active
              __typename
            }
            categories {
              public
              __typename
            }
            stats {
              collectionAddr
              change6HourPercent
              change24HourPercent
              change7DayPercent
              change30dayPercent
              volume6Hour
              volume24Hour
              volume7Day
              volume30Day
              changeUsd6hourPercent
              changeUsd24hourPercent
              changeUsd7dayPercent
              changeUsd30dayPercent
              volumeUsd6hour
              volumeUsd24hour
              volumeUsd7day
              volumeUsd30day
              bestOffer
              bestOfferUsd
              numOwners
              uniqueOwnerPercent
              salesCountTotal
              __typename
            }
            media {
              ...MediaFields
              __typename
            }
          }
          pageInfo {
            __typename
            total
            offset
            limit
          }
        }
      }
  
      fragment MediaFields on Media {
        type
        url
        originalUrl
        height
        width
        visualAssets {
          xs {
            type
            url
            height
            width
            staticUrl
            __typename
          }
          sm {
            type
            url
            height
            width
            staticUrl
            __typename
          }
          md {
            type
            url
            height
            width
            staticUrl
            __typename
          }
          lg {
            type
            url
            height
            width
            staticUrl
            __typename
          }
          xl {
            type
            url
            height
            width
            staticUrl
            __typename
          }
          __typename
        }
        __typename
      }
    `;
  
    async getMarketplaceCollection(params: MarketplaceCollectionParams = {}): Promise<CollectionsResponse> {
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
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operationName: 'MarketplaceCollections',
            variables,
            query: this.marketplaceCollectionsQuery
          })
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result: GraphQLResponse = await response.json();
  
        if (result.errors) {
          throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }
  
        return result.data.collections;
      } catch (error) {
        console.error('Error fetching marketplace collections:', error);
        throw error;
      }
    }
  }