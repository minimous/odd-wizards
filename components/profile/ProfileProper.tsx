"use client";
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Button } from '../ui/button';
import { ArrowUpRight } from 'lucide-react';
import { Token } from '@/types';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useChain } from '@cosmos-kit/react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { promiseToast, useToast } from "@/components/ui/use-toast";
import { useUser } from '@/hooks/useUser';
import { Dot } from "lucide-react";

type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

interface PopoverProps {
    address: string
    token: Token
    position?: PopoverPosition;
    className?: string;
}

interface PositionStyles {
    top?: string | 'auto';
    bottom?: string;
    left?: string;
    right?: string;
    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
}

const PoperProfile = ({
    address,
    token,
    position = 'bottom',
    className = ''
}: PopoverProps): JSX.Element => {
    const { isWalletConnected } = useChain("stargaze");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();
    const { setUser } = useUser();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getPopoverPosition = (): PositionStyles => {
        if (!triggerRef.current || !isOpen) return {};

        const positions: Record<PopoverPosition, PositionStyles> = {
            top: {
                top: 'auto',
                bottom: '100%',
                marginBottom: '2px'
            },
            bottom: {
                top: '12px',
                right: '0',
                marginTop: '12px'
            },
            left: {
                right: '100%',
                marginRight: '2px'
            },
            right: {
                left: '100%',
                marginLeft: '2px'
            }
        };

        return positions[position] || positions.bottom;
    };

    const setPfp = async () => {
        try {
            promiseToast(axios.post(`/api/user/update-pfp/${address}`, {
                token
            }), {
                loading: {
                    title: "Processing...",
                    description: "Please Wait"
                },
                success: (result) => {

                    setUser(result.data.data);

                    return {
                        title: "Success!",
                        description: "Update Pfp Successfully"
                    };
                },
                error: (error: AxiosError | any) => ({
                    title: "Ups! Something wrong.",
                    description: error?.response?.data?.message || 'Internal server error.'
                })
            });
        } catch (error: AxiosResponse | any) {
            console.log("error", error);
        }
    }

    return (
        <div className={`relative inline-block ${className}`}>
            <div
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer"
            >
                <Button
                    variant={"ghost"}
                    className="p-2 h-[20px] hover:bg-black/20"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}>
                    <Dot size={8} strokeWidth={10} />
                    <Dot size={8} strokeWidth={10} />
                    <Dot size={8} strokeWidth={10} />
                </Button>
            </div>

            {isOpen && (
                <div
                    ref={popoverRef}
                    className="absolute z-50 min-w-[150px] bg-[#171717] border border-[#323237] rounded-lg shadow-lg px-2 py-4"
                    style={{
                        ...getPopoverPosition()
                    }}
                >
                    <div className="grid gap-2">
                        <Link onClick={(e) => {e.stopPropagation()}} className='w-full' href={`https://www.stargaze.zone/m/${token.collection.contractAddress}/${token.tokenId}`} target="_blank" >
                            <Button variant={"ghost"} className="h-[25px] w-full justify-between text-[#A1A1AA] px-2 hover:bg-transparent">
                                <span className='text-xs'>Trade on $STARS</span>
                                <ArrowUpRight strokeWidth={1.25} />
                            </Button>
                        </Link>
                        {
                            isWalletConnected && session?.user?.name == address && <Button onClick={(e) => {
                                e.stopPropagation();
                                setPfp()
                                }} variant={"ghost"} className="h-[25px] text-[#A1A1AA] justify-start px-2 hover:bg-transparent">
                                <span className='text-xs'>Set as PFP</span>
                            </Button>
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default PoperProfile;