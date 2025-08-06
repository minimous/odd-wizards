import axios from 'axios';

interface PageInfo {
  total: number;
  limit: number;
  offset: number;
}

interface NFTResponse {
  address: string;
  pageInfo: PageInfo;
  tokens: any[]; // You can define a more specific type for tokens
}

interface Creator {
  address: string;
}

interface SalePrice {
  amount: string;
  denom: string;
  symbol: string;
  exponent: number;
}

interface AddressTokenCounts {
  limit: number;
  mintable: number;
  minted: number;
}

interface StageCounts {
  limit: number;
  mintable: number;
  minted: number;
}

interface BurnConditions {
  // Define specific burn condition fields if needed
}

interface MintStage {
  id: number;
  name: string;
  type: 'PRESALE' | 'PUBLIC';
  presaleType: 'REGULAR' | 'NONE';
  status: 'ACTIVE' | 'UPCOMING' | 'ENDED';
  startTime: string;
  endTime?: string;
  salePrice: SalePrice;
  addressTokenCounts: AddressTokenCounts;
  numMembers?: number;
  isMember: boolean;
  proofs: any[] | null;
  burnConditions?: BurnConditions | null;
  stageCounts?: StageCounts;
}

interface Minter {
  minterType: string;
  minterAddress: string;
  mintableTokens: number;
  numTokens: number;
  existingTokens: number;
  mintedTokens: number;
  airdroppedTokens: number;
  currentStage: MintStage;
  mintStages: MintStage[];
}

interface VisualAsset {
  type: 'image';
  height: number;
  width: number;
  url: string;
  staticUrl: string;
}

interface VisualAssets {
  lg: VisualAsset;
  md: VisualAsset;
  sm: VisualAsset;
  xl: VisualAsset;
  xs: VisualAsset;
}

interface Media {
  type: 'image';
  url: string;
  height: number;
  width: number;
  fallbackUrl: string;
  visualAssets: VisualAssets;
}

interface LaunchpadResponse {
  id: string;
  contractAddress: string;
  name: string;
  description: string;
  creator: Creator;
  startTradingTime: string;
  minter: Minter;
  media: Media;
}

// Interface untuk single NFT response
interface SingleNFTResponse {
  // Tambahkan field-field yang sesuai dengan response API
  id: string;
  tokenId: string;
  contractAddress: string;
  name?: string;
  description?: string;
  image?: string;
  attributes?: any[];
  traits?: any[];
  owner?: string;
  metadata?: any;
  // Tambahkan field lainnya sesuai dengan struktur response API
}

// Interface untuk NFT dari getAllNfts response
interface NFTToken {
  id: string;
  name: string;
  tokenId: string;
  description: string;
  collection: {
    contractAddress: string;
    name: string;
    creator: {
      address: string;
    };
    floorPrice: any;
    totalTokens: number;
    tradingAsset: any;
  };
  owner: {
    address: string;
  };
  price: any;
  isEscrowed: boolean;
  rarityRank: number;
  highestOffer: any;
  media: Media;
  // Traits akan ditambahkan dari getSingleNft
  traits: any[];
  attributes?: any[];
}

export class IntergazeService {
  private readonly baseUrl = 'https://api.intergaze-apis.com/api/v1/profiles';
  private readonly tokensBaseUrl =
    'https://api.intergaze-apis.com/api/v1/tokens';
  private readonly defaultLimit = 60;

  /**
   * Get all NFTs from a wallet for a specific collection (without traits)
   * @param wallet - Wallet address
   * @param collectionAddr - Collection contract address
   * @returns Promise<NFTToken[]> - Array of NFTs without traits
   */
  async getAllNfts(
    wallet: string,
    collectionAddr: string
  ): Promise<NFTToken[]> {
    let allTokens: NFTToken[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      try {
        const url = `${this.baseUrl}/${wallet}/tokens`;
        const params = {
          limit: this.defaultLimit,
          offset: offset,
          collectionAddr: collectionAddr,
          sort: 'price:desc'
        };

        const response = await axios.get<NFTResponse>(url, { params });
        const { tokens, pageInfo } = response.data;

        // Add current batch of tokens to the collection
        allTokens = allTokens.concat(tokens);

        // Check if we need to fetch more
        const fetchedSoFar = offset + tokens.length;
        hasMore = fetchedSoFar < pageInfo.total;

        if (hasMore) {
          offset += this.defaultLimit;
        }

        console.log(
          `Fetched ${tokens.length} tokens, total so far: ${allTokens.length}/${pageInfo.total}`
        );
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        throw error;
      }
    }

    return allTokens;
  }

  /**
   * Get all NFTs with traits included from getSingleNft calls
   * @param wallet - Wallet address
   * @param collectionAddr - Collection contract address
   * @param includeTraits - Whether to fetch traits for each NFT (default: true)
   * @returns Promise<NFTToken[]> - Array of NFTs with traits
   */
  async getAllNftsWithTraits(
    wallet: string,
    collectionAddr: string,
    includeTraits: boolean = true
  ): Promise<NFTToken[]> {
    // First get all NFTs
    const allTokens = await this.getAllNfts(wallet, collectionAddr);

    if (!includeTraits) {
      return allTokens;
    }

    console.log(`Fetching traits for ${allTokens.length} NFTs...`);

    // Fetch traits for each NFT
    const tokensWithTraits = await Promise.allSettled(
      allTokens.map(async (token) => {
        try {
          const singleNft = await this.getSingleNft(
            collectionAddr,
            token.tokenId
          );
          return {
            ...token,
            traits: singleNft.traits || singleNft.attributes || [],
            attributes: singleNft.attributes || singleNft.traits || []
          };
        } catch (error) {
          console.warn(
            `Failed to fetch traits for token ${token.tokenId}:`,
            error
          );
          // Return token without traits if getSingleNft fails
          return {
            ...token,
            traits: [],
            attributes: []
          };
        }
      })
    );

    // Extract successful results and handle failed ones
    const results = tokensWithTraits.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.warn(
          `Failed to process token at index ${index}:`,
          result.reason
        );
        return {
          ...allTokens[index],
          traits: [],
          attributes: []
        };
      }
    });

    console.log(`Successfully fetched traits for ${results.length} NFTs`);
    return results;
  }

  /**
   * Alternative method that returns full response with pagination info
   * @param wallet - Wallet address
   * @param collectionAddr - Collection contract address
   * @param limit - Number of items per page (default: 60)
   * @param offset - Offset for pagination (default: 0)
   * @returns Promise<NFTResponse> - Paginated NFT response
   */
  async getNftsWithPagination(
    wallet: string,
    collectionAddr: string,
    limit: number = 60,
    offset: number = 0
  ): Promise<NFTResponse> {
    try {
      const url = `${this.baseUrl}/${wallet}/tokens`;
      const params = {
        limit: limit,
        offset: offset,
        collectionAddr: collectionAddr,
        sort: 'price:desc'
      };

      const response = await axios.get<NFTResponse>(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching NFTs with pagination:', error);
      throw error;
    }
  }

  /**
   * Method to get all NFTs with progress callback
   * @param wallet - Wallet address
   * @param collectionAddr - Collection contract address
   * @param onProgress - Progress callback function
   * @returns Promise<NFTToken[]> - Array of NFTs
   */
  async getNftsWithProgress(
    wallet: string,
    collectionAddr: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<NFTToken[]> {
    let allTokens: NFTToken[] = [];
    let offset = 0;
    let hasMore = true;
    let total = 0;

    while (hasMore) {
      try {
        const url = `${this.baseUrl}/${wallet}/tokens`;
        const params = {
          limit: this.defaultLimit,
          offset: offset,
          collectionAddr: collectionAddr,
          sort: 'price:desc'
        };

        const response = await axios.get<NFTResponse>(url, { params });
        const { tokens, pageInfo } = response.data;

        // Set total on first request
        if (offset === 0) {
          total = pageInfo.total;
        }

        // Add current batch of tokens to the collection
        allTokens = allTokens.concat(tokens);

        // Call progress callback if provided
        if (onProgress) {
          onProgress(allTokens.length, total);
        }

        // Check if we need to fetch more
        const fetchedSoFar = offset + tokens.length;
        hasMore = fetchedSoFar < pageInfo.total;

        if (hasMore) {
          offset += this.defaultLimit;
        }
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        throw error;
      }
    }

    return allTokens;
  }

  /**
   * Get all NFTs with progress callback and traits included
   * @param wallet - Wallet address
   * @param collectionAddr - Collection contract address
   * @param onProgress - Progress callback for fetching NFTs
   * @param onTraitsProgress - Progress callback for fetching traits
   * @param includeTraits - Whether to fetch traits (default: true)
   * @returns Promise<NFTToken[]> - Array of NFTs with traits
   */
  async getNftsWithProgressAndTraits(
    wallet: string,
    collectionAddr: string,
    onProgress?: (current: number, total: number) => void,
    onTraitsProgress?: (current: number, total: number) => void,
    includeTraits: boolean = true
  ): Promise<NFTToken[]> {
    // First get all NFTs with progress
    const allTokens = await this.getNftsWithProgress(
      wallet,
      collectionAddr,
      onProgress
    );

    if (!includeTraits) {
      return allTokens;
    }

    console.log(`Fetching traits for ${allTokens.length} NFTs...`);

    // Fetch traits for each NFT with progress tracking
    const tokensWithTraits: NFTToken[] = [];

    for (let i = 0; i < allTokens.length; i++) {
      const token = allTokens[i];
      try {
        const singleNft = await this.getSingleNft(
          collectionAddr,
          token.tokenId
        );
        tokensWithTraits.push({
          ...token,
          traits: singleNft.traits || singleNft.attributes || [],
          attributes: singleNft.attributes || singleNft.traits || []
        });
      } catch (error) {
        console.warn(
          `Failed to fetch traits for token ${token.tokenId}:`,
          error
        );
        tokensWithTraits.push({
          ...token,
          traits: [],
          attributes: []
        });
      }

      // Call traits progress callback
      if (onTraitsProgress) {
        onTraitsProgress(i + 1, allTokens.length);
      }
    }

    console.log(
      `Successfully processed ${tokensWithTraits.length} NFTs with traits`
    );
    return tokensWithTraits;
  }

  /**
   * Get launchpad information for a collection
   * @param collectionAddress - Collection contract address
   * @param walletAddress - Optional wallet address for user-specific data
   * @returns Promise<LaunchpadResponse> - Launchpad data
   */
  async getLaunchpad(
    collectionAddress: string,
    walletAddress?: string
  ): Promise<LaunchpadResponse> {
    try {
      const resp = await axios.get<LaunchpadResponse>(
        `https://api.intergaze-apis.com/api/v1/minters/${collectionAddress}${
          walletAddress ? `?wallet=${walletAddress}` : ''
        }`
      );
      return resp.data;
    } catch (error) {
      console.error('Error fetching launchpad data:', error);
      throw error;
    }
  }

  /**
   * Get single NFT data by collection address and token ID
   * @param collectionAddress - The collection contract address
   * @param tokenId - The token ID
   * @returns Promise<SingleNFTResponse> - Single NFT data
   */
  async getSingleNft(
    collectionAddress: string,
    tokenId: string | number
  ): Promise<SingleNFTResponse> {
    try {
      const url = `${this.tokensBaseUrl}/${collectionAddress}/${tokenId}`;

      const response = await axios.get<SingleNFTResponse>(url);

      console.log(`Fetched single NFT: ${collectionAddress}/${tokenId}`);

      return response.data;
    } catch (error) {
      console.error('Error fetching single NFT:', error);
      throw error;
    }
  }

  /**
   * Batch get multiple single NFTs (useful for getting traits for specific tokens)
   * @param collectionAddress - Collection contract address
   * @param tokenIds - Array of token IDs
   * @param onProgress - Progress callback
   * @returns Promise<SingleNFTResponse[]> - Array of single NFT data
   */
  async getBatchSingleNfts(
    collectionAddress: string,
    tokenIds: (string | number)[],
    onProgress?: (current: number, total: number) => void
  ): Promise<SingleNFTResponse[]> {
    console.log(`Fetching ${tokenIds.length} individual NFTs...`);

    const results: SingleNFTResponse[] = [];

    for (let i = 0; i < tokenIds.length; i++) {
      try {
        const nft = await this.getSingleNft(collectionAddress, tokenIds[i]);
        results.push(nft);
      } catch (error) {
        console.warn(`Failed to fetch NFT ${tokenIds[i]}:`, error);
        // You might want to push a placeholder or skip
      }

      if (onProgress) {
        onProgress(i + 1, tokenIds.length);
      }
    }

    return results;
  }

  /**
   * Helper method to extract unique traits from an array of NFTs
   * @param nfts - Array of NFTs with traits
   * @returns Object with trait types and their possible values
   */
  getUniqueTraits(nfts: NFTToken[]): Record<string, Set<string>> {
    const uniqueTraits: Record<string, Set<string>> = {};

    nfts.forEach((nft) => {
      const traits = nft.traits || nft.attributes || [];
      traits.forEach((trait: any) => {
        const traitType = trait.trait_type || trait.type || 'Unknown';
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
   * @param filters - Object with trait_type as key and value as filter
   * @returns Filtered array of NFTs
   */
  filterNftsByTraits(
    nfts: NFTToken[],
    filters: Record<string, string>
  ): NFTToken[] {
    return nfts.filter((nft) => {
      const traits = nft.traits || nft.attributes || [];

      return Object.entries(filters).every(([traitType, traitValue]) => {
        return traits.some((trait: any) => {
          const currentTraitType = trait.trait_type || trait.type;
          const currentTraitValue = trait.value || trait.name;

          return (
            currentTraitType === traitType && currentTraitValue === traitValue
          );
        });
      });
    });
  }

  /**
   * Get single token data by collection address and token ID using the tokens API
   * This is an alternative to getSingleNft with potentially different data structure
   * @param collectionAddress - The collection contract address
   * @param tokenId - The token ID
   * @returns Promise<any> - Single token data from tokens API
   */
  async getToken(
    collectionAddress: string,
    tokenId: string | number
  ): Promise<any> {
    try {
      const url = `${this.tokensBaseUrl}/${collectionAddress}/${tokenId}`;

      console.log(`Fetching token from Intergaze API: ${url}`);

      const response = await axios.get(url);

      console.log(`Fetched token: ${collectionAddress}/${tokenId}`);

      return response.data;
    } catch (error) {
      console.error('Error fetching token from Intergaze:', error);
      throw error;
    }
  }
}
