'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChainSelection from "./chain-selection";
import ConnectButton from "../ConnectButton";
import ConnectButtonV2 from "../ConnectButtonV2";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useEffect, useState } from "react";
import { mst_project } from "@prisma/client";
import { useLoading } from "@/hooks/useLoading";
import axios from "axios";

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
    <header className="sticky inset-x-0 top-0 z-40 w-full bg-[#0D0A13] px-10 border-b-2 border-[#2D253E]">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="relative">
            <Link
              href="/"
              aria-label="Home"
              className="group rounded-[10px] overflow-hidden w-[55px] md:w-[75px] h-[50px] md:h-[70px] flex items-center justify-center"
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
            href="/v2"
            className={cn("font-semibold hidden md:!flex transition-transform ", (path == "/v2" ? "text-white" : "text-gray-400 hover:text-white"))}
          >
            NFT
          </Link>
          {/* Navigation Links */}
          <div className="hidden md:!flex space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem className="bg-transparent hover:!bg-transparent focus:!bg-transparent data-[active]:!bg-transparent data-[state=open]:!bg-transparent">
                  <NavigationMenuTrigger className={cn("bg-transparent py-0 px-0 hover:!bg-transparent focus:!bg-transparent data-[active]:!bg-transparent data-[state=open]:!bg-transparent text-base font-semibold", (path == "/stake" ? "text-white hover:text-white" : "text-gray-400 hover:text-gray-400 hover:text-white"))}>Stake</NavigationMenuTrigger>
                  <NavigationMenuContent className="p-0">
                    <div className="grid gap-2 w-[250px] p-4 !bg-white">
                      {
                        projects.map((project, index) => {
                          return <div key={index}>
                            {
                              project.project_status == "N" ?
                                <div className="grid grid-cols-12 items-center hover:scale-105 hover:font-semibold">
                                  <span className="col-span-2 opacity-30">{project.project_icon}</span>
                                  <div className="text-[#156E7E] opacity-30 col-span-10 flex">{project.project_name} (Soon)</div>
                                </div>
                                :
                                <Link href={`/stake/${project.project_code}`} className="grid grid-cols-12 items-center hover:scale-105 hover:font-semibold">
                                  <span className="col-span-2">{project.project_icon}</span>
                                  <span className="text-[#156E7E] col-span-10">{project.project_name}</span>
                                </Link>
                            }
                          </div>
                        })
                      }
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <Link
            href="/raffle"
            className={cn("font-semibold hidden md:!flex transition-transform ", (path == "/challenge" ? "text-white" : "text-gray-400 hover:text-white"))}
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
