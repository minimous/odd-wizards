import { getToken as getStargazeToken } from './utils';
import { IntergazeService } from './intergaze/intergaze-service';
import { RaribleService } from './megaeth/rarible-service';
import { NETWORK_CONSTANT } from '@/constants';

export interface TokenInfo {
  id: string;
  name?: string;
  description?: string;
  tokenId: string;
  media?: {
    url?: string;
    type?: string;
    height?: number;
    width?: number;
    visualAssets?: any;
  };
  image?: string;
  traits?: any[];
  attributes?: any[];
  owner?: any;
  collection?: any;
  metadata?: any;
}

export class MultiNetworkTokenService {
  private intergazeService: IntergazeService;
  private raribleService: RaribleService;

  constructor() {
    this.intergazeService = new IntergazeService();
    this.raribleService = new RaribleService();
  }

  /**
   * Get token information based on network
   * @param network - Network identifier (stargaze, intergaze, megaeth)
   * @param collectionAddr - Collection contract address
   * @param tokenId - Token ID
   * @returns Promise<TokenInfo>
   */
  async getToken(
    network: string,
    collectionAddr: string,
    tokenId: string
  ): Promise<TokenInfo> {
    const networkLower = network.toLowerCase();

    switch (networkLower) {
      case NETWORK_CONSTANT.STARGAZE:
        return await this.getStargazeToken(collectionAddr, tokenId);

      case NETWORK_CONSTANT.INTERGAZE:
        return await this.getIntergazeToken(collectionAddr, tokenId);

      case NETWORK_CONSTANT.MEGAETH:
      case 'megaeth':
        return await this.getMegaETHToken(collectionAddr, tokenId);

      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }

  /**
   * Get token from Stargaze network
   */
  private async getStargazeToken(
    collectionAddr: string,
    tokenId: string
  ): Promise<TokenInfo> {
    try {
      const token = await getStargazeToken(collectionAddr, tokenId);
      return {
        id: token.id || `${collectionAddr}:${tokenId}`,
        name: token.name,
        description: token.description,
        tokenId: token.tokenId || tokenId,
        media: token.media,
        image: token.media?.url || token.media?.originalUrl,
        traits: token.traits || [],
        attributes: token.attributes || [],
        owner: token.owner,
        collection: token.collection
      };
    } catch (error) {
      console.error('Error fetching Stargaze token:', error);
      throw new Error(
        `Failed to fetch Stargaze token: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get token from Intergaze network
   */
  private async getIntergazeToken(
    collectionAddr: string,
    tokenId: string
  ): Promise<TokenInfo> {
    try {
      const token = await this.intergazeService.getToken(
        collectionAddr,
        tokenId
      );
      return {
        id: token.id || `${collectionAddr}:${tokenId}`,
        name: token.name,
        description: token.description,
        tokenId: token.tokenId || tokenId,
        media: token.media, // Add media field to match Stargaze structure
        image: token.media?.url || token.image, // Get image from media.url or fallback to image field
        traits: token.traits || token.attributes || [],
        attributes: token.attributes || token.traits || [],
        owner: token.owner,
        metadata: token.metadata,
        collection: token.collection // Add collection field if exists
      };
    } catch (error) {
      console.error('Error fetching Intergaze token:', error);
      throw new Error(
        `Failed to fetch Intergaze token: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get token from MegaETH network via Rarible
   */
  private async getMegaETHToken(
    collectionAddr: string,
    tokenId: string
  ): Promise<TokenInfo> {
    try {
      // Note: RaribleService might need a method to get single token
      // For now, we'll implement a basic structure
      // You may need to add a getSingleToken method to RaribleService

      throw new Error('MegaETH token fetching via Rarible not yet implemented');

      // Placeholder for future implementation:
      // const token = await this.raribleService.getSingleToken(collectionAddr, tokenId);
      // return {
      //   id: `${collectionAddr}:${tokenId}`,
      //   name: token.name,
      //   description: token.description,
      //   tokenId: tokenId,
      //   image: token.image,
      //   traits: token.traits || [],
      //   attributes: token.attributes || []
      // };
    } catch (error) {
      console.error('Error fetching MegaETH token:', error);
      throw new Error(
        `Failed to fetch MegaETH token: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Get supported networks
   */
  getSupportedNetworks(): string[] {
    return [NETWORK_CONSTANT.STARGAZE, NETWORK_CONSTANT.INTERGAZE, 'megaeth'];
  }

  /**
   * Check if network is supported
   */
  isNetworkSupported(network: string): boolean {
    return this.getSupportedNetworks().includes(network.toLowerCase());
  }
}

// Export a default instance for convenience
export const multiNetworkTokenService = new MultiNetworkTokenService();

// Legacy function for backward compatibility
export async function getTokenByNetwork(
  network: string,
  collectionAddr: string,
  tokenId: string
): Promise<TokenInfo> {
  return await multiNetworkTokenService.getToken(
    network,
    collectionAddr,
    tokenId
  );
}
