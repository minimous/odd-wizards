'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChainSelection from "./chain-selection";
import ConnectButton from "../ConnectButton";
import ConnectButtonV2 from "../ConnectButtonV2";

export default function HeaderV2() {

  const path = usePathname();

  return (
    <header className="sticky inset-x-0 top-0 z-40 w-full bg-[#0D0A13]/30 px-10 py-2">
      <nav className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-8">
          <div className="relative">
            <Link
              href="/"
              aria-label="Home"
              className="group overflow-hidden w-[50px] md:w-[45px] h-[40px] md:h-[40px] flex items-center justify-center"
            >
              <img
                src="/images/logo.png"
                alt="Logo"
                className="group-hover:hidden object-contain"
              />
              <img
                src="/images/logo.gif"
                alt="Logo"
                className="hidden group-hover:block object-contain"
              />
            </Link>
          </div>
          <Link
            href="/"
            className={cn("font-semibold hidden md:!flex transition-transform ", (path == "/" ? "text-white" : "text-gray-400 hover:text-white"))}
          >
            NFT
          </Link>
          <Link
            href="/chellenge"
            className={cn("font-semibold hidden md:!flex transition-transform ", (path == "/challenge" ? "text-white" : "text-gray-400 hover:text-white"))}
          >
            Chellenge
          </Link>
          <Link
            href="/stake"
            className={cn("font-semibold hidden md:!flex transition-transform ", (path == "/challenge" ? "text-white" : "text-gray-400 hover:text-white"))}
          >
            Stake
          </Link>
          <Link
            href="/Raffle"
            className={cn("font-semibold hidden md:!flex transition-transform ", (path == "/challenge" ? "text-white" : "text-gray-400 hover:text-white"))}
          >
            Raffle
          </Link>
        </div>
        <div>
          <ConnectButtonV2 />
        </div>
      </nav>
      <ChainSelection />
    </header>
  );
}
