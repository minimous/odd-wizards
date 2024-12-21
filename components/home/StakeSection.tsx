import React from "react";
import { BoxLeaderboard } from "@/components/BoxLaederboard";
import StakeCard from "@/components/StakeCard";
import StakeCardMobile from "../StakeCardMobile";

const StakeSection = () => {
  return (
    <div className="relative bg-black rounded-t-[100px]">
      <div className="absolute -top-4 md:!-top-32 left-6 right-6 md:left-20 md:right-20">
        <div className="hidden md:!flex w-full">
          <StakeCard />
        </div>
        <div className="flex md:!hidden w-full">
          <StakeCardMobile />
        </div>
      </div>
      <div className="h-[220px] md:!h-[135px]" />
      <BoxLeaderboard />
    </div>
  );
};

export default StakeSection;
