"use client";

import Link from "next/link";
import Image from "next/image";

import { useState, useEffect } from "react";
import { useChain } from "@cosmos-kit/react"; // Import the hook for handling chain connection
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { connect, disconnect, address } = useChain("stargaze"); // Use the 'stargaze' chain from your Cosmos setup

  // Check if the wallet is connected
  useEffect(() => {
    if (address) {
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
    }
  }, [address]);

  // Handle connecting the wallet
  const handleConnectWallet = async () => {
    try {
      await connect(); // Connect the wallet
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Handle disconnecting the wallet
  const handleDisconnectWallet = async () => {
    try {
      await disconnect(); // Disconnect the wallet
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return (
    <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-10 py-5 bg-transparent z-50">
      <div className="container mx-auto flex items-center justify-between w-full">
        {/* Logo and Links */}
        <div className="flex items-center space-x-10">
          {/* Logo */}
          <Link href="/" aria-label="Home">
            <img
              src="/images/logo.png"
              alt="Logo"
              width={75}
              className="rounded-md"
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
              href="/"
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
          {!isWalletConnected ? (
            <Button
              variant={"ghost"}
              className="px-8 py-4 h-max font-black text-black rounded-xl bg-white hover:bg-white hover:text-black"
              onClick={handleConnectWallet}
              aria-label="Connect"
            >
              Connect
            </Button>
          ) : (
            <div className="flex items-center gap-x-3">
              <Button
                className="px-5 py-4 h-max font-black text-black rounded-xl bg-white hover:bg-white hover:text-black"
                onClick={handleDisconnectWallet}
                aria-label={address}
              >
                {address ? `${address.substring(0, 8)}...${address.substring(address.length - 5)}` : ""}
              </Button>
              <img src="/images/wizard.png" className="w-[60px] h-[60px]" />
            </div>
          )}
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
              href="/"
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
            {!isWalletConnected ? (
              <Button
                onClick={handleConnectWallet}
                aria-label="Connect Wallet"
                className="px-5 py-4 h-max font-black text-black rounded-xl bg-white hover:bg-white hover:text-black"
              >
                Connect
              </Button>
            ) : (
              <div className="w-full flex items-center gap-x-3">
                <Button
                  className="w-full px-5 py-4 h-max font-black text-black rounded-xl bg-white hover:bg-white hover:text-black"
                  onClick={handleDisconnectWallet}
                  aria-label={address}
                >
                  {address ? `${address.substring(0, 8)}...${address.substring(address.length - 5)}` : ""}
                </Button>
                <img src="/images/wizard.png" className="w-[60px] h-[60px]" />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
