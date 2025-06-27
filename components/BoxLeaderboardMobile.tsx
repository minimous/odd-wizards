'use client';
import getConfig from '@/config/config';
import { DEFAULT_IMAGE_PROFILE } from '@/constants';
import { formatAddress, formatDecimal, formatToStars } from '@/lib/utils';
import { LeaderboardItem } from '@/types/leaderboard';
import { useChain } from '@cosmos-kit/react';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import { useClaim } from '@/hooks/useClaim';
import Link from 'next/link';
import NumberTicker from './ui/number-ticker';
import { useSyncedWallet } from '@/providers/wallet-provider-wrapper';

export const BoxLeaderboardMobile = () => {
  const rankEmojis = ['🥇', '🥈', '🥉'];
  const { address } = useSyncedWallet(); // Use the 'stargaze' chain from your Cosmos setup
  const config = getConfig();
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem>();
  const [loading, setLoading] = useState<boolean>(false);
  const { claim } = useClaim();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const resp = await axios.get(
        `/api/soft-staking/leaderboard?wallet_address=${address}&collection_address=${config?.collection_address}&page=${0}&limit=1`
      );
      const data: LeaderboardItem[] = resp.data.data ?? [];
      setLeaderboard(data.length > 0 ? data[0] : undefined);
      setLoading(false);
    }

    if (address) {
      fetchData();
    }
  }, [address, claim]);

  return (
    <div>
      <div hidden={leaderboard == undefined}>
        <div className="relative flex w-full gap-2 px-4 md:!gap-6 md:px-12 lg:px-20">
          <div
            hidden={
              (leaderboard?.ranking ?? 0) >
              ((config?.ranking_reward as number) ?? 0)
            }
          >
            <div className="absolute -bottom-12 left-20 flex items-center gap-x-4 md:-bottom-16 md:left-44">
              <img
                src="/images/Icon/Arrow.png"
                className="w-[50px] md:w-[75px]"
              />
              <span className="mt-2 text-xs text-[#49ED4A] md:mt-4 md:!text-lg">
                Congrats, you got 1 NFT, keep it up!
              </span>
            </div>
            <div className="relative">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[15px] border border-[#49ED4A] bg-[#18181B] text-center text-2xl font-bold text-white md:h-[105px] md:w-[105px] md:rounded-[25px]">
                {leaderboard
                  ? rankEmojis[Number(leaderboard.ranking) - 1] ||
                    leaderboard.ranking
                  : '-'}
              </div>
              <img
                src="/images/Icon/Gift.png"
                className="absolute -bottom-10 -left-3 w-[75px] max-w-max md:!-bottom-12 md:!left-0 md:w-[110px]"
              />
            </div>
          </div>
          <div className="flex h-[50px] w-[50px] flex-grow items-center justify-between gap-2 rounded-[15px] border border-[#49ED4A] bg-[#18181B] p-4 px-2 text-[#A1A1AA] md:h-[105px] md:w-[105px] md:w-full md:rounded-[25px] md:!px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-[35px] w-[35px] items-center  justify-center overflow-hidden rounded-full bg-amber-200 md:h-[70px] md:w-[70px]">
                <Link href={`/p/${leaderboard?.staker_address}`}>
                  <img
                    src={leaderboard?.user_image_url ?? DEFAULT_IMAGE_PROFILE}
                    alt={leaderboard?.staker_address ?? ''}
                    className="h-full w-full rounded-full object-cover hover:scale-105"
                    onError={(e: any) => {
                      e.target.src = DEFAULT_IMAGE_PROFILE;
                    }}
                  />
                </Link>
              </div>
              <Link
                href={`https://www.stargaze.zone/p/${leaderboard?.staker_address}`}
                target="_blank"
                className="text-center text-[#49ED4A]"
              >
                <p className="text-[10px] font-bold md:text-[20px] ">
                  {formatAddress(leaderboard?.staker_address)}
                </p>
              </Link>
            </div>
            <div className="text-center text-[#49ED4A]">
              <p className="text-[10px] font-bold md:text-[20px]">
                {/* <NumberTicker value={leaderboard?.total_points ?? 0} decimalPlaces={2} skipAnimation={true} /> $WZRD */}
                {formatDecimal(leaderboard?.total_points ?? 0, 2)} $WZRD
              </p>
            </div>

            <div className="text-center text-[#49ED4A] ">
              <p className="text-[10px] font-bold md:text-[20px]">
                {/* <NumberTicker value={leaderboard?.staker_nft_staked ?? 0} decimalPlaces={2} skipAnimation={true} /> NFT Staked */}
                {formatDecimal(leaderboard?.staker_nft_staked ?? 0, 2)} NFT
                Staked
              </p>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="my-6 flex items-center justify-center text-center">
          <Loading />
        </div>
      )}
    </div>
  );
};
