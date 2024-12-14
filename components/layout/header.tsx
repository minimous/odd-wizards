"use client";

import Link from "next/link";

import { useState, useEffect } from "react";
import ConnectButton from "@/components/ConnectButton";
import { useChain } from "@cosmos-kit/react";
import axios from "axios";
import { useUser } from "@/hooks/useUser";
import getConfig from "@/config/config";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { address } = useChain("stargaze"); // Use the 'stargaze' chain from your Cosmos setup
  const { setUser } = useUser();
  const config = getConfig();

  useEffect(() => {
    
    async function fetchData(){
      if(address){
        let resp = await axios.get(`/api/user/${address}?collection_address=${config?.collection_address}`);
        setUser(resp.data.data);
      }
    }

    fetchData();
  
  }, [address])

  return (
    <nav className="absolute top-0 left-0 right-0 flex items-center justify-between md:px-10 py-5 bg-transparent z-50">
      <div className="container mx-auto flex items-center justify-between w-full">
        {/* Logo and Links */}
        <div className="flex items-center space-x-4 md:space-x-10">
          {/* Logo */}
          <Link href="/" aria-label="Home">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-[50px] md:w-[75px]  rounded-md"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/about"
              className="text-2xl font-bold text-white hover:text-gray-200 transition-colors duration-300"
              style={{ textShadow: 'rgb(100 100 100 / 50%) 0px 0px 12px' }}
            >
              About
            </Link>
            <Link
              href="/gallery"
              className="text-2xl font-bold text-white hover:text-gray-200 transition-colors duration-300"
              style={{ textShadow: 'rgb(100 100 100 / 50%) 0px 0px 12px' }}
            >
              Gallery
            </Link>
            <Link
              href="/stake"
              className="text-2xl font-bold text-white hover:text-gray-200 transition-colors duration-300"
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
        <div className="md:hidden sm:flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open Menu"
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-0 left-0 right-0 mt-24 rounded-b-[30px] bg-neutral-900 px-6 py-4 md:hidden">
          <div className="flex flex-col  text-center space-y-4">
            <Link
              href="/about"
              className="text-xl font-semibold text-white hover:text-gray-200 transition-colors duration-300"
            >
              About
            </Link>
            <Link
              href="/gallery"
              className="text-xl font-semibold text-white hover:text-gray-200 transition-colors duration-300"
            >
              Gallery
            </Link>
            <Link
              href="/stake"
              className="text-xl font-semibold text-white hover:text-gray-200 transition-colors duration-300"
            >
              Stake
            </Link>
            <ConnectButton />
          </div>
        </div>
      )}
    </nav>
  );
}
