"use client"
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from "react";
import Snowfall from 'react-snowfall';
import CustomGradualSpacing from "@/components/CustomGradouselSpacing";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { cn, formatAddress, formatDecimal } from "@/lib/utils";
import Link from "next/link";
import getConfig from "@/config/config";
import { useUser } from "@/hooks/useUser";
import RaffleCard from "@/components/raffle/RaffleCard";
import axios, { AxiosError } from "axios";
import NumberTicker from "@/components/ui/number-ticker";
import { Raffle } from "@/types/raflles";
import Loading from "@/components/Loading";
import { useChain } from "@cosmos-kit/react";
import Particles from "@/components/ui/particles";

export default function Stake() {
    const config = getConfig();
    const { user, staker } = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [raffles, setRaffles] = useState<Raffle[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const { address } = useChain("stargaze");
    const LIMIT = 8;

    const fetchRaffles = async (pageNum: number, append: boolean = false) => {
        try {
            const resp = await axios.get(`/api/raffle/list?page=${pageNum}&limit=${LIMIT}`);
            const { data, pagination } = resp.data;

            if (append) {
                setRaffles(prev => [...prev, ...data]);
            } else {
                setRaffles(data);
            }

            setHasMore(pageNum < pagination.totalPages);
            return data;
        } catch (error) {
            console.error('Error fetching raffles:', error);
            return [];
        }
    };

    const loadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        await fetchRaffles(nextPage, true);
        setPage(nextPage);
        setLoadingMore(false);
    };

    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            await fetchRaffles(1);
            setLoading(false);
        }
        fetchInitialData();
    }, [user]);

    return (
        <div className="relative bg-black w-full md:px-10">
            <Header />
            <div>
                <div className="grid">
                    <div className="px-10 mt-16 px-4 md:!px-16 md:!mt-24 mx-auto py-4 md:!py-6 gap-x-32 text-left grid md:flex justify-between items-center">
                        <div>
                            <div className="flex justify-center">
                                <CustomGradualSpacing
                                    className="font-display text-[36px] md:!text-6xl font-black leading-tight md:!leading-[5rem]"
                                    text="Fortune on your side"
                                />
                            </div>
                            <div className="text-center mx-auto">
                                <p className="text-sm md:!text-xl text-gray-400 leading-tight">Buy as many tickets as possible, and win the draw</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center">
                    <Loading />
                </div>
            ) : (
                <div className="container">
                    {address && user && (
                        <div className="flex justify-center mt-8">
                            <div className="w-full md:!w-[750px]">
                                <div className="grid grid-cols-2 gap-x-4">
                                    <div className="flex bg-[#18181B] border-2 border-[#323237] flex-grow items-center justify-between p-4 px-8 h-[68px] md:h-[105px] w-full rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-[40px] h-[40px] md:w-[70px] md:h-[70px] bg-amber-200 rounded-full flex items-center justify-center">
                                                <Link href={`/p/${user?.user_address}`}>
                                                    <img
                                                        src={user?.user_image_url ?? DEFAULT_IMAGE_PROFILE}
                                                        alt={user?.user_address ?? ""}
                                                        className="rounded-full object-cover w-full h-full"
                                                        onError={(e: any) => {
                                                            e.target.src = DEFAULT_IMAGE_PROFILE;
                                                        }}
                                                    />
                                                </Link>
                                            </div>
                                            <div>
                                                <span className="text-[13px] md:text-[20px] text-white">Address</span>
                                                <Link href={`https://www.stargaze.zone/p/${user?.user_address}`} target="_blank" className="text-center text-[#DB2877]">
                                                    <p className="text-[12px] md:text-[20px] font-bold">
                                                        {formatAddress(user?.user_address)}
                                                    </p>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-[#18181B] border-2 border-[#323237] flex-grow items-center p-4 px-8 gap-6 w-[60px] h-[68px] md:w-[105px] md:h-[105px] md:w-full rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
                                        <div>
                                            <img src="/images/Icon/wzrd.png" className="h-[55px]" alt="WZRD Token" />
                                        </div>
                                        <div className="block">
                                            <span className="text-[12px] md:text-[20px] text-white">Token</span>
                                            <p className="text-[10px] md:text-[20px] font-bold text-white">
                                                {formatDecimal(staker?.staker_total_points ?? 0, 2)} $WZRD
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mt-24 px-10">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
                            {raffles.map((item, index) => (
                                <div className="my-4">
                                    <div key={item.raffle_id} className={cn(((index + 1) % 4 === 2 || (index + 1) % 4 === 3) ? "-mt-12" : "")}>
                                        <RaffleCard data={item} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {hasMore && !loading && (
                        <div className="mt-8 mb-4 text-center">
                            <button
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="px-6 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                {loadingMore ? "Loading..." : "Load More"}
                            </button>
                        </div>
                    )}
                </div>
            )}
            <div className="h-full py-12 md:py-16">
                <Footer className="my-0" />
            </div>
            <Particles
                className="absolute inset-0 z-0"
                quantity={100}
                ease={80}
                color={"#ffffff"}
                refresh
            />
        </div>
    );
}