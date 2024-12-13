"use client";

import { useChain, useWallet } from "@cosmos-kit/react";
import { Button } from "@/components/ui/button";
import { WalletStatus } from '@cosmos-kit/core';
import { useUser } from "@/hooks/useUser";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";

export default function ConnectButton() {
    const wallet = useWallet();
    const { user } = useUser();
    const { connect, disconnect, address } = useChain("stargaze"); // Use the 'stargaze' chain from your Cosmos setup

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

    return (<div className="">
        {wallet.status != WalletStatus.Connected ? (
            <Button
                variant="ghost"
                className="px-8 py-3 h-max font-black text-black rounded-xl bg-white hover:bg-white hover:text-black"
                onClick={handleConnectWallet}
                aria-label="Connect"
            >
                <div className="text-2xl font-black flex items-center">
                    {
                        wallet.status == WalletStatus.Connecting ? (
                            <div className="flex items-center gap-2">
                                <svg
                                className="animate-spin h-5 w-5 mr-3"
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
                                </svg>
                                Connecting
                            </div>
                        ) : (
                            <span>Connect</span>
                        )
                    }
                </div>
            </Button>
        ) : (
            <div className="flex items-center gap-x-3">
                <Button
                    className="px-5 py-3 h-max font-black text-black rounded-xl bg-white hover:bg-white hover:text-black"
                    onClick={handleDisconnectWallet}
                    aria-label={address}
                >
                    <span className="text-2xl font-black">{address ? `${address.substring(0, 8)}...${address.substring(address.length - 5)}` : ""}</span>
                </Button>
                <img src={ user?.user_image_url ?? DEFAULT_IMAGE_PROFILE } onError={(e: any) => {
                    e.target.src = DEFAULT_IMAGE_PROFILE;
                }} className="w-[60px] h-[60px] rounded-full" />
            </div>
        )}
    </div>)
}