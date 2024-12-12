import React from "react";
import { BoxLeaderboard } from "@/components/BoxLaederboard";
import StakeCard from "@/components/StakeCard";

const StakeSection = () => {
  return (
    <div className="relative bg-black rounded-t-[100px]">
      <div className="absolute -top-32 left-24 right-24">
        <StakeCard />
      </div>
      <div className="h-[150px]" />
      <BoxLeaderboard />
    </div>
  );
};

export default StakeSection;
