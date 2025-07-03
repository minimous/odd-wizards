import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import {
  fetchAllStargazeTokens,
  fetchStargazeTokens,
  getToken,
  getUserStakedNFTs
} from '@/lib/utils';
import { OwnedTokensResponse, Token } from '@/types';
import { getTotalPoints, updateNftOwner } from '@/lib/soft-staking-service';
import getConfig from '@/config/config';

const config = getConfig();

export async function GET(request: NextRequest) {
  try {
    // const collectionAddress = "the777s";
    const daoAddress =
      'stars1dq6tafrsajfdk8w9plut4nmkhuxlkj68rnngydhf73v85m36lhqqtjuwyw';
    const address = 'stars1e5n9d872aryh4y8ydjmc24pr05c7pxg0sgyjj9';
    const collection_address =
      'stars1j5fhf04q6sycz72mz5uzrwvv2e05jy3npsdzppxyl2eww0x5hy4s0wuftp';

    // const staked_nfts = await getUserStakedNFTs(address, daoAddress);
    // const data = await Promise.all(staked_nfts.map(async (tokenId: string) => {
    //     const token = await getToken(collection_address, tokenId);
    //     return token;
    // }));

    // let resp: OwnedTokensResponse = await fetchStargazeTokens({
    //     owner: address,
    //     collectionAddress: "stars1vcpp2wl5tsgueyrqxyz0haqpymxfur0y4qaqqh92hp5y06cs227qg0s5xu",
    //     limit: 1,
    //     offset: 0
    // });

    // updateNftOwner(address, "stars1vcpp2wl5tsgueyrqxyz0haqpymxfur0y4qaqqh92hp5y06cs227qg0s5xu");

    // const rewards = await prisma.mst_raffle_reward.findMany();
    // await Promise.all(rewards.map(async (reward) => {

    //     const token: Token = await getToken(reward.reward_collection ?? "", reward.reward_token_id ?? "");
    //     await prisma.mst_raffle_reward.update({
    //         where: {
    //             reward_id: reward.reward_id
    //         },
    //         data: {
    //             reward_collection_address: token.collection.contractAddress
    //         }
    //     })
    // }));

    // const data = await getTotalPoints(address, 14);
    let totalNft = 0;
    const collection = await prisma.mst_collection.findFirst({
      where: {
        collection_id: 12
      }
    });

    if (!collection) {
      throw Error('Collection not found');
    }

    const staker = await prisma.mst_staker.findFirst({
      where: {
        staker_address: address,
        staker_collection_id: collection.collection_id
      }
    });

    if (staker && collection.collection_address) {
      let resp = await updateNftOwner(address, collection.collection_address);
      totalNft = resp?.totalNfts ?? 0;
    }

    return NextResponse.json(
      {
        message: 'Get points successfully',
        data: totalNft
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        message: 'Failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
}
