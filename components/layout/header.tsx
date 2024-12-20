"use client";

import Link from "next/link";

import { useState, useEffect } from "react";
import ConnectButton from "@/components/ConnectButton";
import { useChain, useWallet } from "@cosmos-kit/react";
import axios from "axios";
import { useUser } from "@/hooks/useUser";
import getConfig from "@/config/config";
import { usePathname } from "next/navigation";
import { cn, formatAddress } from "@/lib/utils";
import { useNavbarMobile } from "@/hooks/useNavbarMobile";

export default function Header() {
  const { address } = useChain("stargaze"); // Use the 'stargaze' chain from your Cosmos setup
  const { setUser } = useUser();
  const config = getConfig();
  const path = usePathname();
  const { isOpened, setOpen } = useNavbarMobile();

  useEffect(() => {

    async function fetchData() {
      if (address) {
        let resp = await axios.get(`/api/user/${address}?collection_address=${config?.collection_address}`);
        setUser(resp.data.data);
      }
    }

    fetchData();

  }, [address]);

  return (
    <nav className="absolute top-0 left-0 right-0 flex items-center justify-between md:px-10 py-5 bg-transparent z-50">
      <div className="container mx-auto flex items-center justify-between w-full">
        {/* Logo and Links */}
        <div className="flex items-center space-x-4 md:space-x-10">
          {/* Logo */}
          <div className="relative">
            <Link
              href="/"
              aria-label="Home"
              className="group rounded-[12px] md:rounded-[20px] overflow-hidden w-[50px] md:w-[75px] h-[40px] md:h-[60px] flex items-center justify-center"
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
            <img src="/images/santa-hat.png" className="absolute -top-3 -left-3 md:-top-4 md:-left-4 h-[40px] md:h-[50px]" />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/about"
              className={cn("text-2xl font-bold transition-transform hover:animate-shake", path == "/" || path == "/about" ? "text-white" : "text-gray-400")}
              style={{ textShadow: 'rgb(100 100 100 / 50%) 0px 0px 12px' }}
            >
              About
            </Link>
            <Link
              href="/gallery"
              className={cn("text-2xl font-bold transition-transform hover:animate-shake", path == "/" || path == "/gallery" ? "text-white" : "text-gray-400")}
              style={{ textShadow: 'rgb(100 100 100 / 50%) 0px 0px 12px' }}
            >
              Gallery
            </Link>
            <Link
              href="/stake"
              className={cn("text-2xl font-bold transition-transform hover:animate-shake", path == "/" || path == "/stake" ? "text-white" : "text-gray-400")}
              style={{ textShadow: 'rgb(100 100 100 / 50%) 0px 0px 12px' }}
            >
              Stake
            </Link>
          </div>
        </div>

        {/* Connect Wallet Button */}
        <div className="hidden md:block">
          <ConnectButton />
        </div>
        {/* Mobile Menu Button */}
        <div className="md:!hidden flex items-center gap-x-3">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open Menu"
            className="text-black focus:outline-none bg-white p-2 rounded-lg"
          >
            <svg
              className="w-6 h-5"
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
          {/* <img src={user?.user_image_url ?? DEFAULT_IMAGE_PROFILE} onError={(e: any) => {
            e.target.src = DEFAULT_IMAGE_PROFILE;
          }} className="w-[40px] h-[40px] rounded-full" /> */}
        </div>
      </div>
    </nav>
  );
}
