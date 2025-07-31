import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { extractCollectionAndTokenId, getToken } from '@/lib/utils';
import getConfig from '@/config/config';
import MultiChainTransferService from '@/lib/transfer-service';
import { getChainConfig } from '@/lib/chain-config';
import { Token } from '@/types';

const config = getConfig();
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { staker_address, chain } = body; // Added chain parameter

    if (!config) {
      return NextResponse.json(
        { message: 'Config not found' },
        { status: 400 }
      );
    }

    // Find reward with optional chain filtering
    const whereClause: any = {
      distribusi_is_claimed: 'N',
      distribusi_wallet: staker_address,
      distribusi_type: 'NFT'
    };

    // If chain is specified, filter by chain
    if (chain) {
      whereClause.distribusi_chain = chain.toLowerCase();
    }

    const reward = await prisma.trn_distribusi_reward.findFirst({
      where: whereClause
    });

    if (!reward) {
      return NextResponse.json(
        { message: 'Reward not found' },
        { status: 400 }
      );
    }

    if (reward.distribusi_is_claimed == 'Y') {
      return NextResponse.json(
        { message: 'Reward is claimed' },
        { status: 400 }
      );
    }

    // Determine chain - use from reward or default to stargaze for backward compatibility
    const rewardChain = reward.distribusi_chain || 'stargaze';

    // Validate chain support
    const transferService = new MultiChainTransferService();
    if (!transferService.isChainSupported(rewardChain)) {
      return NextResponse.json(
        { message: `Unsupported chain: ${rewardChain}` },
        { status: 400 }
      );
    }

    const { collection: rewardCollection, tokenId } =
      extractCollectionAndTokenId(reward.distribusi_reward ?? '');

    if (!rewardCollection || !tokenId) {
      return NextResponse.json(
        { message: 'Invalid reward format' },
        { status: 400 }
      );
    }

    // For backward compatibility, still try to get token info for Stargaze
    let token: Token | null = null;
    let contractAddress = rewardCollection;

    if (rewardChain === 'stargaze') {
      try {
        token = await getToken(rewardCollection, tokenId);
        if (token) {
          contractAddress = token.collection.contractAddress;
        }
      } catch (error) {
        console.warn(
          'Failed to get token info, using collection address directly:',
          error
        );
      }
    }

    try {
      // Get chain config for mnemonic
      const chainConfig = getChainConfig(rewardChain);

      // Perform multi-chain transfer
      const transferResult = await transferService.transferNFT(rewardChain, {
        contractAddress,
        recipientAddress: staker_address,
        tokenId,
        mnemonic: chainConfig.rewardWalletMnemonic
      });

      if (!transferResult.success) {
        throw new Error(transferResult.error || 'Transfer failed');
      }

      // Update reward with transaction hash and chain data
      await prisma.trn_distribusi_reward.update({
        where: {
          distribusi_id: reward.distribusi_id
        },
        data: {
          distribusi_tx_hash: transferResult.transactionHash,
          distribusi_is_claimed: 'Y',
          distribusi_chain_data: JSON.stringify(transferResult.chainData)
        }
      });

      return NextResponse.json(
        {
          message: 'Claim reward successfully',
          data: {
            chain: rewardChain,
            transactionHash: transferResult.transactionHash,
            chainData: transferResult.chainData
          }
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Transfer error:', error);

      // Mark as claimed even if transfer fails (as per original logic)
      await prisma.trn_distribusi_reward.update({
        where: {
          distribusi_id: reward.distribusi_id
        },
        data: {
          distribusi_tx_hash: undefined,
          distribusi_is_claimed: 'Y',
          distribusi_chain_data: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
            chain: rewardChain,
            timestamp: new Date().toISOString()
          })
        }
      });

      return NextResponse.json(
        {
          message: 'Claim reward successfully',
          data: {
            chain: rewardChain,
            note: 'Transfer may have failed but reward is marked as claimed'
          }
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Claim Reward Error:', error);
    return NextResponse.json(
      {
        message: 'Failed to Claim Reward',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
