"use client"
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from "react";
import Snowfall from 'react-snowfall';
import CustomGradualSpacing from "@/components/CustomGradouselSpacing";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { formatAddress, formatDecimal } from "@/lib/utils";
import Link from "next/link";
import getConfig from "@/config/config";
import { useUser } from "@/hooks/useUser";
import RaffleCard from "@/components/raffle/RaffleCard";

export default function Stake() {
    const config = getConfig();
    const { user, staker } = useUser();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

    }, [user]);

    return (
        <div className="relative bg-black w-full">
            <div className="fixed inset-0 pointer-events-none z-[1000]">
                <div className="relative w-full h-full">
                    <Snowfall snowflakeCount={24} speed={[0.5, 1]} wind={[-0.5, 1]} radius={[0.5, 4.5]} />
                </div>
            </div>
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
            <div className="flex justify-center mt-8 px-4">
                <div className="w-full md:!w-[750px]">
                    <div className="grid grid-cols-2 gap-x-4">
                        <div className="flex bg-[#18181B] border-2 border-[#323237] flex-grow items-center justify-between p-4 px-8 h-[68px] md:h-[105px] w-full rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
                            <div className="flex items-center gap-4">
                                <div className="w-[40px] h-[40px] md:w-[70px] md:h-[70px] bg-amber-200 rounded-full flex items-center justify-center">
                                    <Link href={`/p/${user?.user_address}`} >
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
                                        <p className="text-[12px] md:text-[20px] font-bold ">
                                            {formatAddress(user?.user_address)}
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="flex bg-[#18181B] border-2 border-[#323237] flex-grow items-center p-4 px-8 gap-6 w-[60px] h-[68px] md:w-[105px] md:h-[105px] md:w-full rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
                            <div>
                                <img src="/images/Icon/wzrd.png" className="h-[55px]" />
                            </div>
                            <div className="block">
                                <span className="text-[12px] md:text-[20px] text-white">Token</span>
                                <p className="text-[10px] md:text-[20px] font-bold text-white">{formatDecimal(staker?.staker_total_points, 2)} $WZRD</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-24 px-6">
                <div className="grid grid-cols-4 gap-10">
                    <div>
                        <RaffleCard />
                    </div>
                    <div className="-mt-12">
                        <RaffleCard />
                    </div>
                    <div className="-mt-12">
                        <RaffleCard />
                    </div>
                    <div>
                        <RaffleCard />
                    </div>
                </div>
            </div>
            <div className="h-full py-12 md:py-16">
                <Footer className="my-0" />
            </div>
        </div >
    );
}
