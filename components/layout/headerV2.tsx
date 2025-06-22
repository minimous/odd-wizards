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

export default function HeaderV2() {
  const path = usePathname();
  const [projects, setProjects] = useState<mst_project[] | []>([]);
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    async function fetchData() {
      showLoading();

      const projectResp = await axios.get(`/api/project/list`);
      setProjects(projectResp.data.data ?? []);

      hideLoading();
    }

    fetchData();
  }, []);

  return (
    <header className="sticky inset-x-0 top-0 z-40 w-full border-b-2 border-[#2D253E] bg-[#0D0A13] px-10">
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
              path == '/challenge'
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            Raffle
          </Link>
        </div>
        <div>
          <ConnectButtonV2 />
        </div>
      </nav>
      {/* <ChainSelection /> */}
    </header>
  );
}
