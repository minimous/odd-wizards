'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '../ui/separator';
import { formatAddress } from '@/lib/utils';
import { Copy } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import Link from 'next/link';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
}

export default function InfoModal({
    isOpen,
    onClose,
    loading
}: AlertModalProps) {

    const { toast } = useToast();

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);

            toast({
                title: 'Success',
                variant: 'default',
                description: 'Image has been copied to clipboard'
            });
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Failed to copy image to clipboard'
            });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95%] md:!max-w-xl rounded-xl bg-black">
                {/* <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader> */}
                <div className="w-full bg-black text-white">
                    <span className='font-bold text-xl'>Odds Wizard</span>
                    <p className='text-gray-400'>ODDS is a mystical garden where the most peculiar beings gather and play within the Cosmos. Starting with the Odds Wizard, the first entity to step into the ODDS, paving the way for an ever-growing collection of oddities, waiting to be discovered.</p>
                    <Separator className="my-4" />
                    <div className='flex justify-between my-2 text-gray-400'>
                        <span>Contract Address:</span>
                        <div className='flex gap-x-1 items-center'>
                            <span>{formatAddress("stars1vjxr6hlkjkh0z5u9cnktftdqe8trhu4agcc0p7my4pejfffdsl5sd442c7")}</span>
                            <span onClick={() => { handleCopy("stars1vjxr6hlkjkh0z5u9cnktftdqe8trhu4agcc0p7my4pejfffdsl5sd442c7")}} className='cursor-pointer'><Copy size={16} /></span>
                        </div>
                    </div>
                    <div className='flex justify-between my-2 text-gray-400'>
                        <span>Creator:</span>
                        <div className='flex gap-x-1 items-center'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href={"https://www.stargaze.zone/p/artnesh/tokens"} target='_blank'>
                                            <span className='cursor-pointer text-green-500'>artnesh</span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className='bg-black border border-[#323237]'>
                                        <p>{formatAddress("stars130tcpz6l0j9f382prlj67r29jmr25cgpacmd7r")}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                    <div className='flex justify-between my-2 text-gray-400'>
                        <span>Created:</span>
                        <span>December 15, 2024 10:07 AM</span>
                    </div>
                    <div className='flex justify-between my-2 text-gray-400'>
                        <span>Home chain:</span>
                        <span>Stargaze</span>
                    </div>
                    <div className='flex justify-between my-2 text-gray-400'>
                        <span>Royalties:</span>
                        <span>5%</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
