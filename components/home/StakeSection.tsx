import Image from "next/image";
import React from "react";
import { BoxLeaderboard } from "@/components/BoxLaederboard";
import StakeButton from "@/components/StakeButton";

const StakeSection = () => {
  return (
    <div className="relative bg-black rounded-t-[100px]">
      <div className="absolute -top-32 left-24 right-24 flex gap-x-4 bg-[#18181B] border-2 border-[#323237] p-8 rounded-[85px]">
        <img src="/images/stake-wizard.gif" className="w-[175px] rounded-[50px]" />
        <div className="w-full p-4">
          <div className="flex justify-between mb-2">
            <h1 className="text-white text-4xl font-semibold">Odd Wizard</h1>
            <div className="flex items-center gap-x-4">
              <span className="text-white text-lg font-semibold">Trade collection 👉</span>
              <img src="/images/icon/stargaze.png" width="30px" />
            </div>
          </div>
          <p className="text-lg text-gray-400 leading-tight">Each NFT represents a unique wizard, crafted to</p>
          <p className="text-lg text-gray-400 leading-tight">guide and assist you in exploring the cosmos.</p>
          <StakeButton />
        </div>
      </div>
      <div className="h-[150px]" />
      <BoxLeaderboard />
    </div>
  );
};

export default StakeSection;
