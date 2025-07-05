import axios from 'axios';

interface Currency {
  id: string;
  abbreviation: string;
  usdExchangeRate: string;
  icon?: string;
  symbol?: string;
}

interface Price {
  amount: string | number;
  currency: Currency;
}

interface Collection {
  id: string;
  blockchain: string;
  collectionId?: string;
  name?: string;
  verified?: boolean;
}

interface RaribleNFT {
  id: string;
  collection: Collection;
  name: string;
  image: string;
  owner: string;
  price?: Price;
  lastSellPrice?: Price;
}

interface SearchFilters {
  status: 'all' | 'for_sale' | 'not_for_sale';
  collection: string;
  blockchains: string[];
}

interface SearchPayload {
  sort: 'HIGH_PRICE_FIRST' | 'LOW_PRICE_FIRST' | 'NEWEST' | 'OLDEST';
  filters: SearchFilters;
  continuation?: string;
  size?: number;
}

interface SearchResponse {
  nfts: RaribleNFT[];
  continuation?: string;
  totalNftsCount?: number;
}

interface Phase {
  price: Price;
  startDate: string;
  endDate: string;
  maxMintPerWallet: number;
  type: 'allowlist' | 'public';
}

interface Fee {
  type: 'PERCENTAGE' | 'FIXED';
  amount: number;
}

interface Media {
  type: 'image' | 'video';
  url: string;
}

interface LaunchpadResponse {
  id: string;
  blockchain: string;
  title: string;
  description: string;
  tokenStandard: string;
  totalSupply: number;
  isVerified: boolean;
  phases: Phase[];
  fees: Fee[];
  type: string;
  media: Media;
  author: string;
}

interface MintedResponse {
  minted: number;
}

interface Attribute {
  key: string;
  value: string;
}

interface Trait {
  key: string;
  value: string;
  rarity: string;
}

interface MediaItem {
  url: string;
  dimension?: {
    width: number;
    height: number;
  };
  sizeType: string;
  contentType: string;
  sourceMimeType: string;
}

interface SingleNFTResponse {
  nft: {
    id: string;
    blockchain: string;
    itemId: string;
    collection: Collection;
    name: string;
    media: MediaItem[];
    owner: string;
    price?: Price;
    lastSellPrice?: Price;
    attributes: Attribute[];
    traits: Trait[];
    image: string;
  };
}

export class RaribleService {
  private readonly baseUrl = 'https://bff.rarible.fun/api';
  private readonly defaultSize = 40;

  /**
   * Get all NFTs from a collection with pagination
   * @param collectionId - Collection ID (e.g., "MEGAETHTESTNET:0xa3bf0fa4a0c4763cf2b71d32e2c09914aa686ae0")
   * @param blockchains - Array of blockchain names (default: ["MEGAETHTESTNET", "BASECAMPTESTNET", "RARI"])
   * @param sort - Sort order (default: "HIGH_PRICE_FIRST")
   * @param status - NFT status filter (default: "all")
   * @returns Promise<RaribleNFT[]> - Array of NFTs
   */
  async getAllNfts(
    collectionId: string,
    blockchains: string[] = ['MEGAETHTESTNET', 'BASECAMPTESTNET', 'RARI'],
    sort:
      | 'HIGH_PRICE_FIRST'
      | 'LOW_PRICE_FIRST'
      | 'NEWEST'
      | 'OLDEST' = 'HIGH_PRICE_FIRST',
    status: 'all' | 'for_sale' | 'not_for_sale' = 'all'
  ): Promise<RaribleNFT[]> {
    let allNfts: RaribleNFT[] = [];
    let continuation: string | undefined;
    let hasMore = true;

    while (hasMore) {
      try {
        const payload: SearchPayload = {
          sort,
          filters: {
            status,
            collection: collectionId,
            blockchains
          }
        };

        if (continuation) {
          payload.continuation = continuation;
        }

        const response = await axios.post<SearchResponse>(
          `${this.baseUrl}/nfts/search`,
          payload
        );

        const { nfts, continuation: nextContinuation } = response.data;

        // Add current batch of NFTs to the collection
        allNfts = allNfts.concat(nfts);

        // Check if we need to fetch more
        continuation = nextContinuation;
        hasMore = !!continuation;

        console.log(
          `Fetched ${nfts.length} NFTs, total so far: ${allNfts.length}`
        );
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        throw error;
      }
    }

    return allNfts;
  }

  /**
   * Get NFTs with pagination support
   * @param collectionId - Collection ID
   * @param blockchains - Array of blockchain names
   * @param sort - Sort order
   * @param status - NFT status filter
   * @param size - Number of items per page (default: 40)
   * @param continuation - Continuation token for pagination
   * @returns Promise<SearchResponse> - Paginated NFT response
   */
  async getNftsWithPagination(
    collectionId: string,
    blockchains: string[] = ['MEGAETHTESTNET', 'BASECAMPTESTNET', 'RARI'],
    sort:
      | 'HIGH_PRICE_FIRST'
      | 'LOW_PRICE_FIRST'
      | 'NEWEST'
      | 'OLDEST' = 'HIGH_PRICE_FIRST',
    status: 'all' | 'for_sale' | 'not_for_sale' = 'all',
    size: number = this.defaultSize,
    continuation?: string
  ): Promise<SearchResponse> {
    try {
      const payload: SearchPayload = {
        sort,
        filters: {
          status,
          collection: collectionId,
          blockchains
        },
        size
      };

      if (continuation) {
        payload.continuation = continuation;
      }

      const response = await axios.post<SearchResponse>(
        `${this.baseUrl}/nfts/search`,
        payload
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching NFTs with pagination:', error);
      throw error;
    }
  }

  /**
   * Get all NFTs with progress callback
   * @param collectionId - Collection ID
   * @param onProgress - Progress callback function
   * @param blockchains - Array of blockchain names
   * @param sort - Sort order
   * @param status - NFT status filter
   * @returns Promise<RaribleNFT[]> - Array of NFTs
   */
  async getNftsWithProgress(
    collectionId: string,
    onProgress?: (current: number, total: number) => void,
    blockchains: string[] = ['MEGAETHTESTNET', 'BASECAMPTESTNET', 'RARI'],
    sort:
      | 'HIGH_PRICE_FIRST'
      | 'LOW_PRICE_FIRST'
      | 'NEWEST'
      | 'OLDEST' = 'HIGH_PRICE_FIRST',
    status: 'all' | 'for_sale' | 'not_for_sale' = 'all'
  ): Promise<RaribleNFT[]> {
    let allNfts: RaribleNFT[] = [];
    let continuation: string | undefined;
    let hasMore = true;
    let total = 0;

    while (hasMore) {
      try {
        const payload: SearchPayload = {
          sort,
          filters: {
            status,
            collection: collectionId,
            blockchains
          }
        };

        if (continuation) {
          payload.continuation = continuation;
        }

        const response = await axios.post<SearchResponse>(
          `${this.baseUrl}/nfts/search`,
          payload
        );

        const {
          nfts,
          continuation: nextContinuation,
          totalNftsCount
        } = response.data;

        // Set total on first request
        if (allNfts.length === 0 && totalNftsCount) {
          total = totalNftsCount;
        }

        // Add current batch of NFTs to the collection
        allNfts = allNfts.concat(nfts);

        // Call progress callback if provided
        if (onProgress) {
          onProgress(allNfts.length, total || allNfts.length);
        }

        // Check if we need to fetch more
        continuation = nextContinuation;
        hasMore = !!continuation;
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        throw error;
      }
    }

    return allNfts;
  }

  /**
   * Get all NFTs with traits included from getSingleNft calls
   * @param collectionId - Collection ID
   * @param includeTraits - Whether to fetch traits for each NFT (default: true)
   * @param onProgress - Progress callback for fetching NFTs
   * @param onTraitsProgress - Progress callback for fetching traits
   * @param blockchains - Array of blockchain names
   * @param sort - Sort order
   * @param status - NFT status filter
   * @returns Promise<(RaribleNFT & { traits?: Trait[], attributes?: Attribute[] })[]> - Array of NFTs with traits
   */
  async getAllNftsWithTraits(
    collectionId: string,
    includeTraits: boolean = true,
    onProgress?: (current: number, total: number) => void,
    onTraitsProgress?: (current: number, total: number) => void,
    blockchains: string[] = ['MEGAETHTESTNET', 'BASECAMPTESTNET', 'RARI'],
    sort:
      | 'HIGH_PRICE_FIRST'
      | 'LOW_PRICE_FIRST'
      | 'NEWEST'
      | 'OLDEST' = 'HIGH_PRICE_FIRST',
    status: 'all' | 'for_sale' | 'not_for_sale' = 'all'
  ): Promise<(RaribleNFT & { traits?: Trait[]; attributes?: Attribute[] })[]> {
    // First get all NFTs
    const allNfts = await this.getNftsWithProgress(
      collectionId,
      onProgress,
      blockchains,
      sort,
      status
    );

    if (!includeTraits) {
      return allNfts;
    }

    console.log(`Fetching traits for ${allNfts.length} NFTs...`);

    // Fetch traits for each NFT with progress tracking
    const nftsWithTraits: (RaribleNFT & {
      traits?: Trait[];
      attributes?: Attribute[];
    })[] = [];

    for (let i = 0; i < allNfts.length; i++) {
      const nft = allNfts[i];
      try {
        const singleNftResponse = await this.getSingleNft(nft.id);
        nftsWithTraits.push({
          ...nft,
          traits: singleNftResponse.nft.traits || [],
          attributes: singleNftResponse.nft.attributes || []
        });
      } catch (error) {
        console.warn(`Failed to fetch traits for NFT ${nft.id}:`, error);
        nftsWithTraits.push({
          ...nft,
          traits: [],
          attributes: []
        });
      }

      // Call traits progress callback
      if (onTraitsProgress) {
        onTraitsProgress(i + 1, allNfts.length);
      }
    }

    console.log(
      `Successfully processed ${nftsWithTraits.length} NFTs with traits`
    );
    return nftsWithTraits;
  }

  /**
   * Get single NFT data by NFT ID
   * @param nftId - The NFT ID (e.g., "MEGAETHTESTNET:0xa3bf0fa4a0c4763cf2b71d32e2c09914aa686ae0:384")
   * @returns Promise<SingleNFTResponse> - Single NFT data with traits
   */
  async getSingleNft(nftId: string): Promise<SingleNFTResponse> {
    try {
      const url = `${this.baseUrl}/nfts/${nftId}`;
      const response = await axios.get<SingleNFTResponse>(url);

      console.log(`Fetched single NFT: ${nftId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching single NFT:', error);
      throw error;
    }
  }

  /**
   * Batch get multiple single NFTs (useful for getting traits for specific tokens)
   * @param nftIds - Array of NFT IDs
   * @param onProgress - Progress callback
   * @returns Promise<SingleNFTResponse[]> - Array of single NFT data
   */
  async getBatchSingleNfts(
    nftIds: string[],
    onProgress?: (current: number, total: number) => void
  ): Promise<SingleNFTResponse[]> {
    console.log(`Fetching ${nftIds.length} individual NFTs...`);

    const results: SingleNFTResponse[] = [];

    for (let i = 0; i < nftIds.length; i++) {
      try {
        const nft = await this.getSingleNft(nftIds[i]);
        results.push(nft);
      } catch (error) {
        console.warn(`Failed to fetch NFT ${nftIds[i]}:`, error);
        // You might want to push a placeholder or skip
      }

      if (onProgress) {
        onProgress(i + 1, nftIds.length);
      }
    }

    return results;
  }

  /**
   * Get launchpad/drop information for a collection
   * @param collectionId - Collection ID (e.g., "MEGAETHTESTNET:0xa3bf0fa4a0c4763cf2b71d32e2c09914aa686ae0")
   * @returns Promise<LaunchpadResponse> - Launchpad/drop data
   */
  async getLaunchpad(collectionId: string): Promise<LaunchpadResponse> {
    try {
      const response = await axios.get<LaunchpadResponse>(
        `${this.baseUrl}/drops/MEGAETHTESTNET:${collectionId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching launchpad data:', error);
      throw error;
    }
  }

  /**
   * Get minted count for a collection
   * @param collectionId - Collection ID
   * @returns Promise<MintedResponse> - Minted count data
   */
  async getMintedCount(collectionId: string): Promise<MintedResponse> {
    try {
      const response = await axios.post<MintedResponse>(
        `${this.baseUrl}/drops/MEGAETHTESTNET:${collectionId}/minted`,
        {
          id: `MEGAETHTESTNET:${collectionId}`
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching minted count:', error);
      throw error;
    }
  }

  /**
   * Helper method to extract unique traits from an array of NFTs with traits
   * @param nfts - Array of NFTs with traits
   * @returns Object with trait types and their possible values
   */
  getUniqueTraits(
    nfts: (RaribleNFT & { traits?: Trait[]; attributes?: Attribute[] })[]
  ): Record<string, Set<string>> {
    const uniqueTraits: Record<string, Set<string>> = {};

    nfts.forEach((nft) => {
      const traits = nft.traits || nft.attributes || [];
      traits.forEach((trait: any) => {
        const traitType =
          trait.key || trait.trait_type || trait.type || 'Unknown';
        const traitValue = trait.value || trait.name || 'Unknown';

        if (!uniqueTraits[traitType]) {
          uniqueTraits[traitType] = new Set();
        }
        uniqueTraits[traitType].add(traitValue);
      });
    });

    return uniqueTraits;
  }

  /**
   * Filter NFTs by specific traits
   * @param nfts - Array of NFTs to filter
   * @param filters - Object with trait key as key and value as filter
   * @returns Filtered array of NFTs
   */
  filterNftsByTraits(
    nfts: (RaribleNFT & { traits?: Trait[]; attributes?: Attribute[] })[],
    filters: Record<string, string>
  ): (RaribleNFT & { traits?: Trait[]; attributes?: Attribute[] })[] {
    return nfts.filter((nft) => {
      const traits = nft.traits || nft.attributes || [];

      return Object.entries(filters).every(([traitKey, traitValue]) => {
        return traits.some((trait: any) => {
          const currentTraitKey = trait.key || trait.trait_type || trait.type;
          const currentTraitValue = trait.value || trait.name;

          return (
            currentTraitKey === traitKey && currentTraitValue === traitValue
          );
        });
      });
    });
  }

  /**
   * Get collection statistics
   * @param collectionId - Collection ID
   * @returns Promise with collection stats
   */
  async getCollectionStats(collectionId: string): Promise<{
    totalSupply: number;
    minted: number;
    launchpadInfo: LaunchpadResponse;
  }> {
    try {
      const [launchpadInfo, mintedInfo] = await Promise.all([
        this.getLaunchpad(collectionId),
        this.getMintedCount(collectionId)
      ]);

      return {
        totalSupply: launchpadInfo.totalSupply,
        minted: mintedInfo.minted,
        launchpadInfo
      };
    } catch (error) {
      console.error('Error fetching collection stats:', error);
      throw error;
    }
  }

  /**
   * Search NFTs with custom filters
   * @param searchOptions - Search configuration
   * @returns Promise<SearchResponse> - Search results
   */
  async searchNfts(searchOptions: {
    collectionId: string;
    blockchains?: string[];
    sort?: 'HIGH_PRICE_FIRST' | 'LOW_PRICE_FIRST' | 'NEWEST' | 'OLDEST';
    status?: 'all' | 'for_sale' | 'not_for_sale';
    size?: number;
    continuation?: string;
  }): Promise<SearchResponse> {
    const {
      collectionId,
      blockchains = ['MEGAETHTESTNET', 'BASECAMPTESTNET', 'RARI'],
      sort = 'HIGH_PRICE_FIRST',
      status = 'all',
      size = this.defaultSize,
      continuation
    } = searchOptions;

    return this.getNftsWithPagination(
      collectionId,
      blockchains,
      sort,
      status,
      size,
      continuation
    );
  }
}
