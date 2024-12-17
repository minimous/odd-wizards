import React from "react";
import { BoxLeaderboard } from "@/components/BoxLaederboard";
import StakeCard from "@/components/StakeCard";
import StakeCardMobile from "../StakeCardMobile";

const StakeSection = () => {
  return (
    <div className="relative bg-black rounded-t-[100px]">
      <div className="absolute -top-28 md:!-top-32 left-6 right-6 md:left-24 md:right-24">
        <div className="hidden md:!flex w-full">
          <StakeCard />
        </div>
        <div className="flex md:!hidden w-full">
          <StakeCardMobile />
        </div>
      </div>
      <div className="h-[150px] md:!h-[175px]" />
      <BoxLeaderboard />
    </div>
  );
};

export default StakeSection;
