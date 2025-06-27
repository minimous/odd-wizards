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
import { useUser } from '@/hooks/useUser';
import { mst_project } from '@prisma/client';
import { useSyncedWallet } from '@/providers/wallet-provider-wrapper';

export interface BoxStatStakeProps {
  collection: string;
  project: mst_project;
}

export const BoxStatStake = ({ collection, project }: BoxStatStakeProps) => {
  const rankEmojis = ['🥇', '🥈', '🥉'];
  const { address } = useSyncedWallet(); // Use the 'stargaze' chain from your Cosmos setup
  const [stat, setStat] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useUser();
  const { claim } = useClaim();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const resp = await axios.get(
          `/api/soft-staking/point?wallet_address=${address}&project_code=${project?.project_code}`
        );
        setStat(resp.data.data);
      } catch (error) {}
      setLoading(false);
    }

    if (address) {
      fetchData();
    }
  }, [address, claim]);

  return (
    <div hidden={!address}>
      <div hidden={loading}>
        <div className="relative flex w-full gap-2 px-6 md:!gap-6 md:!px-20 lg:px-20">
          <div className="grid w-full gap-x-4 md:grid-cols-3">
            <div className="flex h-[68px] w-full flex-grow items-center justify-between rounded-[15px] border-2 border-green-500 bg-[url('/images/Cosmos.gif')] bg-cover bg-center p-4 px-8 text-[#A1A1AA] md:h-[105px] md:rounded-[25px]">
              <div className="flex items-center gap-4">
                <div className="flex h-[40px] w-[40px] items-center justify-center overflow-hidden rounded-full bg-amber-200 md:h-[70px] md:w-[70px]">
                  <Link href={`/p/${address}`}>
                    <img
                      src={user?.user_image_url ?? DEFAULT_IMAGE_PROFILE}
                      alt={address ?? ''}
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
                    href={`https://www.stargaze.zone/p/${address}`}
                    target="_blank"
                    className="text-center text-[#DB2877]"
                  >
                    <p className="text-[12px] font-bold md:text-[20px] ">
                      {formatAddress(address ?? '')}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden h-[68px] w-[60px] flex-grow items-center gap-6 rounded-[15px] border-2 border-green-500 bg-[url('/images/About.gif')] bg-cover bg-center p-4 px-8 text-[#A1A1AA] md:!flex md:h-[105px] md:w-[105px] md:w-full md:rounded-[25px]">
              <div>
                <img
                  src={project.project_symbol_img ?? '/images/Icon/wzrd.png'}
                  className="h-[55px]"
                />
              </div>
              <div className="hidden md:!block">
                <span className="text-[12px] text-white md:text-[20px]">
                  Token
                </span>
                <p className="text-[10px] font-bold text-white md:text-[20px]">
                  {/* <NumberTicker value={leaderboard?.point ?? 0} decimalPlaces={2} skipAnimation={true} /> $WZRD */}
                  {formatDecimal(stat?.point ?? 0, 2)} $
                  {project?.project_symbol}
                </p>
              </div>
            </div>
            <div className="hidden h-[68px]  w-[60px] flex-grow items-center gap-8 rounded-[15px] border-2 border-green-500 bg-[url('/images/Lab.gif')] bg-cover bg-center p-4 px-8 text-[#A1A1AA] md:!flex md:h-[105px] md:w-[105px] md:w-full md:rounded-[25px]">
              <div className="text-6xl">
                <img src="/images/Token.png" className="h-[50px]" />
              </div>
              <div className="text-left">
                <span className="text-[12px] text-white md:text-[20px]">
                  NFT
                </span>
                <p className="hidden text-[12px] font-bold text-white md:!block md:text-[20px]">
                  {/* <NumberTicker value={leaderboard?.totalStake ?? 0} decimalPlaces={2} skipAnimation={true} /> Staked */}
                  {formatDecimal(stat?.totalStake ?? 0, 2)} Staked
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn('mt-2 grid w-full grid-cols-2 gap-x-2 px-6 md:!hidden')}
        >
          <div className="flex h-[68px] w-full flex-grow items-center justify-center gap-6 rounded-[15px] border-2 border-green-500 bg-[url('/images/About.gif')] p-4 px-8 text-[#A1A1AA] md:h-[105px] md:rounded-[25px]">
            {/* <div>
              <img src="/images/Icon/wzrd.png" className="shrink-0 h-[40px]" />
            </div> */}
            <div className="text-center">
              <span className="text-[12px] text-white md:text-[20px]">
                Token
              </span>
              <p className="text-[13px] font-bold text-white md:text-[20px]">
                {/* <NumberTicker value={leaderboard?.point ?? 0} decimalPlaces={2} skipAnimation={true} /> $WZRD */}
                {formatDecimal(stat?.point ?? 0, 2)} ${project.project_symbol}
              </p>
            </div>
          </div>
          <div className="flex  h-[68px] w-full flex-grow items-center justify-center gap-8 rounded-[15px] border-2 border-green-500 bg-[url('/images/Lab.gif')] bg-cover bg-cover bg-center bg-center p-4 px-8 text-[#A1A1AA] md:h-[105px] md:rounded-[25px]">
            {/* <div className="text-6xl">
              <img src="/images/Token.png" className="shrink-0 h-[35px]" />
            </div> */}
            <div className="text-center">
              <span className="text-[12px] text-white md:text-[20px]">NFT</span>
              <p className="text-[13px] font-bold text-white md:text-[20px]">
                {/* <NumberTicker value={leaderboard?.totalStake ?? 0} decimalPlaces={2} skipAnimation={true} /> Staked */}
                {formatDecimal(stat?.totalStake ?? 0, 2)} Staked
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
