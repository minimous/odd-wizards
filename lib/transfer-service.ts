import { getChainConfig, ChainConfig } from './chain-config';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { StargazeService } from './stargaze/stargaze-service';
import { IntergazeService } from './intergaze/intergaze-service';
import { RaribleService } from './megaeth/rarible-service';

export interface TransferResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  chainData?: any;
}

export interface NFTTransferParams {
  contractAddress: string;
  recipientAddress: string;
  tokenId: string;
  mnemonic?: string;
}

export class MultiChainTransferService {
  private stargazeService: StargazeService;
  private intergazeService: IntergazeService;
  private raribleService: RaribleService;

  constructor() {
    this.stargazeService = new StargazeService();
    this.intergazeService = new IntergazeService();
    this.raribleService = new RaribleService();
  }

  /**
   * Transfer NFT based on chain
   * @param chain - Chain identifier (stargaze, intergaze, megaeth)
   * @param params - Transfer parameters
   * @returns Promise<TransferResult>
   */
  async transferNFT(
    chain: string,
    params: NFTTransferParams
  ): Promise<TransferResult> {
    try {
      const chainConfig = getChainConfig(chain);
      const mnemonic = params.mnemonic || chainConfig.rewardWalletMnemonic;

      if (!mnemonic) {
        throw new Error(`No mnemonic found for chain: ${chain}`);
      }

      switch (chain.toLowerCase()) {
        case 'stargaze':
          return await this.transferStargazeNFT(chainConfig, {
            ...params,
            mnemonic
          });

        case 'intergaze':
          return await this.transferIntergazeNFT(chainConfig, {
            ...params,
            mnemonic
          });

        case 'megaeth':
          return await this.transferMegaETHNFT(chainConfig, {
            ...params,
            mnemonic
          });

        default:
          throw new Error(`Unsupported chain: ${chain}`);
      }
    } catch (error) {
      console.error(`Transfer error for chain ${chain}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Transfer NFT on Stargaze network
   */
  private async transferStargazeNFT(
    chainConfig: ChainConfig,
    params: NFTTransferParams
  ): Promise<TransferResult> {
    try {
      // Create wallet instance from mnemonic
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        params.mnemonic!,
        {
          prefix: chainConfig.prefix
        }
      );

      // Get the wallet address
      const [firstAccount] = await wallet.getAccounts();
      console.log('Stargaze sender address:', firstAccount.address);

      // Create signing client
      const client = await SigningCosmWasmClient.connectWithSigner(
        chainConfig.rpcUrl,
        wallet,
        {
          gasPrice: GasPrice.fromString(chainConfig.gasPrice)
        }
      );

      // Prepare transfer message
      const transferMsg = {
        transfer_nft: {
          recipient: params.recipientAddress,
          token_id: params.tokenId
        }
      };

      // Execute transfer
      const result = await client.execute(
        firstAccount.address,
        params.contractAddress,
        transferMsg,
        'auto', // automatic gas estimation
        '', // memo
        [] // funds
      );

      console.log('Stargaze transfer successful!');
      console.log('Transaction hash:', result.transactionHash);

      return {
        success: true,
        transactionHash: result.transactionHash,
        chainData: {
          senderAddress: firstAccount.address,
          gasUsed: result.gasUsed,
          gasWanted: result.gasWanted
        }
      };
    } catch (error) {
      console.error('Stargaze transfer error:', error);
      throw error;
    }
  }

  /**
   * Transfer NFT on Intergaze network (using CosmWasm)
   */
  private async transferIntergazeNFT(
    chainConfig: ChainConfig,
    params: NFTTransferParams
  ): Promise<TransferResult> {
    try {
      // Create wallet instance from mnemonic
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        params.mnemonic!,
        {
          prefix: chainConfig.prefix
        }
      );

      // Get the wallet address
      const [firstAccount] = await wallet.getAccounts();
      console.log('Intergaze sender address:', firstAccount.address);

      // Create signing client
      const client = await SigningCosmWasmClient.connectWithSigner(
        chainConfig.rpcUrl,
        wallet,
        {
          gasPrice: GasPrice.fromString(chainConfig.gasPrice)
        }
      );

      // Prepare transfer message for Intergaze (similar to CosmWasm)
      const transferMsg = {
        transfer_nft: {
          recipient: params.recipientAddress,
          token_id: params.tokenId
        }
      };

      // Execute transfer
      const result = await client.execute(
        firstAccount.address,
        params.contractAddress,
        transferMsg,
        'auto', // automatic gas estimation
        'Intergaze NFT Transfer', // memo
        [] // funds
      );

      console.log('Intergaze transfer successful!');
      console.log('Transaction hash:', result.transactionHash);

      return {
        success: true,
        transactionHash: result.transactionHash,
        chainData: {
          senderAddress: firstAccount.address,
          gasUsed: result.gasUsed,
          gasWanted: result.gasWanted,
          chain: 'intergaze'
        }
      };
    } catch (error) {
      console.error('Intergaze transfer error:', error);
      throw error;
    }
  }

  /**
   * Transfer NFT on MegaETH network (EVM-based)
   * Note: This is a placeholder implementation since MegaETH uses EVM
   * You'll need to implement EVM-based NFT transfer using ethers.js or web3.js
   */
  private async transferMegaETHNFT(
    chainConfig: ChainConfig,
    params: NFTTransferParams
  ): Promise<TransferResult> {
    try {
      // TODO: Implement EVM-based NFT transfer
      // This would require:
      // 1. ethers.js or web3.js setup
      // 2. ERC-721 contract interaction
      // 3. Gas estimation and transaction signing

      console.log('MegaETH transfer - placeholder implementation');
      console.log('Contract:', params.contractAddress);
      console.log('Recipient:', params.recipientAddress);
      console.log('Token ID:', params.tokenId);

      // Placeholder return - implement actual EVM transfer
      throw new Error(
        'MegaETH NFT transfer not yet implemented - requires EVM integration'
      );

      // Example of what the implementation would look like:
      /*
      import { ethers } from 'ethers';
      
      const provider = new ethers.JsonRpcProvider(chainConfig.rpcUrl);
      const wallet = ethers.Wallet.fromMnemonic(params.mnemonic!).connect(provider);
      
      const erc721ABI = [
        "function transferFrom(address from, address to, uint256 tokenId)"
      ];
      
      const contract = new ethers.Contract(params.contractAddress, erc721ABI, wallet);
      const tx = await contract.transferFrom(wallet.address, params.recipientAddress, params.tokenId);
      
      return {
        success: true,
        transactionHash: tx.hash,
        chainData: {
          senderAddress: wallet.address,
          chain: 'megaeth'
        }
      };
      */
    } catch (error) {
      console.error('MegaETH transfer error:', error);
      throw error;
    }
  }

  /**
   * Get supported chains
   */
  getSupportedChains(): string[] {
    return ['stargaze', 'intergaze', 'megaeth'];
  }

  /**
   * Validate chain support
   */
  isChainSupported(chain: string): boolean {
    return this.getSupportedChains().includes(chain.toLowerCase());
  }
}

// Legacy function for backward compatibility
export async function transferNFT(
  mnemonic: string,
  contractAddress: string,
  recipientAddress: string,
  tokenId: string
): Promise<any> {
  const transferService = new MultiChainTransferService();
  const result = await transferService.transferNFT('stargaze', {
    contractAddress,
    recipientAddress,
    tokenId,
    mnemonic
  });

  if (!result.success) {
    throw new Error(result.error || 'Transfer failed');
  }

  return {
    transactionHash: result.transactionHash,
    ...result.chainData
  };
}

export default MultiChainTransferService;
