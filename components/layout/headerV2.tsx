'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ChainSelection from './chain-selection';
import ConnectButton from '../ConnectButton';
import ConnectButtonV2 from '../ConnectButtonV2';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { useEffect, useState } from 'react';
import { mst_project } from '@prisma/client';
import { useLoading } from '@/hooks/useLoading';
import axios from 'axios';
import RewardModalModal from '../modal/reward-modal';
import { useSyncedWallet } from '@/providers/wallet-provider-wrapper';
import { useNavbarMobile } from '@/hooks/useNavbarMobile';

export default function HeaderV2() {
  const path = usePathname();
  const { isOpened, setOpen } = useNavbarMobile();
  const [projects, setProjects] = useState<mst_project[] | []>([]);
  const [rewardModal, setRewardModal] = useState<boolean>(false);
  const { showLoading, hideLoading } = useLoading();

  // Get wallet and user data from synced wallet provider
  const { address, user } = useSyncedWallet();

  useEffect(() => {
    async function fetchData() {
      showLoading();

      const projectResp = await axios.get(`/api/project/list`);
      setProjects(projectResp.data.data ?? []);

      hideLoading();
    }

    fetchData();
  }, []);

  // Check for winner status and show reward modal
  useEffect(() => {
    if (address) {
      const handleLoad = async () => {
        try {
          const resp = await axios.get(`/api/user/${address}`);
          const userReward = resp.data.data.user;
          if (userReward?.is_winner === 'Y' && address) {
            setTimeout(() => {
              setRewardModal(true);
            }, 500);
          }
        } catch (error) {
          console.error('Error checking winner status:', error);
        }
      };

      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, [address]);

  return (
    <>
      <RewardModalModal
        isOpen={rewardModal}
        setOpen={setRewardModal}
        onClose={() => {}}
        wallet={address ?? ''}
      />

      <header className="sticky inset-x-0 top-0 z-40 w-full border-b border-[#2D253E] bg-[#0D0A13] px-4 md:px-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative">
              <Link
                href="/"
                aria-label="Home"
                className="group flex h-[50px] w-[55px] items-center justify-center overflow-hidden rounded-[10px] md:h-[70px] md:w-[75px]"
              >
                <img
                  src="/images/logov2.png"
                  alt="Logo"
                  className="object-contain"
                />
                {/* <img
                  src="/images/logo.gif"
                  alt="Logo"
                  className="hidden group-hover:block object-contain"
                /> */}
              </Link>
            </div>
            <Link
              href="/"
              className={cn(
                'hidden font-semibold transition-transform md:!flex ',
                path == '/' ? 'text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              NFT
            </Link>
            {/* Navigation Links */}
            <div className="hidden space-x-8 md:!flex">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="bg-transparent hover:!bg-transparent focus:!bg-transparent data-[active]:!bg-transparent data-[state=open]:!bg-transparent">
                    <NavigationMenuTrigger
                      className={cn(
                        'bg-transparent px-0 py-0 text-base font-semibold hover:!bg-transparent focus:!bg-transparent data-[active]:!bg-transparent data-[state=open]:!bg-transparent',
                        path == '/stake'
                          ? 'text-white hover:text-white'
                          : 'text-gray-400 hover:text-gray-400 hover:text-white'
                      )}
                    >
                      Stake
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-0">
                      <div className="grid w-[250px] gap-2 !bg-white p-4">
                        {projects.map((project, index) => {
                          return (
                            <div key={index}>
                              {project.project_status == 'N' ? (
                                <div className="grid grid-cols-12 items-center hover:scale-105 hover:font-semibold">
                                  <span className="col-span-2 opacity-30">
                                    {project.project_icon}
                                  </span>
                                  <div className="col-span-10 flex text-[#156E7E] opacity-30">
                                    {project.project_name} (Soon)
                                  </div>
                                </div>
                              ) : (
                                <Link
                                  href={`/stake/${project.project_code}`}
                                  className="grid grid-cols-12 items-center hover:scale-105 hover:font-semibold"
                                >
                                  <span className="col-span-2">
                                    {project.project_icon}
                                  </span>
                                  <span className="col-span-10 text-[#156E7E]">
                                    {project.project_name}
                                  </span>
                                </Link>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <Link
              href="/raffle"
              className={cn(
                'hidden font-semibold transition-transform md:!flex ',
                path == '/raffle'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Raffle
            </Link>
            <Link
              href="/leaderboard"
              className={cn(
                'hidden font-semibold transition-transform md:!flex ',
                path == '/raffle'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Leaderboard
            </Link>
          </div>
          <div className="hidden md:!flex">
            <ConnectButtonV2 />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-x-3 md:!hidden">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open Menu"
              className="rounded-[5px] bg-white px-2 py-1 text-black focus:outline-none"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpened ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M2 22L22 2M2 2l20 20"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M-6 6h36M-6 12h36M-6 18h36"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>
        {/* <ChainSelection /> */}
      </header>
    </>
  );
}
