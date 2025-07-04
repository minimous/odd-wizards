import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import {
  extractCollectionAndTokenId,
  getToken,
  transferNFT
} from '@/lib/utils';
import getConfig from '@/config/config';
import { Token } from '@/types';

const config = getConfig();
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { staker_address } = body;

    if (!config) {
      return NextResponse.json(
        { message: 'Config not found' },
        { status: 400 }
      );
    }

    const reward = await prisma.trn_distribusi_reward.findFirst({
      where: {
        distribusi_is_claimed: 'N',
        distribusi_wallet: staker_address,
        distribusi_type: 'NFT'
      }
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

    const { collection: rewardCollection, tokenId } =
      extractCollectionAndTokenId(reward.distribusi_reward ?? '');

    if (!rewardCollection || !tokenId) {
      return NextResponse.json(
        { message: 'Reward not found' },
        { status: 400 }
      );
    }

    const token: Token = await getToken(rewardCollection, tokenId);

    try {
      const resp = await transferNFT(
        config.mnemonic_reward_wallet,
        token.collection.contractAddress,
        staker_address,
        tokenId
      );
      const txHash = resp.transactionHash;

      await prisma.trn_distribusi_reward.update({
        where: {
          distribusi_id: reward.distribusi_id
        },
        data: {
          distribusi_tx_hash: txHash,
          distribusi_is_claimed: 'Y'
        }
      });

      return NextResponse.json(
        {
          message: 'Claim reward successfully',
          data: {}
        },
        { status: 200 }
      );
    } catch (error) {
      await prisma.trn_distribusi_reward.update({
        where: {
          distribusi_id: reward.distribusi_id
        },
        data: {
          distribusi_tx_hash: undefined,
          distribusi_is_claimed: 'Y'
        }
      });

      return NextResponse.json(
        {
          message: 'Claim reward successfully',
          data: {}
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
