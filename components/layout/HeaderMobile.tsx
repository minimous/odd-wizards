'use client';

import Link from 'next/link';

import { cn, formatAddress } from '@/lib/utils';
import { WalletStatus } from '@cosmos-kit/core';
import { Button } from '@/components/ui/button';
import { Footer } from './footer';
import { DEFAULT_IMAGE_PROFILE } from '@/constants';
import { useNavbarMobile } from '@/hooks/useNavbarMobile';
import { usePathname } from 'next/navigation';
import { useWallet } from '@cosmos-kit/react';
import getConfig from '@/config/config';
import { useEffect, useState } from 'react';
import { useChain } from '@cosmos-kit/react';
import { useUser } from '@/hooks/useUser';
import axios from 'axios';
import { ChevronDownIcon } from 'lucide-react';
import { mst_project } from '@prisma/client';
import ConnectButtonV2 from '../ConnectButtonV2';
import { useSyncedWallet } from '@/providers/wallet-provider-wrapper';

export default function HeaderMobile() {
  const { address, isConnected } = useSyncedWallet();
  const config = getConfig();
  const path = usePathname();
  const { isOpened, setOpen } = useNavbarMobile();
  const [opend, setOpend] = useState<boolean>(isOpened);
  const [stakeOpen, setStakeOpen] = useState<boolean>(false);
  const [projects, setProjects] = useState<mst_project[] | []>([]);

  useEffect(() => {
    async function fetchData() {
      if (address) {
        let resp = await axios.get(
          `/api/user/${address}?collection_address=${config?.collection_address}`
        );
        // setUser(resp.data.data);
      }

      const projectResp = await axios.get(`/api/project/list`);
      setProjects(projectResp.data.data ?? []);
    }

    fetchData();
  }, [address]);

  useEffect(() => {
    setOpend(isOpened);
  }, [isOpened]);

  return (
    <div>
      {/* Mobile Menu */}
      {opend && (
        <div className="absolute left-0 right-0 top-0 z-[99] h-screen bg-black bg-cover bg-center py-4 md:hidden">
          <div className="relative pt-10">
            <img
              src={
                isConnected
                  ? '/images/mobile/goblin.png'
                  : '/images/mobile/goblin-sleep.png'
              }
              className="pointer-events-none absolute right-0 top-24 w-[155px]"
            />
            <div className="absolute right-2 top-0">
              <button
                onClick={() => setOpen(false)}
                aria-label="Open Menu"
                className="rounded-[10px] p-2 text-white focus:outline-none"
              >
                <svg
                  className="h-5 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M2 22L22 2M2 2l20 20"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col space-y-4 text-center">
              <div className="mx-auto max-w-max transition-transform">
                <ConnectButtonV2 />
              </div>
              <Link
                onClick={() => setOpen(false)}
                href="/challenge"
                className={cn(
                  'mx-auto max-w-max text-xl font-bold transition-transform',
                  path == '/' || path == '/about'
                    ? 'text-white'
                    : 'text-gray-200 hover:text-white'
                )}
              >
                Challenge
              </Link>
              <div>
                <div
                  onClick={() => {
                    setStakeOpen(!stakeOpen);
                  }}
                  className="mx-auto flex max-w-max cursor-pointer items-center gap-1 "
                >
                  <span
                    className={cn(
                      'mx-auto max-w-max text-xl font-bold transition-transform',
                      path == '/' || path == '/stake'
                        ? 'text-white'
                        : 'text-gray-200 hover:text-white'
                    )}
                  >
                    Stake
                  </span>
                  {/* <ChevronDownIcon
                                        className={cn("relative top-[1px] ml-1 h-6 w-6 transition duration-300", stakeOpen && "rotate-180")}
                                        aria-hidden="true"
                                    /> */}
                </div>
                <div hidden={!stakeOpen} className="mt-2 text-center">
                  {projects.map((project, index) => {
                    return (
                      <div key={index}>
                        {project.project_status == 'N' ? (
                          <div className="mt-1 flex items-center justify-center hover:scale-105 hover:font-semibold">
                            <span className="col-span-2 opacity-30">
                              {project.project_icon}
                            </span>
                            <div className="col-span-10 flex opacity-30">
                              {project.project_name} (Soon)
                            </div>
                          </div>
                        ) : (
                          <Link
                            onClick={() => setOpen(false)}
                            href={`/stake/${project.project_code}`}
                            className="mt-1 flex items-center justify-center hover:scale-105 hover:font-semibold"
                          >
                            <span className="col-span-2">
                              {project.project_icon}
                            </span>
                            <span className="col-span-10">
                              {project.project_name}
                            </span>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <Link
                onClick={() => setOpen(false)}
                href="/raffle"
                className={cn(
                  'mx-auto max-w-max text-xl font-bold transition-transform',
                  path == '/' || path == '/raffle'
                    ? 'text-white'
                    : 'text-gray-200 hover:text-white'
                )}
              >
                Raffle
              </Link>
              <Link
                onClick={() => setOpen(false)}
                href="/leaderboard"
                className={cn(
                  'mx-auto max-w-max text-xl font-bold transition-transform',
                  path == '/' || path == '/leaderboard'
                    ? 'text-white'
                    : 'text-gray-200 hover:text-white'
                )}
              >
                Leaderboard
              </Link>
              <Footer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
