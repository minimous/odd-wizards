import { getChainConfig, ChainConfig } from './chain-config';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { AddressUtils } from './address-utils';
import axios from 'axios';
// import { stringToPath } from '@cosmjs/crypto'; // Removed due to type conflicts

import { secp256k1 } from '@noble/curves/secp256k1';
import { keccak256 } from 'js-sha3';
import { toBech32 } from '@cosmjs/encoding';
const bip39 = require('bip39');
const bip32 = require('bip32');
import { StargazeService } from './stargaze/stargaze-service';
import { IntergazeService } from './intergaze/intergaze-service';
import { RaribleService } from './megaeth/rarible-service';
import { Mnemonic } from './mnemonic';
// Import the entire module to bypass TypeScript export issues
const initia = require('@initia/initia.js');

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

// =========================================================
// NFT TOKEN INTERFACE FOR CLEAN TRANSFER SYSTEM
// =========================================================

export interface NFTToken {
  tokenId: string;
  name: string;
  collection: {
    contractAddress: string;
  };
  isEscrowed: boolean;
  price?: {
    id: string;
    amount: string;
    denom: string;
  } | null;
}

// =========================================================
// UTILITY FUNCTIONS FOR CLEAN TRANSFER SYSTEM
// =========================================================

/**
 * Cek apakah token sedang di-list di marketplace
 */
function isTokenListed(token: NFTToken): boolean {
  return token.isEscrowed && !!token.price?.id;
}

/**
 * Validasi alamat wallet
 */
function isValidWalletAddress(address: string): boolean {
  return Boolean(address && address.startsWith('stars') && address.length > 20);
}

/**
 * Membuat message transaksi CosmWasm untuk Stargaze
 */
function createStargazeTransferMessage(
  senderAddress: string,
  contractAddress: string,
  recipientAddress: string,
  tokenId: string
) {
  return {
    transfer_nft: {
      recipient: recipientAddress,
      token_id: tokenId
    }
  };
}

/**
 * Membuat transaksi untuk remove listing di Stargaze marketplace
 */
function createStargazeRemoveListingMessage(listingId: string) {
  // This should be implemented based on your Stargaze marketplace contract
  return {
    remove_ask: {
      id: listingId
    }
  };
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
   * Generate wallet from mnemonic using the standard Cosmos derivation path
   */
  private generateWalletFromMnemonic(
    mnemonic: string,
    path: string = `m/44'/118'/0'/0/0`,
    password: string = ''
  ): Uint8Array {
    return Mnemonic.generateWalletFromMnemonic(mnemonic, path, password);
  }

  /**
   * Generate address using Keplr-style method (exact same as Keplr's PubKeySecp256k1.getEthAddress())
   * This replicates how Keplr wallet generates Intergaze addresses
   */
  private generateKeplrStyleAddress(
    mnemonic: string,
    hdPath: string = "m/44'/60'/0'/0/0",
    prefix: string = 'init'
  ): { privateKey: Uint8Array; ethAddress: string; bech32Address: string } {
    console.log(`Using Keplr-style address generation with path: ${hdPath}`);

    // Use the new generateWalletFromMnemonic method
    const privateKey = this.generateWalletFromMnemonic(mnemonic, hdPath);

    // Get public key using secp256k1 (same as Keplr's PubKeySecp256k1)
    const pubKey = secp256k1.getPublicKey(privateKey, false); // false = uncompressed (65 bytes)

    // Generate ETH address exactly like Keplr's getEthAddress() method
    // 1. Remove prefix byte (slice(1) to get 64 bytes)
    // 2. Hash with keccak256
    // 3. Take last 20 bytes
    const pubKeyWithoutPrefix = pubKey.slice(1); // Remove 0x04 prefix
    const hash = keccak256(pubKeyWithoutPrefix);
    const ethAddress = hash.slice(-40); // Last 20 bytes = 40 hex chars

    // Convert to bech32 using AddressUtils (same as intergaze.xyz)
    const bech32Address = AddressUtils.toBech32(`0x${ethAddress}`, prefix);

    return {
      privateKey: privateKey,
      ethAddress: `0x${ethAddress}`,
      bech32Address: bech32Address
    };
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
   * Transfer NFT on Stargaze network - CLEAN & READABLE VERSION
   * Features:
   * - Single token transfer
   * - Auto remove listing before transfer
   * - Better error handling and logging
   * - Clean transaction structure
   */
  private async transferStargazeNFT(
    chainConfig: ChainConfig,
    params: NFTTransferParams & { token?: NFTToken }
  ): Promise<TransferResult> {
    try {
      console.log('🚀 Starting Stargaze NFT transfer...');

      // Validate inputs
      if (!params.mnemonic) {
        throw new Error('Mnemonic is required for Stargaze transfer');
      }

      if (!isValidWalletAddress(params.recipientAddress)) {
        throw new Error('Invalid recipient address format for Stargaze');
      }

      // Create wallet instance from mnemonic
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        params.mnemonic,
        {
          prefix: chainConfig.prefix
        }
      );

      // Get the wallet address
      const [firstAccount] = await wallet.getAccounts();
      const senderAddress = firstAccount.address;
      console.log('✅ Stargaze sender address:', senderAddress);

      // Create signing client
      const client = await SigningCosmWasmClient.connectWithSigner(
        chainConfig.rpcUrl,
        wallet,
        {
          gasPrice: GasPrice.fromString(chainConfig.gasPrice)
        }
      );
      console.log('✅ Signing client connected');

      // Check account balance
      try {
        const balance = await client.getBalance(
          senderAddress,
          chainConfig.gasPrice.split('u')[1] || 'ustars'
        );
        console.log('Account balance:', balance);
      } catch (balanceError) {
        console.warn('Could not fetch balance:', balanceError);
      }

      const allMessages = [];
      let removedListings = 0;

      // Step 1: Remove listing if token is listed (if token info is provided)
      if (params.token && isTokenListed(params.token)) {
        console.log('🔄 Removing existing listing...');

        try {
          const removeListingMsg = createStargazeRemoveListingMessage(
            params.token.price!.id
          );

          // Execute remove listing first (if you have marketplace contract address)
          // Note: Replace 'marketplace_contract_address' with actual marketplace contract
          const marketplaceContract = 'stars1...'; // Replace with actual marketplace contract

          const removeResult = await client.execute(
            senderAddress,
            marketplaceContract,
            removeListingMsg,
            'auto',
            'Remove NFT listing before transfer',
            []
          );

          console.log(
            '✅ Listing removed, tx hash:',
            removeResult.transactionHash
          );
          removedListings = 1;
        } catch (removeError) {
          console.warn(
            '⚠️ Could not remove listing (continuing with transfer):',
            removeError
          );
          // Continue with transfer even if listing removal fails
        }
      }

      // Step 2: Create and execute transfer transaction
      console.log('🔄 Creating transfer transaction...');

      const transferMsg = createStargazeTransferMessage(
        senderAddress,
        params.contractAddress,
        params.recipientAddress,
        params.tokenId
      );

      console.log('Transfer message:', JSON.stringify(transferMsg, null, 2));

      // Execute transfer
      const result = await client.execute(
        senderAddress,
        params.contractAddress,
        transferMsg,
        'auto', // automatic gas estimation
        `Transfer NFT ${params.tokenId} to ${params.recipientAddress}`, // memo
        [] // funds
      );

      console.log('🎉 Stargaze transfer successful!');
      console.log('Transaction hash:', result.transactionHash);
      console.log('Gas used:', result.gasUsed);
      console.log('Gas wanted:', result.gasWanted);

      // Log summary
      const summary = {
        tokenId: params.tokenId,
        from: senderAddress,
        to: params.recipientAddress,
        contract: params.contractAddress,
        txHash: result.transactionHash,
        removedListings: removedListings,
        gasUsed: result.gasUsed
      };

      console.log('📋 Transfer Summary:', summary);

      return {
        success: true,
        transactionHash: result.transactionHash,
        chainData: {
          senderAddress: senderAddress,
          gasUsed: result.gasUsed,
          gasWanted: result.gasWanted,
          removedListings: removedListings,
          chain: 'stargaze',
          summary: summary
        }
      };
    } catch (error: any) {
      console.error('❌ Stargaze transfer error:', error);

      // Provide more specific error messages
      if (error?.message?.includes('insufficient funds')) {
        throw new Error(`Insufficient funds for transaction: ${error.message}`);
      } else if (error?.message?.includes('not found')) {
        throw new Error(
          `NFT not found or you don't own this NFT: ${error.message}`
        );
      } else if (error?.message?.includes('unauthorized')) {
        throw new Error(`Unauthorized to transfer this NFT: ${error.message}`);
      } else if (error?.message?.includes('gas')) {
        throw new Error(`Gas estimation failed: ${error.message}`);
      } else if (error?.message?.includes('mnemonic')) {
        throw new Error(`Wallet creation failed: ${error.message}`);
      } else {
        throw new Error(
          `Stargaze transfer failed: ${error.message || 'Unknown error'}`
        );
      }
    }
  }

  /**
   * Transfer NFT on Intergaze network (using Initia.js) - Fixed based on intergaze.xyz implementation
   */
  private async transferIntergazeNFT(
    chainConfig: ChainConfig,
    params: NFTTransferParams
  ): Promise<TransferResult> {
    try {
      console.log('🚀 Starting Intergaze NFT transfer...');

      // Validate chain configuration
      if (!chainConfig) {
        throw new Error(
          'Chain configuration is required for Intergaze transfer'
        );
      }

      // Use proper API endpoints (matching intergaze.xyz pattern)
      const restUrl = chainConfig.rest || 'https://rest.intergaze-apis.com';
      const rpcUrl = chainConfig.rpcUrl || 'https://rpc.intergaze-apis.com';

      if (!chainConfig.prefix) {
        throw new Error(
          'Bech32 prefix is not configured for Intergaze network'
        );
      }

      // Get mnemonic for wallet creation
      const mnemonic = params.mnemonic || chainConfig.rewardWalletMnemonic;

      if (!mnemonic || mnemonic.trim() === '') {
        throw new Error('No mnemonic provided for Intergaze transfer');
      }

      console.log(
        'Using mnemonic for Intergaze transfer:',
        mnemonic.substring(0, 20) + '...'
      );

      // Validate transfer parameters
      if (!params.contractAddress || params.contractAddress.trim() === '') {
        throw new Error('Contract address is required for NFT transfer');
      }

      if (!params.recipientAddress || params.recipientAddress.trim() === '') {
        throw new Error('Recipient address is required for NFT transfer');
      }

      if (!params.tokenId || params.tokenId.trim() === '') {
        throw new Error('Token ID is required for NFT transfer');
      }

      // Validate recipient address format (must be init prefixed)
      if (!params.recipientAddress.startsWith(chainConfig.prefix)) {
        throw new Error(
          `Invalid recipient address format. Expected ${chainConfig.prefix} prefix, got: ${params.recipientAddress}`
        );
      }

      // Validate mnemonic format
      const words = mnemonic.trim().split(/\s+/);
      if (![12, 15, 18, 21, 24].includes(words.length)) {
        throw new Error(
          `Invalid mnemonic: expected 12, 15, 18, 21, or 24 words, but got ${words.length}`
        );
      }

      console.log('Creating wallet for Intergaze transfer using Initia.js...');

      // Create MnemonicKey with proper HD path for Intergaze (from chain config)
      const hdPath = chainConfig.hdPath || "m/44'/60'/0'/0/0"; // Use EVM path as configured
      console.log('Using HD path:', hdPath);

      const key = new initia.MnemonicKey({
        mnemonic,
        hdPath: hdPath
      });
      console.log('✅ MnemonicKey created with HD path:', hdPath);

      // Get sender address
      const senderAddress = key.accAddress;
      console.log('Intergaze sender address:', senderAddress);

      // Validate sender address format
      if (!senderAddress.startsWith(chainConfig.prefix)) {
        throw new Error(
          `Invalid sender address format. Expected ${chainConfig.prefix} prefix, got: ${senderAddress}`
        );
      }

      // Create RESTClient with proper configuration (matching intergaze.xyz pattern)
      // Use the correct gas price from chain config (should be L2 token)
      const gasPrices = chainConfig.gasPrice;
      console.log('Using REST URL:', restUrl);
      console.log('Using gas prices:', gasPrices);

      const restClient = new initia.RESTClient(restUrl, {
        gasPrices,
        chainId: chainConfig.chainId || 'intergaze-1'
      });
      console.log('✅ RESTClient created');

      // Create Wallet instance
      const wallet = new initia.Wallet(restClient, key);
      console.log('✅ Wallet created using Initia.js');

      console.log('Transfer parameters:', {
        from: senderAddress,
        to: params.recipientAddress,
        contract: params.contractAddress,
        tokenId: params.tokenId,
        chainId: chainConfig.chainId,
        hdPath: hdPath,
        restUrl: restUrl,
        gasPrices: gasPrices
      });

      // Check account existence and balance
      try {
        const account = await restClient.auth.accountInfo(senderAddress);
        console.log('✅ Account info retrieved:', {
          accountNumber: account.account_number,
          sequence: account.sequence
        });

        const balances = await restClient.bank.balance(senderAddress);
        console.log('✅ Account balances:', balances);

        // Check if account has sufficient balance for gas
        const initBalance = balances[0]?._coins
          ? Object.keys(balances[0]._coins)[0]
          : null;
        if (!initBalance) {
          console.warn(
            '⚠️ No balance detected. Account may not have sufficient funds for gas.'
          );
        } else {
          console.log('Available balance denom:', initBalance);
          // Check if it's a gas token (uinit or l2 token)
          if (
            !initBalance.includes('uinit') &&
            !initBalance.startsWith('l2/')
          ) {
            console.warn(
              '⚠️ May not have native gas token. Please ensure you have INIT tokens for gas.'
            );
          }
        }
      } catch (balanceError: any) {
        console.warn(
          'Could not fetch account info or balance:',
          balanceError?.message
        );
      }

      // Prepare transfer message exactly as intergaze.xyz does it
      const transferMsg = {
        transfer_nft: {
          recipient: params.recipientAddress,
          token_id: params.tokenId.toString()
        }
      };

      console.log('Transfer message object:', transferMsg);
      console.log(
        'Transfer message JSON:',
        JSON.stringify(transferMsg, null, 2)
      );

      // Create execute contract message using the exact format expected by initia.js v1.0.12
      console.log('Creating MsgExecuteContract with:');
      console.log('- Sender:', senderAddress);
      console.log('- Contract:', params.contractAddress);
      console.log('- Message:', transferMsg);

      // Try different approaches based on initia.js API
      let executeMsg;

      // The issue is that MsgExecuteContract.msg field expects Uint8Array, not object or string
      // Based on the error, we need to properly encode the message as bytes
      const msgString = JSON.stringify(transferMsg);
      const msgBytes = new TextEncoder().encode(msgString);

      console.log('Message string:', msgString);
      console.log('Message bytes length:', msgBytes.length);

      try {
        // Create MsgExecuteContract with properly encoded message bytes
        executeMsg = new initia.MsgExecuteContract(
          senderAddress,
          params.contractAddress,
          msgBytes, // Pass as Uint8Array bytes
          []
        );
        console.log('✅ Created with Uint8Array message');
      } catch (error1: any) {
        console.log('❌ Uint8Array approach failed:', error1.message);

        try {
          // Try with Buffer instead
          const msgBuffer = Buffer.from(msgString, 'utf8');
          executeMsg = new initia.MsgExecuteContract(
            senderAddress,
            params.contractAddress,
            msgBuffer,
            []
          );
          console.log('✅ Created with Buffer message');
        } catch (error2: any) {
          console.log('❌ Buffer approach failed:', error2.message);

          // Last resort: use direct protobuf encoding
          executeMsg = new initia.MsgExecuteContract(
            senderAddress,
            params.contractAddress,
            msgString, // Try string again as last resort
            []
          );
          console.log('✅ Created with string message (fallback)');
        }
      }

      console.log('✅ Execute message created successfully');

      // Create transaction with proper memo
      console.log('Creating and signing transaction...');

      const txOptions = {
        msgs: [executeMsg],
        memo: `Transfer NFT ${
          params.tokenId
        } to ${params.recipientAddress.slice(0, 10)}...`,
        // Let wallet handle gas estimation automatically
        gasAdjustment: 1.5 // Add buffer for gas estimation
      };

      console.log(
        'Transaction options:',
        JSON.stringify(
          {
            ...txOptions,
            msgs: [`MsgExecuteContract(${params.contractAddress})`]
          },
          null,
          2
        )
      );

      const tx = await wallet.createAndSignTx(txOptions);
      console.log('✅ Transaction created and signed successfully');

      // Broadcast transaction
      console.log('Broadcasting transaction to Intergaze network...');

      const broadcastResult = await restClient.tx.broadcast(tx);
      console.log('Broadcast response:', broadcastResult);

      // Check transaction result
      if (broadcastResult.code !== 0) {
        // Transaction failed
        const errorMsg =
          broadcastResult.log ||
          broadcastResult.raw_log ||
          'Unknown transaction error';
        throw new Error(
          `Transaction failed with code ${broadcastResult.code}: ${errorMsg}`
        );
      }

      console.log('📡 Transaction broadcasted successfully!');
      console.log('Transaction hash:', broadcastResult.txhash);
      console.log('Block height:', broadcastResult.height);
      console.log('Gas used:', broadcastResult.gas_used);
      console.log('Gas wanted:', broadcastResult.gas_wanted);

      // Wait briefly for transaction to be included in block
      if (broadcastResult.height) {
        console.log(
          '✅ Transaction confirmed in block:',
          broadcastResult.height
        );
      }

      console.log('🎉 Intergaze NFT transfer completed successfully!');

      return {
        success: true,
        transactionHash: broadcastResult.txhash,
        chainData: {
          senderAddress: senderAddress,
          recipientAddress: params.recipientAddress,
          contractAddress: params.contractAddress,
          tokenId: params.tokenId,
          height: broadcastResult.height,
          gasUsed: broadcastResult.gas_used,
          gasWanted: broadcastResult.gas_wanted,
          chain: 'intergaze',
          chainId: chainConfig.chainId,
          blockExplorer: `https://explorer.intergaze-apis.com/tx/${broadcastResult.txhash}`
        }
      };
    } catch (error: any) {
      console.error('❌ Intergaze transfer error:', error);

      // Enhanced error handling based on intergaze.xyz patterns
      if (
        error?.code === 'ERR_INVALID_ARG_TYPE' &&
        error?.message?.includes('Buffer')
      ) {
        throw new Error(
          `Transaction serialization failed: ${error.message}. This might be due to an incompatible message format or Initia.js version issue.`
        );
      } else if (error?.message?.includes('insufficient funds')) {
        throw new Error(
          `Insufficient funds for transaction. Please ensure you have enough INIT tokens for gas fees: ${error.message}`
        );
      } else if (
        error?.message?.includes('not found') ||
        error?.message?.includes('does not exist')
      ) {
        throw new Error(
          `NFT not found or account does not exist: ${error.message}. Please verify the contract address and token ID.`
        );
      } else if (
        error?.message?.includes('unauthorized') ||
        error?.message?.includes('permission')
      ) {
        throw new Error(
          `Unauthorized to transfer this NFT: ${error.message}. Please verify you own this NFT.`
        );
      } else if (error?.message?.includes('mnemonic')) {
        throw new Error(
          `Wallet creation failed: ${error.message}. Please check your mnemonic phrase.`
        );
      } else if (error?.message?.includes('gas')) {
        throw new Error(
          `Gas estimation failed: ${error.message}. Please check if you have sufficient INIT balance for transaction fees.`
        );
      } else if (error?.message?.includes('sequence')) {
        throw new Error(
          `Account sequence mismatch: ${error.message}. Please wait and try again.`
        );
      } else if (
        error?.message?.includes('timeout') ||
        error?.code === 'ECONNREFUSED'
      ) {
        throw new Error(
          `Network connection failed: ${error.message}. Please check your internet connection and try again.`
        );
      } else if (error?.message?.includes('contract')) {
        throw new Error(
          `Smart contract error: ${error.message}. Please verify the contract address and your ownership of the NFT.`
        );
      } else if (
        error?.message?.includes('toProto') ||
        error?.message?.includes('packAny')
      ) {
        throw new Error(
          `Message serialization failed: ${error.message}. This might be due to an incompatible message format.`
        );
      } else {
        throw new Error(
          `Intergaze transfer failed: ${
            error.message || 'Unknown error occurred'
          }`
        );
      }
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
   * Transfer single Stargaze NFT with token information (clean version)
   * This method accepts NFTToken object for better functionality
   */
  async transferStargazeSingleNFT(
    token: NFTToken,
    recipientAddress: string,
    mnemonic?: string
  ): Promise<TransferResult> {
    const chainConfig = getChainConfig('stargaze');
    const finalMnemonic = mnemonic || chainConfig.rewardWalletMnemonic;

    if (!finalMnemonic) {
      throw new Error('No mnemonic found for Stargaze transfer');
    }

    return await this.transferStargazeNFT(chainConfig, {
      contractAddress: token.collection.contractAddress,
      recipientAddress: recipientAddress,
      tokenId: token.tokenId,
      mnemonic: finalMnemonic,
      token: token // Pass token info for listing removal
    });
  }

  /**
   * Transfer multiple Stargaze NFTs (bulk transfer)
   */
  async transferStargazeBulkNFTs(
    tokens: NFTToken[],
    recipientAddress: string,
    mnemonic?: string
  ): Promise<TransferResult[]> {
    const results: TransferResult[] = [];

    for (const token of tokens) {
      try {
        const result = await this.transferStargazeSingleNFT(
          token,
          recipientAddress,
          mnemonic
        );
        results.push(result);

        // Add small delay between transfers to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to transfer token ${token.tokenId}:`, error);
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          chainData: {
            tokenId: token.tokenId,
            chain: 'stargaze'
          }
        });
      }
    }

    return results;
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

// =========================================================
// EXAMPLE USAGE FOR CLEAN STARGAZE TRANSFER
// =========================================================

/**
 * Example: Transfer single Stargaze NFT with clean system
 */
export async function exampleStargazeSingleTransfer() {
  const transferService = new MultiChainTransferService();

  const myToken: NFTToken = {
    tokenId: '123',
    name: 'Cool Stargaze NFT #123',
    collection: {
      contractAddress: 'stars1abc...def'
    },
    isEscrowed: true, // Listed in marketplace
    price: {
      id: 'listing_456',
      amount: '100',
      denom: 'ustars'
    }
  };

  try {
    const result = await transferService.transferStargazeSingleNFT(
      myToken,
      'stars1recipient...address',
      'your mnemonic phrase here' // optional, uses config mnemonic if not provided
    );

    if (result.success) {
      console.log('✅ Transfer successful!');
      console.log('Transaction hash:', result.transactionHash);
      console.log('Removed listings:', result.chainData?.removedListings);
    } else {
      console.log('❌ Transfer failed:', result.error);
    }
  } catch (error) {
    console.error('Transfer error:', error);
  }
}

/**
 * Example: Bulk transfer multiple Stargaze NFTs
 */
export async function exampleStargazeBulkTransfer() {
  const transferService = new MultiChainTransferService();

  const myTokens: NFTToken[] = [
    {
      tokenId: '123',
      name: 'NFT #123',
      collection: { contractAddress: 'stars1collection...address' },
      isEscrowed: false,
      price: null
    },
    {
      tokenId: '456',
      name: 'NFT #456',
      collection: { contractAddress: 'stars1collection...address' },
      isEscrowed: true,
      price: { id: 'listing_789', amount: '200', denom: 'ustars' }
    }
  ];

  try {
    const results = await transferService.transferStargazeBulkNFTs(
      myTokens,
      'stars1recipient...address'
    );

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log(`✅ ${successful.length} transfers successful`);
    console.log(`❌ ${failed.length} transfers failed`);

    successful.forEach((result) => {
      console.log('Success:', result.transactionHash);
    });

    failed.forEach((result) => {
      console.log('Failed:', result.error);
    });
  } catch (error) {
    console.error('Bulk transfer error:', error);
  }
}
