"use client";
import getConfig from "@/config/config";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { formatAddress } from "@/lib/utils";
import { LeaderboardItem } from "@/types/leaderboard";
import { useChain } from "@cosmos-kit/react";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useClaim } from "@/hooks/useClaim";

export const BoxLeaderboard = () => {

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
        <div className="relative flex gap-4 md:!gap-6 w-full px-4 md:px-12 lg:px-20">
          <div hidden={(leaderboard?.ranking ?? 0) > (config?.ranking_reward as number ?? 0)}>
            <div className="absolute flex items-center left-20 -bottom-12 md:-bottom-16 md:left-44 gap-x-4">
              <img src="/images/Icon/Arrow.png" className="w-[50px] md:w-[75px]" />
              <span className="text-[#49ED4A] mt-2 md:mt-4 text-xs md:!text-lg">Congrats, you got 1 NFT, keep it up!</span>
            </div>
            <div className="relative">
              <div className="flex items-center justify-center w-[50px] h-[50px] md:w-[105px] md:h-[105px] bg-[#18181B] border-2 border-[#49ED4A] shadow-sm shadow-[#49ED4A] rounded-[15px] md:rounded-[25px] text-white font-bold text-2xl text-center">
                1
              </div>
              <img src="/images/Icon/Gift.png" className="w-[75px] md:w-[110px] max-w-max absolute -left-3 -bottom-10 md:!-bottom-12 md:!left-0" />
            </div>
          </div>
          <div className="flex flex-grow items-center justify-between  p-4 px-8 gap-2 w-[50px] h-[50px] md:w-[105px] md:h-[105px] md:w-full bg-[#18181B] border-2 border-[#49ED4A] shadow-sm shadow-[#49ED4A] rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
            <div className="flex items-center gap-4">
              <div className="w-[35px] h-[35px] md:w-[70px] md:h-[70px]  bg-amber-200 rounded-full flex items-center justify-center">
                <img
                  src={leaderboard?.user_image_url ?? DEFAULT_IMAGE_PROFILE}
                  alt={leaderboard?.staker_address ?? ""}
                  className="rounded-full object-cover w-full h-full"
                  onError={(e: any) => {
                    e.target.src = DEFAULT_IMAGE_PROFILE;
                  }}
                />
              </div>
              <div className="text-center text-[#49ED4A]">
                <p className="text-[10px] md:text-[20px] font-bold ">
                  {formatAddress(leaderboard?.staker_address)}
                </p>
              </div>
            </div>
            <div className="text-center text-[#49ED4A]">
              <p className="text-[10px] md:text-[20px] font-bold">{leaderboard?.total_points} $WZRD</p>
            </div>

            <div className="text-center text-[#49ED4A] ">
              <p className="text-[10px] md:text-[20px] font-bold">{leaderboard?.staker_nft_staked} NFT Staked</p>
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
