"use client";

import { useChain, useWallet } from "@cosmos-kit/react";
import { Button } from "@/components/ui/button";
import { WalletStatus } from '@cosmos-kit/core';
import { useUser } from "@/hooks/useUser";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { cn, formatAddress } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import WalletConnectModal from "./modal/wallet-connect-modal";

export interface ConnectButtonProps {
    showProfile?: boolean,
    className?: string
}

export default function ConnectButtonV2({ showProfile = true, className }: ConnectButtonProps) {
    const wallet = useWallet();
    const { user: dataUser } = useUser();
    const [user, setUser] = useState(dataUser);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const { connect, disconnect, address } = useChain("stargaze");
    const { toast } = useToast();

    // Pre-initialize chain hooks for supported Cosmos chains
    const stargazeChain = useChain("stargaze");
    const osmosisChain = useChain("osmosis");
    const junoChain = useChain("juno");
    // Add other Cosmos chains as needed

    useEffect(() => {
        setUser(dataUser);
    }, [dataUser])

    // Helper function to get the appropriate chain hook
    const getChainHook = (chainId: string) => {
        switch (chainId) {
            case "stargaze":
                return stargazeChain;
            case "osmosis":
                return osmosisChain;
            case "juno":
                return junoChain;
            // Add other cases as needed
            default:
                return stargazeChain; // fallback
        }
    };

    // Handle connecting to specific chain
    const handleConnectChain = async (chainId: string, chainType: 'cosmos' | 'evm') => {
        setIsConnecting(true);
        try {
            if (chainType === 'cosmos') {
                // Handle Cosmos chains connection
                const chainHook = getChainHook(chainId);
                await chainHook.connect();
                toast({
                    title: "Connected!",
                    description: `Successfully connected to ${chainId}`,
                });
            } else {
                // Handle EVM chains connection
                if (typeof window !== 'undefined' && window.ethereum) {
                    const chainConfigs: { [key: string]: any } = {
                        ethereum: { chainId: '0x1', chainName: 'Ethereum Mainnet' },
                        polygon: { 
                            chainId: '0x89', 
                            chainName: 'Polygon Mainnet',
                            rpcUrls: ['https://polygon-rpc.com/'],
                            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
                        },
                        bsc: { 
                            chainId: '0x38', 
                            chainName: 'BNB Smart Chain',
                            rpcUrls: ['https://bsc-dataseed.binance.org/'],
                            nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }
                        },
                        arbitrum: { 
                            chainId: '0xa4b1', 
                            chainName: 'Arbitrum One',
                            rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
                        }
                    };

                    const chainConfig = chainConfigs[chainId];
                    if (chainConfig && chainId !== 'ethereum') {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [chainConfig],
                            });
                        } catch (addError: any) {
                            if (addError.code === 4902) {
                                await window.ethereum.request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [{ chainId: chainConfig.chainId }],
                                });
                            }
                        }
                    } else if (chainId === 'ethereum') {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x1' }],
                        });
                    }

                    const accounts = await window.ethereum.request({
                        method: 'eth_requestAccounts',
                    });

                    toast({
                        title: "Connected!",
                        description: `Successfully connected to ${chainConfig.chainName}`,
                    });
                } else {
                    toast({
                        title: "MetaMask not found",
                        description: "Please install MetaMask to connect to EVM chains",
                        variant: "destructive"
                    });
                }
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error connecting to chain:", error);
            toast({
                title: "Connection failed",
                description: "Failed to connect to the selected chain",
                variant: "destructive"
            });
        } finally {
            setIsConnecting(false);
        }
    };

    // Handle disconnecting the wallet
    const handleDisconnectWallet = async () => {
        try {
            await disconnect();
        } catch (error) {
            console.error("Error disconnecting wallet:", error);
        }
    };

    return (
        <>
            <div className="">
                {wallet.status != WalletStatus.Connected ? (
                    <Button
                        variant="ghost"
                        className={cn("px-4 py-2 h-max text-black rounded-xl bg-white hover:bg-white hover:text-black", className)}
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Connect"
                    >
                        <div className="text-sm font-bold flex items-center">
                            {wallet.status == WalletStatus.Connecting || isConnecting ? (
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        stroke="black"
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
                                            fill="black"
                                            d="M4 12a8 8 0 018-8V0C6.373 0 0 6.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Connecting
                                </div>
                            ) : (
                                <span>Connect Wallet</span>
                            )}
                        </div>
                    </Button>
                ) : (
                    <div className="flex items-center gap-x-3">
                        <Button
                            className="px-5 py-2 h-max font-black text-black rounded-xl bg-white hover:bg-white hover:text-black"
                            onClick={handleDisconnectWallet}
                            aria-label={address}
                        >
                            <span className="text-sm md:!text-2xl font-black">{formatAddress(address)}</span>
                        </Button>
                        <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                            <Link href={`/p/${address}`} >
                                <img 
                                    hidden={!showProfile} 
                                    src={user?.user_image_url ?? DEFAULT_IMAGE_PROFILE} 
                                    onError={(e: any) => {
                                        e.target.src = DEFAULT_IMAGE_PROFILE;
                                    }} 
                                    className="w-[50px] h-[50px] rounded-full hover:scale-105" 
                                />
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <WalletConnectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                loading={isConnecting}
                onConnectWallet={handleConnectChain}
            />
        </>
    )
}