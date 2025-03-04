'use client';
import Autoplay from "embla-carousel-autoplay";
import { EmblaOptionsType } from "embla-carousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn, formatAmount } from "@/lib/utils";

type BannerProps = {
    items: any[]
}

const Banner = ({ items }: BannerProps) => {
    const OPTIONS: EmblaOptionsType = { loop: true };
    const plugin = React.useRef(Autoplay({ delay: 10000, stopOnInteraction: false }));
    const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
    const [isLiveTrading, setIsLiveTrading] = useState<boolean>(false);

    const formatTime = (difference: number) => {
        if (difference <= 0) return '';

        // Calculate time units
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Build time string
        const timeArray = [];
        if (days > 0) timeArray.push(`${days}d`);
        if (hours > 0) timeArray.push(`${hours}h`);
        if (minutes > 0) timeArray.push(`${minutes}min`);
        if (seconds > 0) timeArray.push(`${seconds}s`);

        return timeArray.join(' ');
    };

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        const updateAllTimers = () => {
            const now = new Date().getTime();
            const newTimeLeft: { [key: string]: string } = {};
            let liveTrading = false;

            items?.forEach((banner) => {
                if (!banner.launchpad) return;

                const launchpad = banner.launchpad;
                const currentStage = launchpad?.minterV2?.currentStage;

                if (!currentStage?.endTime) {
                    // Trading countdown
                    const tradingStart = launchpad.startTradingTime / 1000000;
                    const difference = tradingStart - now;

                    if (difference > 0) {
                        newTimeLeft[banner.id] = formatTime(difference);
                    } else {
                        liveTrading = true; // Trading sudah dimulai
                    }
                } else {
                    // Stage countdown
                    const startTime = new Date(currentStage.startTime / 1000000).getTime();
                    const endTime = new Date(currentStage.endTime / 1000000).getTime();

                    if (now < startTime) {
                        newTimeLeft[banner.id] = formatTime(startTime - now);
                    } else if (now < endTime) {
                        newTimeLeft[banner.id] = formatTime(endTime - now);
                    } else {
                        liveTrading = true; // Jika semua stage sudah selesai, masuk ke live trading
                    }
                }
            });

            setTimeLeft(newTimeLeft);
            setIsLiveTrading(liveTrading); // Update isLiveTrading berdasarkan kondisi terbaru
        };

        // Update immediately and set interval
        updateAllTimers();
        const timer = setInterval(updateAllTimers, 1000);
        timers.push(timer);

        // Cleanup
        return () => {
            timers.forEach(timer => clearInterval(timer));
        };
    }, [items]);

    const showCurrentStage = (launchpad: any) => {
        if (!launchpad) return "";

        const stageName = launchpad?.minterV2?.currentStage?.name;
        const now = new Date().getTime();
        const startTime = new Date(launchpad?.minterV2?.currentStage?.startTime / 1000000).getTime();
        const endTime = launchpad?.minterV2?.currentStage?.endTime ?
            new Date(launchpad?.minterV2?.currentStage?.endTime / 1000000).getTime() :
            new Date().getTime();

        if (!launchpad?.minterV2?.currentStage?.endTime) {
            return (
                <span className="opacity-70 text-lg font-bold">
                    Live Trading on stargaze
                </span>
            );
        } else if (now < startTime) {
            return (
                <span className="opacity-70 text-lg font-bold">
                    {stageName} Start
                    <span className="text-[#49ED4A]">
                        {timeLeft[launchpad.id] ? ` in ${timeLeft[launchpad.id]}` : ' soon'}
                    </span>
                </span>
            );
        } else if (now > endTime) {
            return (
                <span className="opacity-70 text-lg font-bold">
                    Live Trading on stargaze
                </span>
            );
        } else {
            return (
                <span className="opacity-70 text-lg font-bold">
                    {stageName} Ends
                    <span className="text-[#49ED4A]">
                        {timeLeft[launchpad.id] ? ` in ${timeLeft[launchpad.id]}` : ' soon'}
                    </span>
                </span>
            );
        }
    };

    const renderMedia = (banner: any) => {
        const mediaUrl = banner.banner_image ?? "/images/Odds-Garden.png";

        if (banner.banner_type == 'V') {
            return (
                <video
                    className="w-full h-full object-cover rounded-[30px] hover:scale-[102%] transition-all duration-300 ease-in-out"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src={mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        }

        return (
            <Image
                layout="fill"
                objectFit="cover"
                src={mediaUrl}
                alt=""
                className="rounded-[30px] hover:scale-[102%] transition-all duration-300 ease-in-out"
            />
        );
    };

    return (
        <div>
            <div className="relative bg-cover bg-center px-8 md:px-14 pt-24 pb-8"
                style={{
                    // backgroundImage: `url('${banner.banner_image}')`
                    backgroundImage: `url('/images/blur.gif')`
                }}>
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xl pointer-events-none"></div>
                {/* <div className="absolute left-0 top-0 bottom-0 z-1 w-[100px] h-full bg-gradient-to-l from-transparent via-black/50 to-black pointer-events-none" />
                                <div className="absolute right-0 top-0 bottom-0 z-1 w-[100px] h-full bg-gradient-to-r from-transparent via-black/50 to-black pointer-events-none" /> */}
                <div className="absolute left-0 bottom-0 z-1 w-full h-[100px] bg-gradient-to-b from-transparent to-black" />
                <Carousel
                    opts={OPTIONS}
                    plugins={[plugin.current]}
                    className="w-full h-full rounded-[30px]"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                >
                    <CarouselContent className="w-full h-full -ml-2 rounded-[30px]">
                        {items?.map((banner, index) => (
                            <CarouselItem key={banner.id} className="rounded-[30px] pl-2">
                                <div className="relative h-[calc(100vh-100px)]">
                                    <div className="w-full h-full rounded-[30px]">
                                        <div className="relative w-full h-full rounded-[30px] overflow-hidden">
                                            {renderMedia(banner)}
                                            <div className="absolute bottom-0 left-0 z-5 bg-gradient-to-b from-transparent via-black-75 to-black w-full p-10 pb-18 pl-8 md:pl-16">
                                                <div className="flex gap-2">
                                                    <Link hidden={!banner.banner_twiter} href={banner.banner_twiter ?? "#"}>
                                                        <img src="/images/x.png" className="h-[35px]" />
                                                    </Link>
                                                    <Link hidden={!banner.banner_discord} href={banner.banner_discord ?? ""}>
                                                        <img src="/images/discord.png" className="h-[35px]" />
                                                    </Link>
                                                </div>
                                                <div className="grid md:flex justify-between items-center gap-y-2">
                                                    <div hidden={!banner?.launchpad}>
                                                        <div className="flex items-center gap-3 mt-4">
                                                            <div className={cn("w-6 h-6 flex items-center justify-center rounded-full blinker bg-green-500/50")}>
                                                                <div className={cn("w-4 h-4 rounded-full bg-green-500")} />
                                                            </div>
                                                            <h1 className="text-2xl font-black">
                                                                {formatAmount(banner?.launchpad?.minterV2?.mintedTokens ?? 0)} {banner?.launchpad?.name} Minted
                                                            </h1>
                                                        </div>
                                                        {showCurrentStage(banner?.launchpad)}
                                                    </div>
                                                    {
                                                        isLiveTrading ? <Link
                                                            hidden={!banner?.launchpad}
                                                            href={`https://www.stargaze.zone/m/${banner?.launchpad?.contractUri ?? banner?.launchpad?.contractAddress}/tokens`}
                                                            target="_blank"
                                                        >
                                                            <Button className="h-12 px-8 rounded-[10px] text-lg bg-white text-black font-black hover:bg-white">
                                                                Trade on Stargaze
                                                            </Button>
                                                        </Link> :
                                                            <Link
                                                                hidden={!banner?.launchpad}
                                                                href={`https://www.stargaze.zone/l/${banner?.launchpad?.contractUri ?? banner?.launchpad?.contractAddress}`}
                                                                target="_blank"
                                                            >
                                                                <Button className="h-12 px-8 rounded-[10px] text-lg bg-white text-black font-black hover:bg-white">
                                                                    Go to Launchpad
                                                                </Button>
                                                            </Link>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-6 md:-left-12 absolute z-15 bg-transparent bg-opacity-50 border-0 h-5 w-5 md:!h-10 md:!w-10 text-gray-500 hover:text-white hover:bg-black hover:bg-opacity-75" />
                    <CarouselNext className="-right-6 md:-right-12 z-15 bg-transparent bg-opacity-50 border-0 h-5 w-5 md:!h-10 md:!w-10 text-gray-500 hover:white hover:bg-black hover:bg-opacity-75" />
                </Carousel>
            </div>
        </div>
    );
};

export default Banner;