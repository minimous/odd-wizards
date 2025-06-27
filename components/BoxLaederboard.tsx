'use client';
import getConfig from '@/config/config';
import { DEFAULT_IMAGE_PROFILE } from '@/constants';
import { cn, formatAddress, formatDecimal, formatToStars } from '@/lib/utils';
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

export const BoxLeaderboard = () => {
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
          <div>
            <div
              hidden={
                (leaderboard?.ranking ?? 0) >
                ((config?.ranking_reward as number) ?? 0)
              }
            >
              <div className="absolute -bottom-8 left-20 flex items-center gap-x-4 md:-bottom-16 md:left-44">
                <img
                  src="/images/Icon/Arrow.png"
                  className="w-[35px] md:w-[75px]"
                />
                <span className="mt-2 text-xs text-[#49ED4A] md:mt-4 md:!text-lg">
                  Keep it up, you will get 1 NFT.
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="flex h-[68px] w-[60px] items-center justify-center rounded-[15px] border-2 border-[#49ED4A] bg-[url('/images/Epigraph.gif')] bg-cover bg-center text-center text-lg font-bold text-white md:h-[105px] md:w-[105px] md:rounded-[25px] md:!text-2xl">
                {leaderboard
                  ? rankEmojis[Number(leaderboard.ranking) - 1] ||
                    leaderboard.ranking
                  : '-'}
              </div>
              <img
                hidden={
                  (leaderboard?.ranking ?? 0) >
                  ((config?.ranking_reward as number) ?? 0)
                }
                src="/images/Icon/Gift.png"
                className="absolute -bottom-8 left-0 w-[65px] max-w-max md:!-bottom-12 md:!left-0 md:w-[110px]"
              />
            </div>
          </div>
          <div className="grid w-full gap-x-4 md:grid-cols-3">
            <div className="flex h-[68px] w-full flex-grow items-center justify-between rounded-[15px] border-2 border-[#49ED4A] bg-[url('/images/Cosmos.gif')] bg-cover bg-center p-4 px-8 text-[#A1A1AA] md:h-[105px] md:rounded-[25px]">
              <div className="flex items-center gap-4">
                <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full bg-amber-200 md:h-[70px] md:w-[70px]">
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
                <div>
                  <span className="text-[13px] text-white md:text-[20px]">
                    Address
                  </span>
                  <Link
                    href={`https://www.stargaze.zone/p/${leaderboard?.staker_address}`}
                    target="_blank"
                    className="text-center text-[#DB2877]"
                  >
                    <p className="text-[12px] font-bold md:text-[20px] ">
                      {formatAddress(leaderboard?.staker_address)}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden h-[68px] w-[60px] flex-grow items-center gap-6 rounded-[15px] border-2 border-[#49ED4A] bg-[url('/images/About.gif')] bg-cover bg-center p-4 px-8 text-[#A1A1AA] md:!flex md:h-[105px] md:w-[105px] md:w-full md:rounded-[25px]">
              <div>
                <img src="/images/Icon/wzrd.png" className="h-[55px]" />
              </div>
              <div className="hidden md:!block">
                <span className="text-[12px] text-white md:text-[20px]">
                  Token
                </span>
                <p className="text-[10px] font-bold text-white md:text-[20px]">
                  {/* <NumberTicker value={leaderboard?.total_points ?? 0} decimalPlaces={2} skipAnimation={true} /> $WZRD */}
                  {formatDecimal(leaderboard?.total_points ?? 0, 2)} $WZRD
                </p>
              </div>
            </div>
            <div className="hidden h-[68px] w-[60px] flex-grow items-center gap-8 rounded-[15px] border-2 border-[#49ED4A] bg-[url('/images/Lab.gif')] bg-cover bg-center p-4 px-8 text-[#A1A1AA] md:!flex md:h-[105px] md:w-[105px] md:w-full md:rounded-[25px]">
              <div className="text-6xl">
                <img src="/images/Token.png" className="h-[50px]" />
              </div>
              <div className="text-left">
                <span className="text-[12px] text-white md:text-[20px]">
                  NFT
                </span>
                <p className="hidden text-[12px] font-bold text-white md:!block md:text-[20px]">
                  {/* <NumberTicker value={leaderboard?.staker_nft_staked ?? 0} decimalPlaces={2} skipAnimation={true} /> Staked */}
                  {formatDecimal(leaderboard?.staker_nft_staked ?? 0, 2)} Staked
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'grid w-full grid-cols-2 gap-x-2 px-4 md:!hidden',
            (leaderboard?.ranking ?? 0) >
              ((config?.ranking_reward as number) ?? 0)
              ? 'mt-2'
              : 'mt-9'
          )}
        >
          <div className="flex h-[68px] w-full flex-grow items-center justify-center gap-6 rounded-[15px] border-2 border-[#49ED4A] bg-[url('/images/About.gif')] bg-cover bg-center p-4 px-8 text-[#A1A1AA] md:h-[105px] md:rounded-[25px]">
            {/* <div>
              <img src="/images/Icon/wzrd.png" className="shrink-0 h-[40px]" />
            </div> */}
            <div className="text-center">
              <span className="text-[12px] text-white md:text-[20px]">
                Token
              </span>
              <p className="text-[13px] font-bold text-white md:text-[20px]">
                {/* <NumberTicker value={leaderboard?.total_points ?? 0} decimalPlaces={2} skipAnimation={true} /> $WZRD */}
                {formatDecimal(leaderboard?.total_points ?? 0, 2)} $WZRD
              </p>
            </div>
          </div>
          <div className="flex h-[68px] w-full flex-grow items-center justify-center gap-8 rounded-[15px] border-2 border-[#49ED4A] bg-[url('/images/Lab.gif')] bg-cover bg-center p-4 px-8 text-[#A1A1AA] md:h-[105px] md:rounded-[25px]">
            {/* <div className="text-6xl">
              <img src="/images/Token.png" className="shrink-0 h-[35px]" />
            </div> */}
            <div className="text-center">
              <span className="text-[12px] text-white md:text-[20px]">NFT</span>
              <p className="text-[13px] font-bold text-white md:text-[20px]">
                {/* <NumberTicker value={leaderboard?.staker_nft_staked ?? 0} decimalPlaces={2} skipAnimation={true} /> Staked */}
                {formatDecimal(leaderboard?.staker_nft_staked ?? 0, 2)} Staked
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
