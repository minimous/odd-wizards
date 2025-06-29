'use client';

import { FC, useEffect, useRef, useState } from 'react';
import StakeButton from '@/components/StakeButton';
import { WalletStatus } from '@cosmos-kit/core';
import { useChain, useWallet } from '@cosmos-kit/react';
import ConnectButton from '@/components/ConnectButton';
import axios, { AxiosError } from 'axios';
import { mst_collection, mst_staker } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { promiseToast, useToast } from './ui/use-toast';
import { useClaim } from '@/hooks/useClaim';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { BorderBeam } from './ui/border-beam';
import InfoModal from './modal/info-modal';
import { useSyncedWallet } from '@/providers/wallet-provider-wrapper';
import ConnectButtonV2 from './ConnectButtonV2';

export interface MultipleStakeCardProps {
  projectCode: string;
}

const MultipleStakeCard = ({ projectCode }: MultipleStakeCardProps) => {
  const [staker, setStaker] = useState<mst_staker | undefined>(undefined);
  const [isFetch, setIsFetch] = useState<boolean>(false);
  const { isConnected, address } = useSyncedWallet(); // Use the 'stargaze' chain from your Cosmos setup
  const { toast } = useToast();
  const { claim, setClaim } = useClaim();
  const claimRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsFetch(false);
    async function fetchData() {
      try {
        let resp = await axios.get(
          `/api/soft-staking/available-point?wallet_address=${address}&project_code=${projectCode}`
        );
        let data = resp.data.data;
        // setPoints(data.points);
        setStaker(data.staker);
      } catch (error: AxiosError | any) {}
      setIsFetch(true);
    }

    if (isConnected && address) {
      fetchData();
    }
  }, [address, claim]);

  const doStakeAndClaim = async () => {
    try {
      setClaim(false);
      promiseToast(
        axios.post('/api/soft-staking/claim', {
          staker_address: address,
          project_code: projectCode
        }),
        {
          loading: {
            title: 'Processing...',
            description: 'Please Wait'
          },
          success: (result) => {
            setClaim(true);
            showConfeti();
            return {
              title: 'Success!',
              description: 'Stake and Claim Successfully'
            };
          },
          error: (error: AxiosError | any) => ({
            title: 'Ups! Something wrong.',
            description:
              error?.response?.data?.message || 'Internal server error.'
          })
        }
      );
    } catch (error: AxiosError | any) {
      toast({
        variant: 'destructive',
        title: 'Ups! Something wrong.',
        description: error?.response?.data?.message || 'Internal server error.'
      });
    }
  };

  const showConfeti = () => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star']
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle']
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
  };

  return (
    <div className="w-full gap-x-4 px-6 md:!px-20 lg:px-20">
      <div className="w-full">
        {/* <p className="text-xs md:!text-lg text-gray-400 leading-tight">guide and assist you in exploring the cosmos.</p> */}
        <div className="relative mx-auto mt-4 md:!mx-0 md:!mt-4">
          {!isConnected ? (
            <div className="">
              <ConnectButtonV2 className="w-full" showProfile={false} />
            </div>
          ) : isFetch ? (
            <div className="">
              {staker ? (
                <Button
                  disabled={!isFetch}
                  ref={claimRef}
                  variant={'ghost'}
                  onClick={doStakeAndClaim}
                  className="h-max w-full rounded-xl bg-green-500 px-8 py-3 text-[15px] font-bold text-black hover:bg-green-400 hover:text-black md:!text-xl"
                >
                  Stake and Claim
                </Button>
              ) : (
                <StakeButton
                  projectCode={projectCode}
                  className="bg-[#171717]"
                />
              )}
            </div>
          ) : (
            <Button
              variant={'ghost'}
              disabled={true}
              className="h-max w-full rounded-xl bg-green-500 px-8 py-3 text-[14px] font-black text-black hover:bg-green-400 hover:text-black md:!text-xl"
            >
              {' '}
              <svg
                className="mr-3 h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="black" /* Menentukan warna hitam */
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="black" /* Memberikan warna hitam */
                  d="M4 12a8 8 0 018-8V0C6.373 0 0 6.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>{' '}
              Please Wait
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleStakeCard;
