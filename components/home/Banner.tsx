'use client';
import Autoplay from 'embla-carousel-autoplay';
import { EmblaOptionsType } from 'embla-carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import Image from 'next/image';
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn, formatAmount } from '@/lib/utils';
import { BannerWithLaunchpad } from '@/types/launchpad';
import { useSyncedWallet } from '@/providers/wallet-provider-wrapper';
import { NETWORK_CONSTANT } from '@/constants';

type BannerProps = {
  items: BannerWithLaunchpad[];
};

const Banner = ({ items }: BannerProps) => {
  const OPTIONS: EmblaOptionsType = { loop: true };
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const [isLiveTrading, setIsLiveTrading] = useState<boolean>(false);
  const [selectedBanner, setSelectedBanner] = useState<number>(
    items[0]?.banner_id
  );
  const [api, setApi] = useState<any>(null);
  const { isConnected, address } = useSyncedWallet();

  const formatTime = (difference: number) => {
    if (difference <= 0) return '';

    // Calculate time units
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
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

  // Get the appropriate minter based on network
  const getMinter = (banner: BannerWithLaunchpad) => {
    if (!banner.launchpad) return null;

    // For Stargaze, use minterV2; for Intergaze, use minter
    if (banner.banner_network?.toLowerCase() === NETWORK_CONSTANT.STARGAZE) {
      return banner.launchpad.minterV2;
    } else if (
      banner.banner_network?.toLowerCase() === NETWORK_CONSTANT.INTERGAZE
    ) {
      return banner.launchpad.minter;
    } else if (
      banner.banner_network?.toLowerCase() ===
      NETWORK_CONSTANT.MEGAETH.toLocaleLowerCase()
    ) {
      return banner.launchpad.minter;
    }

    return null;
  };

  // Get launchpad URL based on network
  const getLaunchpadUrl = (banner: BannerWithLaunchpad) => {
    if (!banner.launchpad) return '#';

    if (banner.banner_network?.toLowerCase() === NETWORK_CONSTANT.STARGAZE) {
      return `https://www.stargaze.zone/l/${
        banner.launchpad.contractUri ?? banner.launchpad.contractAddress
      }`;
    } else if (
      banner.banner_network?.toLowerCase() === NETWORK_CONSTANT.INTERGAZE
    ) {
      return `https://intergaze.xyz/l/${banner.launchpad.contractAddress}`;
    } else if (
      banner.banner_network?.toLowerCase() ===
      NETWORK_CONSTANT.MEGAETH.toLocaleLowerCase()
    ) {
      return `https://rarible.fun/collections/megaethtestnet/${banner.launchpad.contractAddress}/drops`;
    }

    return '#';
  };

  // Get trading URL based on network
  const getTradingUrl = (banner: BannerWithLaunchpad) => {
    if (!banner.launchpad) return '#';

    if (banner.banner_network?.toLowerCase() === NETWORK_CONSTANT.STARGAZE) {
      return `https://www.stargaze.zone/m/${
        banner.launchpad.contractUri ?? banner.launchpad.contractAddress
      }/tokens`;
    } else if (
      banner.banner_network?.toLowerCase() === NETWORK_CONSTANT.INTERGAZE
    ) {
      return `https://intergaze.xyz/m/${banner.launchpad.contractAddress}`;
    } else if (
      banner.banner_network?.toLowerCase() ===
      NETWORK_CONSTANT.MEGAETH.toLocaleLowerCase()
    ) {
      return `https://rarible.fun/collections/megaethtestnet/${banner.launchpad.contractAddress}`;
    }

    return '#';
  };

  // Callback untuk handle slide change - ini akan dipanggil baik manual maupun autoplay
  const onSlideChange = useCallback(
    (emblaApi: any) => {
      if (emblaApi) {
        const currentIndex = emblaApi.selectedScrollSnap();
        setSelectedBanner(items[currentIndex]?.banner_id);
      }
    },
    [items]
  );

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
        const minter = getMinter(banner);

        // Handle banner_minted_date countdown
        if (banner.banner_minted_date) {
          const mintedDate = new Date(banner.banner_minted_date).getTime();
          if (now < mintedDate) {
            const difference = mintedDate - now;
            newTimeLeft[`mint_${banner.id}`] = formatTime(difference);
          }
        }

        if (!banner.launchpad || !minter) return;

        const currentStage = minter.currentStage;

        // Check if trading has started
        const tradingStart =
          new Date(banner.launchpad.startTradingTime).getTime() / 1000;
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
          const startTime = new Date(currentStage.startTime).getTime();
          const endTime = new Date(currentStage.endTime).getTime();

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
      timers.forEach((timer) => clearInterval(timer));
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

  const showCurrentStage = (banner: BannerWithLaunchpad) => {
    const minter = getMinter(banner);

    if (!banner.launchpad || !minter) return '';

    const stageName = minter.currentStage?.name;
    const now = new Date().getTime();
    const startTime = minter.currentStage?.startTime
      ? new Date(minter.currentStage.startTime).getTime()
      : new Date().getTime();
    const endTime = minter.currentStage?.endTime
      ? new Date(minter.currentStage.endTime).getTime()
      : new Date().getTime();

    // Check if trading has started for this specific launchpad
    const tradingStart =
      new Date(banner.launchpad.startTradingTime).getTime() / 1000;
    const isTradingStarted = now >= tradingStart;

    if (isTradingStarted) {
      return (
        <span className="font-bold opacity-70 md:text-lg">
          {banner?.launchpad.minter?.numTokens} Sold Out
        </span>
      );
    } else if (!minter.currentStage?.endTime) {
      return (
        <span className="text-lg font-bold opacity-70">
          Trading starts
          <span className="text-[#49ED4A]">
            {timeLeft[banner.id] ? ` in ${timeLeft[banner.id]}` : ' soon'}
          </span>
        </span>
      );
    } else if (now < startTime) {
      return (
        <span className="text-lg font-bold opacity-70">
          {stageName} Start
          <span className="text-[#49ED4A]">
            {timeLeft[banner.id] ? ` in ${timeLeft[banner.id]}` : ' soon'}
          </span>
        </span>
      );
    } else if (now > endTime) {
      return (
        <span className="text-lg font-bold opacity-70">
          Next stage starting soon
        </span>
      );
    } else {
      return (
        <span className="text-lg font-bold opacity-70">
          {stageName} phase Ends
          <span className="text-[#49ED4A]">
            {timeLeft[banner.id] ? ` in ${timeLeft[banner.id]}` : ' soon'}
          </span>
        </span>
      );
    }
  };

  const renderMedia = (banner: BannerWithLaunchpad) => {
    const mediaUrl = banner.banner_image ?? '/images/Odds-Garden.png';

    if (banner.banner_type == 'V') {
      return (
        <video
          className="h-full w-full object-cover transition-all duration-300 ease-in-out hover:scale-[102%] md:rounded-[30px]"
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
        className="transition-all duration-300 ease-in-out hover:scale-[102%] md:rounded-[30px]"
      />
    );
  };

  const renderActionButton = (banner: BannerWithLaunchpad) => {
    const minter = getMinter(banner);

    // Check if this banner has launchpad data
    if (banner.launchpad && minter) {
      const now = new Date().getTime();
      const tradingStart =
        new Date(banner.launchpad.startTradingTime).getTime() / 1000;
      const isTradingStarted = now >= tradingStart;

      if (isTradingStarted) {
        return (
          <Link href={getTradingUrl(banner)} target="_blank">
            <Button className="h-10 rounded-[10px] bg-white px-8 font-black text-black hover:bg-white md:h-12 md:text-lg">
              View Collection
            </Button>
          </Link>
        );
      } else {
        return (
          <div className="flex items-center gap-4">
            <Link href={getLaunchpadUrl(banner)} target="_blank">
              <Button className="h-10 rounded-[10px] bg-white px-8 font-black text-black hover:bg-white md:h-12 md:text-lg">
                Go to Launchpad
              </Button>
            </Link>
            <div className="flex items-center gap-2 opacity-70">
              <span>{banner?.launchpad.minter?.mintedTokens} Minted</span>
            </div>
          </div>
        );
      }
    }

    // Handle banners without launchpad data
    if (banner.banner_minted_date) {
      const now = new Date().getTime();
      const mintedDate = new Date(banner.banner_minted_date).getTime();

      if (now < mintedDate) {
        // Show countdown for mint date
        return (
          <div className="my-2">
            <span className="text-lg font-bold opacity-70">
              Mint starts
              <span className="text-[#49ED4A]">
                {timeLeft[`mint_${banner.id}`]
                  ? ` in ${timeLeft[`mint_${banner.id}`]}`
                  : ' soon'}
              </span>
            </span>
          </div>
        );
      } else if (banner.banner_minted_link) {
        // Mint date has passed and link is available
        return (
          <Link href={banner.banner_minted_link} target="_blank">
            <Button className="h-10 rounded-[10px] bg-white px-8 font-black text-black hover:bg-white md:h-12 md:text-lg">
              Go to Launchpad
            </Button>
          </Link>
        );
      }
    }

    // Fallback for banners without specific mint date or link
    if (banner.banner_minted_link) {
      return (
        <Link href={banner.banner_minted_link} target="_blank">
          <Button className="h-10 rounded-[10px] bg-white px-8 font-black text-black hover:bg-white md:h-12 md:text-lg">
            Go to Launchpad
          </Button>
        </Link>
      );
    }

    return (
      <Button className="h-10 rounded-[10px] bg-white px-8 font-black text-black hover:bg-white md:h-12 md:text-lg">
        Mint Soon
      </Button>
    );
  };

  return (
    <div>
      <div className="relative h-[calc(35vh)] md:h-[calc(50vh)]">
        <div className="h-1/2 w-full bg-[url('/images/blur.gif')] bg-cover bg-center opacity-50"></div>
        <div className="pointer-events-none absolute inset-0 bg-black/70 backdrop-blur-xl"></div>
        <div className="z-1 absolute bottom-0 left-0 hidden h-[100px] w-full bg-gradient-to-b from-transparent to-black md:!block" />
        <div className="absolute left-0 right-0 top-0 md:px-8 md:py-4">
          <Carousel
            setApi={setApi}
            opts={OPTIONS}
            plugins={[plugin.current]}
            className="h-full w-full md:rounded-[30px]"
          >
            <CarouselContent className="-ml-2 h-full w-full md:rounded-[30px]">
              {items?.map((banner, index) => (
                <CarouselItem
                  key={banner.id}
                  className="pl-2 md:rounded-[30px]"
                >
                  <div className="relative h-[calc(35vh)] md:h-[calc(50vh)]">
                    <div className="h-full w-full md:rounded-[30px]">
                      <div className="relative h-full w-full overflow-hidden md:rounded-[30px] md:border md:border-[#2D253E]">
                        {renderMedia(banner)}
                        <div className="z-5 via-black-75 md:pb-18 absolute bottom-0 left-0 top-0 flex w-full flex-col justify-end bg-black/30 p-6 pb-4 pl-8 md:bg-gradient-to-b md:from-transparent md:to-black md:p-10 md:pl-16">
                          <div className="flex items-end gap-2">
                            <Link
                              hidden={!banner.banner_twiter}
                              href={banner.banner_twiter ?? '#'}
                              target="_blank"
                            >
                              <img
                                src="/images/x.png"
                                className="h-[20px] md:h-[35px]"
                              />
                            </Link>
                            <Link
                              hidden={!banner.banner_discord}
                              href={banner.banner_discord ?? ''}
                              target="_blank"
                            >
                              <img
                                src="/images/discord.png"
                                className="h-[20px] md:h-[35px]"
                              />
                            </Link>
                          </div>
                          <div className="grid items-end justify-between gap-y-2 md:flex">
                            <div>
                              <div>
                                <div className="mt-4 flex items-center gap-3">
                                  <div
                                    className={cn(
                                      'blinker flex h-6 w-6 items-center justify-center rounded-full bg-green-500/50'
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        'h-4 w-4 rounded-full bg-green-500'
                                      )}
                                    />
                                  </div>
                                  <h1 className="text-xl font-black text-white md:text-2xl">
                                    {banner?.banner_title}
                                  </h1>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-green-500 md:text-base">
                                    By {banner?.banner_creator} on{' '}
                                    {banner?.banner_network}
                                  </span>
                                </div>
                              </div>

                              {/* Show stage info if banner has launchpad */}
                              {banner?.launchpad && getMinter(banner) && (
                                <div className="my-2">
                                  {showCurrentStage(banner)}
                                </div>
                              )}

                              <div className="my-2">
                                {renderActionButton(banner)}
                              </div>
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
          <div className="relative hidden h-full w-full md:!flex">
            <div className="absolute bottom-10 right-12">
              <div className="flex items-end gap-4">
                {items?.map((bannerItem, bannerIndex) => (
                  <div key={bannerIndex}>
                    {bannerItem.banner_id == selectedBanner ? (
                      <button
                        type="button"
                        className="relative h-[120px] w-[120px] rounded-[5px] border-2 border-white/20 p-1 transition-all duration-300"
                      >
                        <svg
                          className="absolute inset-0 translate-x-[-2px] translate-y-[-2px]"
                          width="120"
                          height="120"
                          viewBox="0 0 120 120"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>Slide timer</title>
                          <rect
                            width="118"
                            height="118"
                            x="1"
                            y="1"
                            strokeWidth="2"
                            rx="8"
                            ry="8"
                            fill="transparent"
                            stroke="white"
                            strokeDasharray="400%"
                            className="animate-square-stroke-fill"
                            style={{ animationDuration: '5s' }}
                          ></rect>
                        </svg>
                        <div className="relative h-full w-full overflow-hidden rounded">
                          <img
                            alt="banner preview"
                            decoding="async"
                            data-nimg="fill"
                            className="absoulte h-full w-full object-cover"
                            src={
                              bannerItem.banner_thumbnail ??
                              bannerItem.banner_image
                            }
                            style={{ inset: '0px', color: 'transparent' }}
                          ></img>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleBannerClick(bannerItem, bannerIndex)
                        }
                        className="relative h-16 w-16 rounded-[5px] opacity-60 transition-all duration-300 hover:opacity-100"
                      >
                        <img
                          alt="banner preview"
                          decoding="async"
                          data-nimg="fill"
                          className="absoulte h-full w-full rounded-[5px] object-cover"
                          src={
                            bannerItem.banner_thumbnail ??
                            bannerItem.banner_image
                          }
                          style={{ inset: '0px', color: 'transparent' }}
                        ></img>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center pb-6 md:!hidden">
            <div className="flex items-end gap-4">
              {items?.map((bannerItem, bannerIndex) => (
                <div key={bannerIndex}>
                  {bannerItem.banner_id == selectedBanner ? (
                    <button
                      type="button"
                      className="relative -mt-1 h-1 w-12 overflow-hidden rounded-full bg-white/20 transition-all duration-300"
                    >
                      {/* Garis horizontal sebagai indikator animasi */}
                      <div
                        className="animate-horizontal-fill absolute left-0 top-0 h-full bg-white"
                        style={{ animationDuration: '5s' }}
                      ></div>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBannerClick(bannerItem, bannerIndex)}
                      className="h-1 w-12 rounded-full bg-white/40 opacity-60 transition-all duration-300 hover:opacity-100"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
