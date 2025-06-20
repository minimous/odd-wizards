'use client';
import Autoplay from "embla-carousel-autoplay";
import { EmblaOptionsType } from "embla-carousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn, formatAmount } from "@/lib/utils";

type BannerProps = {
    items: any[]
}

const Banner = ({ items }: BannerProps) => {
    const OPTIONS: EmblaOptionsType = { loop: true };
    const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
    const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
    const [isLiveTrading, setIsLiveTrading] = useState<boolean>(false);
    const [selectedBanner, setSelectedBanner] = useState<number>(items[0]?.banner_id);
    const [api, setApi] = useState<any>(null);

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

    // Callback untuk handle slide change - ini akan dipanggil baik manual maupun autoplay
    const onSlideChange = useCallback((emblaApi: any) => {
        if (emblaApi) {
            const currentIndex = emblaApi.selectedScrollSnap();
            setSelectedBanner(items[currentIndex]?.banner_id);
        }
    }, [items]);

    // Function untuk handle button click
    const handleBannerClick = (clickedBanner: any, index: number) => {
        if (api) {
            // Scroll ke slide yang dipilih
            api.scrollTo(index);
            // Update selected banner
            setSelectedBanner(clickedBanner.banner_id);
            // Reset autoplay
            plugin.current.reset();
        }
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

                // Check if trading has started
                const tradingStart = launchpad.startTradingTime / 1000000;
                const isTradingStarted = now >= tradingStart;

                // If any banner is in live trading, set the global flag
                if (isTradingStarted) {
                    liveTrading = true;
                }

                if (!currentStage?.endTime || isTradingStarted) {
                    // Trading countdown (only if trading hasn't started yet)
                    if (!isTradingStarted) {
                        const difference = tradingStart - now;
                        if (difference > 0) {
                            newTimeLeft[banner.id] = formatTime(difference);
                        }
                    }
                } else {
                    // Stage countdown
                    const startTime = new Date(currentStage.startTime / 1000000).getTime();
                    const endTime = new Date(currentStage.endTime / 1000000).getTime();

                    if (now < startTime) {
                        newTimeLeft[banner.id] = formatTime(startTime - now);
                    } else if (now < endTime) {
                        newTimeLeft[banner.id] = formatTime(endTime - now);
                    }
                }
            });

            setTimeLeft(newTimeLeft);
            setIsLiveTrading(liveTrading);
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

    // Effect untuk setup carousel API dan event listeners
    useEffect(() => {
        if (api) {
            // Set initial selected banner
            const initialIndex = api.selectedScrollSnap();
            setSelectedBanner(items[initialIndex]?.banner_id);

            // Add event listener untuk slide change (baik manual maupun autoplay)
            api.on('select', onSlideChange);

            // Tambahan: listener untuk autoplay events
            api.on('settle', onSlideChange);

            return () => {
                api.off('select', onSlideChange);
                api.off('settle', onSlideChange);
            };
        }
    }, [api, onSlideChange, items]);

    const showCurrentStage = (launchpad: any) => {
        if (!launchpad) return "";

        const stageName = launchpad?.minterV2?.currentStage?.name;
        const now = new Date().getTime();
        const startTime = new Date(launchpad?.minterV2?.currentStage?.startTime / 1000000).getTime();
        const endTime = launchpad?.minterV2?.currentStage?.endTime ?
            new Date(launchpad?.minterV2?.currentStage?.endTime / 1000000).getTime() :
            new Date().getTime();

        // Check if trading has started for this specific launchpad
        const tradingStart = launchpad.startTradingTime / 1000000;
        const isTradingStarted = now >= tradingStart;

        if (isTradingStarted) {
            return (
                <span className="opacity-70 text-lg font-bold">
                    Live Trading on stargaze
                </span>
            );
        } else if (!launchpad?.minterV2?.currentStage?.endTime) {
            return (
                <span className="opacity-70 text-lg font-bold">
                    Trading starts
                    <span className="text-[#49ED4A]">
                        {timeLeft[launchpad.id] ? ` in ${timeLeft[launchpad.id]}` : ' soon'}
                    </span>
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
                    Next stage starting soon
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
            <div className="relative h-[calc(50vh)]">
                <div className="bg-[url('/images/blur.gif')] bg-center bg-cover w-full h-1/2 opacity-50"></div>
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xl pointer-events-none"></div>
                <div className="absolute left-0 bottom-0 z-1 w-full h-[100px] bg-gradient-to-b from-transparent to-black" />
                <div className="px-8 absolute top-0 left-0 right-0">
                    <Carousel
                        setApi={setApi}
                        opts={OPTIONS}
                        plugins={[plugin.current]}
                        className="w-full h-full rounded-[30px]"
                    >
                        <CarouselContent className="w-full h-full -ml-2 rounded-[30px]">
                            {items?.map((banner, index) => (
                                <CarouselItem key={banner.id} className="rounded-[30px] pl-2">
                                    <div className="relative h-[calc(50vh)] md:h-[calc(50vh)]">
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
                                                    <div className="grid md:flex justify-between items-end gap-y-2">
                                                        <div>
                                                            {
                                                                banner?.launchpad &&
                                                                <div>
                                                                    <div className="flex items-center gap-3 mt-4">
                                                                        <div className={cn("w-6 h-6 flex items-center justify-center rounded-full blinker bg-green-500/50")}>
                                                                            <div className={cn("w-4 h-4 rounded-full bg-green-500")} />
                                                                        </div>
                                                                        <h1 className="text-2xl font-black">
                                                                            {formatAmount(banner?.launchpad?.minterV2?.mintedTokens ?? 0)} {banner?.launchpad?.name} Minted
                                                                        </h1>
                                                                    </div>
                                                                    <div className="my-2">
                                                                        {showCurrentStage(banner?.launchpad)}
                                                                    </div>
                                                                    {
                                                                        (() => {
                                                                            // Check if trading has started for this specific banner
                                                                            const now = new Date().getTime();
                                                                            const tradingStart = banner?.launchpad?.startTradingTime / 1000000;
                                                                            const isTradingStarted = tradingStart && now >= tradingStart;

                                                                            return isTradingStarted ? (
                                                                                <Link
                                                                                    hidden={!banner?.launchpad}
                                                                                    href={`https://www.stargaze.zone/m/${banner?.launchpad?.contractUri ?? banner?.launchpad?.contractAddress}/tokens`}
                                                                                    target="_blank"
                                                                                >
                                                                                    <Button className="h-12 px-8 rounded-[10px] text-lg bg-white text-black font-black hover:bg-white">
                                                                                        Trade on Stargaze
                                                                                    </Button>
                                                                                </Link>
                                                                            ) : (
                                                                                <Link
                                                                                    hidden={!banner?.launchpad}
                                                                                    href={`https://www.stargaze.zone/l/${banner?.launchpad?.contractUri ?? banner?.launchpad?.contractAddress}`}
                                                                                    target="_blank"
                                                                                >
                                                                                    <Button className="h-12 px-8 rounded-[10px] text-lg bg-white text-black font-black hover:bg-white">
                                                                                        Go to Launchpad
                                                                                    </Button>
                                                                                </Link>
                                                                            );
                                                                        })()
                                                                    }
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <div className="hidden md:!flex relative w-full h-full">
                        <div className="absolute bottom-10 right-12">
                            <div className="flex items-end gap-4">
                                {
                                    items?.map((bannerItem, bannerIndex) => (
                                        <div key={bannerIndex}>
                                            {
                                                bannerItem.banner_id == selectedBanner ?
                                                    <button type="button"
                                                        className="relative transition-all duration-300 h-[120px] w-[120px] rounded-[5px] border-2 border-white/20 p-1">
                                                        <svg className="absolute inset-0 translate-x-[-2px] translate-y-[-2px]" width="120" height="120"
                                                            viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                                                            <title>Slide timer</title>
                                                            <rect width="118" height="118" x="1" y="1" strokeWidth="2" rx="8" ry="8" fill="transparent"
                                                                stroke="white" strokeDasharray="400%" className="animate-square-stroke-fill"
                                                                style={{ animationDuration: '5s' }}></rect>
                                                        </svg>
                                                        <div className="relative h-full w-full overflow-hidden rounded">
                                                            <img alt="banner preview" decoding="async"
                                                                data-nimg="fill" className="object-cover absoulte w-full h-full"
                                                                src={bannerItem.banner_image}
                                                                style={{ inset: '0px', color: 'transparent' }}>
                                                            </img>
                                                        </div>
                                                    </button> :
                                                    <button
                                                        onClick={() => handleBannerClick(bannerItem, bannerIndex)}
                                                        className="relative transition-all duration-300 h-16 w-16 rounded-[5px] opacity-60 hover:opacity-100"
                                                    >
                                                        <img alt="banner preview" decoding="async"
                                                            data-nimg="fill" className="object-cover absoulte w-full h-full"
                                                            src={bannerItem.banner_image}
                                                            style={{ inset: '0px', color: 'transparent' }}>
                                                        </img>
                                                    </button>
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;