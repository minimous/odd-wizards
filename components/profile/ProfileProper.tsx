import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Button } from '../ui/button';
import { ArrowUpRight } from 'lucide-react';
import { Token } from '@/types';
import Link from 'next/link';

type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

interface PopoverProps {
    token: Token
    children: ReactNode;
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
    token,
    children,
    position = 'bottom',
    className = ''
}: PopoverProps): JSX.Element => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

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
                top: '2px',
                right: '0',
                marginTop: '2px'
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

    return (
        <div className={`relative inline-block ${className}`}>
            <div
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer"
            >
                {children}
            </div>

            {isOpen && (
                <div
                    ref={popoverRef}
                    className="absolute z-50 min-w-[120px] bg-black border border-[#323237] rounded-lg shadow-lg px-2 py-4"
                    style={{
                        ...getPopoverPosition()
                    }}
                >
                    <div className="grid gap-2">
                        <Link className='w-full' href={`https://www.stargaze.zone/m/${token.collection.contractAddress}/${token.tokenId}`} target="_blank" >
                            <Button variant={"ghost"} className="h-[25px] w-full justify-between hover:bg-white/10 px-2">
                                <span className='text-xs'>Trade</span>
                                <ArrowUpRight />
                            </Button>
                        </Link>
                        <Button variant={"ghost"} className="h-[25px] justify-start hover:bg-white/10 px-2">
                            <span className='text-xs'>Set as PFP</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PoperProfile;