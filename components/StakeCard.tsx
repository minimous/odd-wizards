"use client";

import { FC } from "react";
import StakeButton from "@/components/StakeButton";
import { WalletStatus } from '@cosmos-kit/core';
import { useWallet } from "@cosmos-kit/react";
import ConnectButton from "@/components/ConnectButton";

const StakeCard: FC = () => {

  const wallet = useWallet();

  return (
    <div className="bg-[#18181B] border-2 border-[#323237] p-8 rounded-[85px] flex gap-x-4">
      <img src="/images/stake-wizard.gif" className="w-[175px] rounded-[50px]" />
      <div className="w-full p-4">
        <div className="flex justify-between mb-2">
          <h1 className="text-white text-4xl font-semibold">Odd Wizard</h1>
          <div className="flex items-center gap-x-4">
            <span className="text-white text-lg font-semibold">Trade collection 👉</span>
            <img src="/images/Icon/stargaze.png" width="30px" />
          </div>
        </div>
        <p className="text-lg text-gray-400 leading-tight">Each NFT represents a unique wizard, crafted to</p>
        <p className="text-lg text-gray-400 leading-tight">guide and assist you in exploring the cosmos.</p>
        {

        }
        {
          wallet.status != WalletStatus.Connected ? (
            <div className="mt-2">
              <ConnectButton />
            </div>
          ) : (
            <StakeButton />
          )
        }
      </div>
    </div>
  );
};

export default StakeCard;
