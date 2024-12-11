import Image from "next/image";
import React from "react";

export const BoxLeaderboard = () => {
  return (
    <div className="flex gap-4 w-full px-4 md:px-12 lg:px-20">
      <div className="flex items-center justify-center w-[60px] h-[60px] md:w-[105px] md:h-[105px] bg-[#18181B] border-2 border-[#49ED4A] shadow-sm shadow-[#49ED4A] rounded-[25px] text-[#A1A1AA] font-bold text-2xl text-center">
        1
      </div>
      <div className="flex flex-grow items-center justify-between  p-4 px-8 gap-2 w-[60px] h-[60px] md:h-[105px] md:w-full bg-[#18181B] border-2 border-[#49ED4A] shadow-sm shadow-[#49ED4A] rounded-[25px] text-[#A1A1AA]">
        <div className="flex items-center gap-4">
          <div className="w-[35px] h-[35px] md:w-[70px] md:h-[70px]  bg-amber-200 rounded-full flex items-center justify-center">
            <Image
              src="/images/seals.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>
          <div className="text-center text-[#49ED4A]">
            <p className="text-[10px] md:text-[20px] font-bold ">
              Stars123...1234
            </p>
          </div>
        </div>
        <div className="text-center text-[#49ED4A]">
          <p className="text-[10px] md:text-[20px] font-bold">56.333 $SEALS</p>
        </div>

        <div className="text-center text-[#49ED4A] ">
          <p className="text-[10px] md:text-[20px] font-bold">21 NFT Staked</p>
        </div>
      </div>
    </div>
  );
};
