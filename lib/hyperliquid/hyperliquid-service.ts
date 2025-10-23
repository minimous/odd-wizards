// Hyperliquid Service for Drip.trade API integration

export interface Collection {
  contractAddress: string;
  slug: string;
  name: string;
  symbol: string;
  type: string;
  description: string;
  supply: number;
  imageUrl: string;
  bannerUrl: string;
  twitter: string;
  discord: string;
  website: string | null;
  royaltyPercentage: number;
  royaltyAddress: string;
  createdAt: string;
  updatedAt: string;
  lastMetadataUpdate: string;
  featured: boolean;
  public: boolean;
  trading: boolean;
  showRarity: boolean;
  paymentTokenAddress: string | null;
  isHybrid: boolean;
}

export interface TopBid {
  key: string;
  userAddress: string;
  tokenKey: string | null;
  collectionAddress: string;
  price: string; // BigInt as string
  quantity: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  lastIndexedBlock: number;
  status: string;
  bidHash: {
    filterCriteria: string;
    merkleRoot: string;
  };
}

export interface Trait {
  key: string;
  type: string;
  count: number;
  value: string;
  rarity_score: number;
  collection_address: string;
}

export interface Listing {
  key: string;
  userAddress: string;
  tokenKey: string;
  collectionAddress: string;
  price: string; // BigInt as string
  quantity: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  lastIndexedBlock: number;
  status: string;
}

export interface Token {
  name: string;
  tokenId: string; // BigInt as string
  key: string;
  imageUrl: string;
  imageUrlType: string | null;
  animationUrl: string | null;
  animationUrlType: string | null;
  description: string;
  metadataUrl: string;
  lastMetadataUpdate: string;
  vault: any | null;
  createdAt: string;
  updatedAt: string;
  collectionAddress: string;
  collection: Collection;
  ownership: string;
  topBids: TopBid[];
  rarityRank: string;
  traits: Trait[];
  listing: Listing | null;
  lastSalePrice: string | null;
}

export interface InventoryResponse {
  tokens: Token[];
  page: number;
}

export interface InventoryFilters {
  inventoryStatus?: 'show-all' | 'listed' | 'unlisted';
  eventOption?: 'All Events' | string;
  sort?:
    | 'Price ↑'
    | 'Price ↓'
    | 'Rarity ↑'
    | 'Rarity ↓'
    | 'Recently Listed'
    | string;
  collection?: string;
}

export interface InventoryParams {
  page?: number;
  filters?: InventoryFilters;
}

export interface LaunchpadRound {
  name: string;
  startTime: number;
  endTime: number;
  roundId: number;
  supply: number;
  minted: number;
  merkleRoot: string;
  maxPerWallet: number;
  price: number;
  isPublic: boolean;
  exists: boolean;
  isStarted: boolean;
  isEnded: boolean;
}

export interface LaunchpadData {
  id: string;
  identifier: string;
  address: string;
  name: string;
  description: string;
  symbol: string | null;
  owner: string;
  ownerName: string;
  image: string;
  coverImage: string;
  totalSupply: number;
  discord: string | null;
  twitter: string | null;
  telegram: string | null;
  royaltyReceivers: string[];
  royalties: number[];
  baseURI: string;
  isHidden: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  allRounds: LaunchpadRound[];
  maxSupply: number;
}

export interface LaunchpadResponse {
  status: boolean;
  data: LaunchpadData;
  message: string;
}

export class HyperliquidService {
  private readonly baseUrl = 'https://drip.trade/api';
  private readonly launchpadUrl = 'https://api558.liquidfi.app/api/v1';

  /**
   * Get portfolio inventory for a wallet address
   * @param walletAddress - The wallet address to fetch inventory for
   * @param params - Optional parameters for filtering and pagination
   * @returns Promise<InventoryResponse> - Portfolio inventory data
   */
  async getPortfolioInventory(
    walletAddress: string,
    params: InventoryParams = {}
  ): Promise<InventoryResponse> {
    const { page = 1, filters = {} } = params;

    // Default filters
    const defaultFilters: InventoryFilters = {
      inventoryStatus: 'show-all',
      eventOption: 'All Events',
      sort: 'Price ↑',
      ...filters
    };

    try {
      const url = `${this.baseUrl}/portfolio/${walletAddress}/inventory`;
      const searchParams = new URLSearchParams({
        page: page.toString(),
        filters: JSON.stringify(defaultFilters)
      });

      console.log(
        `Fetching Hyperliquid inventory: ${url}?${searchParams.toString()}`
      );

      const response = await fetch(`${url}?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: InventoryResponse = await response.json();

      console.log(
        `Fetched ${result.tokens.length} tokens from page ${result.page}`
      );

      return result;
    } catch (error) {
      console.error('Error fetching Hyperliquid portfolio inventory:', error);
      throw error;
    }
  }

  /**
   * Get all tokens from all pages for a wallet and collection
   * @param walletAddress - The wallet address
   * @param collectionAddress - The collection contract address
   * @param filters - Optional additional filters
   * @returns Promise<Token[]> - All tokens from all pages
   */
  async getAllTokensForCollection(
    walletAddress: string,
    collectionAddress: string,
    filters: Omit<InventoryFilters, 'collection'> = {}
  ): Promise<Token[]> {
    let allTokens: Token[] = [];
    let currentPage = 1;
    let hasMore = true;

    const collectionFilters: InventoryFilters = {
      ...filters,
      collection: collectionAddress
    };

    while (hasMore) {
      try {
        const response = await this.getPortfolioInventory(walletAddress, {
          page: currentPage,
          filters: collectionFilters
        });

        allTokens = allTokens.concat(response.tokens);

        // Check if we have more pages (if current page returns fewer tokens, we might be done)
        // Note: This is a simple heuristic - you might need to adjust based on API behavior
        hasMore = response.tokens.length > 0;

        if (hasMore) {
          currentPage++;
        }

        console.log(
          `Fetched page ${currentPage - 1}, total tokens so far: ${
            allTokens.length
          }`
        );
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error);
        hasMore = false;
      }
    }

    console.log(`Total tokens fetched: ${allTokens.length}`);
    return allTokens;
  }

  /**
   * Get tokens with progress callback
   * @param walletAddress - The wallet address
   * @param collectionAddress - The collection contract address
   * @param onProgress - Progress callback function
   * @param filters - Optional additional filters
   * @returns Promise<Token[]> - All tokens with progress updates
   */
  async getTokensWithProgress(
    walletAddress: string,
    collectionAddress: string,
    onProgress?: (current: number, page: number) => void,
    filters: Omit<InventoryFilters, 'collection'> = {}
  ): Promise<Token[]> {
    let allTokens: Token[] = [];
    let currentPage = 1;
    let hasMore = true;

    const collectionFilters: InventoryFilters = {
      ...filters,
      collection: collectionAddress
    };

    while (hasMore) {
      try {
        const response = await this.getPortfolioInventory(walletAddress, {
          page: currentPage,
          filters: collectionFilters
        });

        allTokens = allTokens.concat(response.tokens);

        // Call progress callback if provided
        if (onProgress) {
          onProgress(allTokens.length, currentPage);
        }

        hasMore = response.tokens.length > 0;

        if (hasMore) {
          currentPage++;
        }
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error);
        hasMore = false;
      }
    }

    return allTokens;
  }

  /**
   * Filter tokens by specific traits
   * @param tokens - Array of tokens to filter
   * @param traitFilters - Object with trait type as key and value as filter
   * @returns Filtered array of tokens
   */
  filterTokensByTraits(
    tokens: Token[],
    traitFilters: Record<string, string>
  ): Token[] {
    return tokens.filter((token) => {
      return Object.entries(traitFilters).every(([traitType, traitValue]) => {
        return token.traits.some((trait) => {
          return trait.type === traitType && trait.value === traitValue;
        });
      });
    });
  }

  /**
   * Get unique traits from an array of tokens
   * @param tokens - Array of tokens
   * @returns Object with trait types and their possible values
   */
  getUniqueTraits(tokens: Token[]): Record<string, Set<string>> {
    const uniqueTraits: Record<string, Set<string>> = {};

    tokens.forEach((token) => {
      token.traits.forEach((trait) => {
        if (!uniqueTraits[trait.type]) {
          uniqueTraits[trait.type] = new Set();
        }
        uniqueTraits[trait.type].add(trait.value);
      });
    });

    return uniqueTraits;
  }

  /**
   * Get tokens sorted by rarity rank
   * @param tokens - Array of tokens
   * @param ascending - Sort order (true for ascending, false for descending)
   * @returns Sorted array of tokens
   */
  sortTokensByRarity(tokens: Token[], ascending: boolean = true): Token[] {
    return [...tokens].sort((a, b) => {
      const rankA = parseInt(a.rarityRank);
      const rankB = parseInt(b.rarityRank);

      return ascending ? rankA - rankB : rankB - rankA;
    });
  }

  /**
   * Get tokens sorted by price
   * @param tokens - Array of tokens
   * @param ascending - Sort order (true for ascending, false for descending)
   * @returns Sorted array of tokens
   */
  sortTokensByPrice(tokens: Token[], ascending: boolean = true): Token[] {
    return [...tokens].sort((a, b) => {
      const priceA = a.listing ? parseFloat(a.listing.price) : 0;
      const priceB = b.listing ? parseFloat(b.listing.price) : 0;

      return ascending ? priceA - priceB : priceB - priceA;
    });
  }

  /**
   * Get only listed tokens
   * @param tokens - Array of tokens
   * @returns Array of tokens that have active listings
   */
  getListedTokens(tokens: Token[]): Token[] {
    return tokens.filter(
      (token) => token.listing && token.listing.status === 'Active'
    );
  }

  /**
   * Get only unlisted tokens
   * @param tokens - Array of tokens
   * @returns Array of tokens that don't have active listings
   */
  getUnlistedTokens(tokens: Token[]): Token[] {
    return tokens.filter(
      (token) => !token.listing || token.listing.status !== 'Active'
    );
  }

  /**
   * Convert BigInt price strings to readable format
   * @param priceString - Price as BigInt string
   * @param decimals - Number of decimals (default: 18 for ETH)
   * @returns Formatted price as number
   */
  formatPrice(priceString: string, decimals: number = 18): number {
    // Remove $bigint prefix if present
    const cleanPrice = priceString.replace('$bigint', '');
    const price = BigInt(cleanPrice);
    const divisor = BigInt(10 ** decimals);

    return Number(price) / Number(divisor);
  }

  /**
   * Get collection statistics from tokens
   * @param tokens - Array of tokens from the same collection
   * @returns Collection statistics
   */
  getCollectionStats(tokens: Token[]) {
    const listedTokens = this.getListedTokens(tokens);
    const prices = listedTokens
      .map((token) => this.formatPrice(token.listing!.price))
      .filter((price) => price > 0);

    const floorPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const avgPrice =
      prices.length > 0
        ? prices.reduce((sum, price) => sum + price, 0) / prices.length
        : 0;

    return {
      totalTokens: tokens.length,
      listedTokens: listedTokens.length,
      unlistedTokens: tokens.length - listedTokens.length,
      floorPrice,
      avgPrice,
      maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
      collection: tokens[0]?.collection || null
    };
  }

  /**
   * Get launchpad data for a specific identifier
   * @param identifier - The launchpad identifier (e.g., 'hypervasion')
   * @returns Promise<LaunchpadData> - Launchpad data
   */
  async getLaunchpad(identifier: string): Promise<LaunchpadData> {
    try {
      const url = `${this.launchpadUrl}/launchpad/${identifier}`;

      console.log(`Fetching Hyperliquid launchpad: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: LaunchpadResponse = await response.json();

      if (!result.status || !result.data) {
        throw new Error('Invalid launchpad response');
      }

      console.log(`Fetched launchpad data for ${identifier}`);

      return result.data;
    } catch (error) {
      console.error('Error fetching Hyperliquid launchpad:', error);
      throw error;
    }
  }
}
