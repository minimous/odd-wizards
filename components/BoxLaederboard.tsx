"use client";
import getConfig from "@/config/config";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { cn, formatAddress, formatDecimal, formatToStars } from "@/lib/utils";
import { LeaderboardItem } from "@/types/leaderboard";
import { useChain } from "@cosmos-kit/react";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useClaim } from "@/hooks/useClaim";
import Link from "next/link";
import NumberTicker from "./ui/number-ticker";

export const BoxLeaderboard = () => {

  const rankEmojis = ["🥇", "🥈", "🥉"];
  const { address } = useChain("stargaze"); // Use the 'stargaze' chain from your Cosmos setup
  const config = getConfig();
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem>();
  const [loading, setLoading] = useState<boolean>(false);
  const { claim } = useClaim();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const resp = await axios.get(`/api/soft-staking/leaderboard?wallet_address=${address}&collection_address=${config?.collection_address}&page=${0}&limit=1`);
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
        <div className="relative flex gap-2 md:!gap-6 w-full px-4 md:px-12 lg:px-20">
          <div>
            <div hidden={(leaderboard?.ranking ?? 0) > (config?.ranking_reward as number ?? 0)}>
              <div className="absolute flex items-center left-20 -bottom-8 md:-bottom-16 md:left-44 gap-x-4">
                <img src="/images/Icon/Arrow.png" className="w-[35px] md:w-[75px]" />
                <span className="text-[#49ED4A] mt-2 md:mt-4 text-xs md:!text-lg">Keep it up, you will get 1 NFT.</span>
              </div>
            </div>
            <div className="relative">
              <div className="flex bg-[url('/images/Epigraph.gif')] bg-cover bg-center items-center justify-center w-[60px] h-[68px] md:w-[105px] md:h-[105px] border-2 border-[#49ED4A] rounded-[15px] md:rounded-[25px] text-white font-bold text-lg md:!text-2xl text-center">
                {leaderboard ? (rankEmojis[Number(leaderboard.ranking) - 1] || leaderboard.ranking) : "-"}
              </div>
              <img hidden={(leaderboard?.ranking ?? 0) > (config?.ranking_reward as number ?? 0)} src="/images/Icon/Gift.png" className="w-[65px] md:w-[110px] max-w-max absolute left-0 -bottom-8 md:!-bottom-12 md:!left-0" />
            </div>
          </div>
          <div className="w-full grid md:grid-cols-3 gap-x-4">
            <div className="flex bg-[url('/images/Cosmos.gif')] bg-cover bg-center flex-grow items-center justify-between p-4 px-8 h-[68px] md:h-[105px] w-full border-2 border-[#49ED4A] rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
              <div className="flex items-center gap-4">
                <div className="w-[40px] h-[40px] md:w-[70px] md:h-[70px] bg-amber-200 rounded-full flex items-center justify-center">
                  <Link href={`/p/${leaderboard?.staker_address}`} >
                    <img
                      src={leaderboard?.user_image_url ?? DEFAULT_IMAGE_PROFILE}
                      alt={leaderboard?.staker_address ?? ""}
                      className="rounded-full object-cover w-full h-full"
                      onError={(e: any) => {
                        e.target.src = DEFAULT_IMAGE_PROFILE;
                      }}
                    />
                  </Link>
                </div>
                <div>
                  <span className="text-[13px] md:text-[20px] text-white">Address</span>
                  <Link href={`https://www.stargaze.zone/p/${leaderboard?.staker_address}`} target="_blank" className="text-center text-[#DB2877]">
                    <p className="text-[12px] md:text-[20px] font-bold ">
                      {formatAddress(leaderboard?.staker_address)}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:!flex bg-[url('/images/About.gif')] bg-cover bg-center flex-grow items-center p-4 px-8 gap-6 w-[60px] h-[68px] md:w-[105px] md:h-[105px] md:w-full border-2 border-[#49ED4A] rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
              <div>
                <img src="/images/Icon/wzrd.png" className="h-[55px]" />
              </div>
              <div className="hidden md:!block">
                <span className="text-[12px] md:text-[20px] text-white">Token</span>
                <p className="text-[10px] md:text-[20px] font-bold text-white">
                  {/* <NumberTicker value={leaderboard?.total_points ?? 0} decimalPlaces={2} skipAnimation={true} /> $WZRD */}
                  {formatDecimal(leaderboard?.total_points ?? 0, 2)} $WZRD
                </p>
              </div>
            </div>
            <div className="hidden md:!flex bg-[url('/images/Lab.gif')] bg-cover bg-center flex-grow items-center p-4 px-8 gap-8 w-[60px] h-[68px] md:w-[105px] md:h-[105px] md:w-full border-2 border-[#49ED4A] rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
              <div className="text-6xl">
                <img src="/images/Token.png" className="h-[50px]" />
              </div>
              <div className="text-left">
                <span className="text-[12px] md:text-[20px] text-white">NFT</span>
                <p className="text-[12px] text-white hidden md:!block md:text-[20px] font-bold">
                  {/* <NumberTicker value={leaderboard?.staker_nft_staked ?? 0} decimalPlaces={2} skipAnimation={true} /> Staked */}
                  {formatDecimal(leaderboard?.staker_nft_staked ?? 0, 2)} Staked
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className={cn("w-full grid grid-cols-2 md:!hidden px-4 gap-x-2", (leaderboard?.ranking ?? 0) > (config?.ranking_reward as number ?? 0) ? "mt-2" : "mt-9")}>
          <div className="flex bg-[url('/images/About.gif')] bg-cover bg-center flex-grow items-center justify-center p-4 px-8 gap-6 h-[68px] md:h-[105px] w-full border-2 border-[#49ED4A] rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
            {/* <div>
              <img src="/images/Icon/wzrd.png" className="shrink-0 h-[40px]" />
            </div> */}
            <div className="text-center">
              <span className="text-[12px] md:text-[20px] text-white">Token</span>
              <p className="text-[13px] md:text-[20px] font-bold text-white">
                {/* <NumberTicker value={leaderboard?.total_points ?? 0} decimalPlaces={2} skipAnimation={true} /> $WZRD */}
                {formatDecimal(leaderboard?.total_points ?? 0, 2)} $WZRD
              </p>
            </div>
          </div>
          <div className="flex bg-[url('/images/Lab.gif')] bg-cover bg-center flex-grow items-center justify-center p-4 px-8 gap-8 h-[68px] md:h-[105px] w-full border-2 border-[#49ED4A] rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
            {/* <div className="text-6xl">
              <img src="/images/Token.png" className="shrink-0 h-[35px]" />
            </div> */}
            <div className="text-center">
              <span className="text-[12px] md:text-[20px] text-white">NFT</span>
              <p className="text-[13px] text-white md:text-[20px] font-bold">
                {/* <NumberTicker value={leaderboard?.staker_nft_staked ?? 0} decimalPlaces={2} skipAnimation={true} /> Staked */}
                {formatDecimal(leaderboard?.staker_nft_staked ?? 0, 2)} Staked
              </p>
            </div>
          </div>
        </div>
      </div>
      {
        loading && (
          <div className="my-6 text-center flex items-center justify-center">
            <Loading />
          </div>
        )
      }
    </div>
  );
};
