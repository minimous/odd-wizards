import axios from "axios";

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

export class StargazeService {
  private readonly baseUrl = "https://api.intergaze-apis.com/api/v1/profiles";
  private readonly defaultLimit = 60;

  async getNfts(wallet: string, collectionAddr: string): Promise<any[]> {
    let allTokens: any[] = [];
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

        console.log(`Fetched ${tokens.length} tokens, total so far: ${allTokens.length}/${pageInfo.total}`);

      } catch (error) {
        console.error('Error fetching NFTs:', error);
        throw error;
      }
    }

    return allTokens;
  }

  // Alternative method that returns full response with pagination info
  async getNftsWithPagination(wallet: string, collectionAddr: string, limit: number = 60, offset: number = 0): Promise<NFTResponse> {
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

  // Method to get all NFTs with progress callback
  async getNftsWithProgress(
    wallet: string, 
    collectionAddr: string,
    onProgress?: (current: number, total: number) => void
  ): Promise<any[]> {
    let allTokens: any[] = [];
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
}