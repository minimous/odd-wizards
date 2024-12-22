"use client";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { useUser } from "@/hooks/useUser";
import { useChain } from "@cosmos-kit/react";
import { formatAddress, formatDecimal } from "@/lib/utils";
import NFTGallery from "@/components/profile/NFTGallery";
import { useEffect, useState } from "react";
import axios from "axios";
import getConfig from "@/config/config";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";

export default function Profile({ params }: { params: { address: string } }) {
    const config = getConfig();
    const { user } = useUser();
    const { address } = useChain("stargaze"); // Use the 'stargaze' chain from your Cosmos setup
    const [staker, setStaker] = useState<any>();
    const [associated, setAssociated] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        async function fetchData() {
            setLoading(true);
            let resp = await axios.get(`/api/user/${params.address}?collection_address=${config?.collection_address}`);
            const data = resp.data.data;
            setStaker(data);
            setAssociated(data.associated.names.length > 0 ? data.associated.names[0] : undefined);
            setLoading(false);
        }

        fetchData();

    }, []);

    const renderSocmed = (item: any) => {

        if (!item) return;

        switch (item.name) {
            // case "discord":
            //     return (
            //         <Link href={`https://discord.com/channels/${item.value}`} target='_blank'>
            //             <img src="/images/discord.png" className="w-[30px] md:w-[40px]" />
            //         </Link>
            //     );
            case "twitter":
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={`https://x.com/${item.value}`} target='_blank'>
                                    <img src="/images/x.png" className="w-[30px] md:w-[40px] hover:scale-105 transition-all duration-300 ease-in-out" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent className='bg-black border border-[#323237] text-xs md:!text-base'>
                                <p>Go to X Account</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                )
        }
    }

    return (
        <div className="relative w-full h-screen bg-[url('/images/Account.gif')] bg-cover bg-center">
            <Header />
            <div className="realative h-screen flex items-end pb-4">
                <div className="absolute z-10 left-4 md:left-24 bottom-5">

                    <div className="flex gap-x-6 items-center">
                        <div className="shrink-0">
                            <img src={user?.user_image_url ?? DEFAULT_IMAGE_PROFILE} onError={(e: any) => {
                                e.target.src = DEFAULT_IMAGE_PROFILE;
                            }} className="w-[100px] h-[100px] md:!w-[125px] md:!h-[125px] rounded-full" />
                        </div>
                        {
                            loading ? <Loading /> : (
                                <div className="flex flex-col gap-y-3">
                                    {
                                        associated?.name ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        {/* <Link href={`https://www.stargaze.zone/p/${params.address}/tokens`} target='_blank'> */}
                                                        <span className='text-xl md:!text-3xl font-black'>{associated.name}</span>
                                                        {/* </Link> */}
                                                    </TooltipTrigger>
                                                    <TooltipContent className='bg-black border border-[#323237] text-xs md:!text-base'>
                                                        <p>{formatAddress(params.address)}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            <Link href={`https://www.stargaze.zone/p/${params.address}/tokens`} target='_blank'>
                                                <span className="text-sm md:!text-3xl font-black">{formatAddress(params.address)}</span>
                                            </Link>
                                        )
                                    }
                                    <div className="flex items-center gap-x-3">
                                        {
                                            associated?.records?.map((item: any) => {
                                                return renderSocmed(item);
                                            })
                                        }
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={`https://www.stargaze.zone/p/${params.address}/tokens`} target='_blank'>
                                                        <img src="/images/Icon/stargaze-white.png" className="w-[30px] md:w-[40px] hover:scale-105 transition-all duration-300 ease-in-out" />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent className='bg-black border border-[#323237] text-xs md:!text-base'>
                                                    <p>Go to Stargaze Account</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="">
                                                        <img src="/images/Icon/forward-arrow.png" className="w-[30px] md:w-[40px] hover:scale-105 transition-all duration-300 ease-in-out" />
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent className='bg-black border border-[#323237] text-xs md:!text-base'>
                                                    <p>Share Your Account</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    {/* <span className="md:!text-md text-gray-400 hover:text-white">Edit Profile</span> */}
                                </div>
                            )
                        }
                    </div>

                    <div className="mt-8 px-2">
                        <span className="text-gray-400">Token</span>
                        {
                            loading ? <Loading /> : (
                                <div className="mt-1 flex items-center gap-x-4">
                                    <div className="p-4 bg-[#18181B] border border-[#323237] rounded-2xl font-bold max-w-max flex items-center gap-x-4">
                                        <img src="/images/Icon/wzrd.png" className="w-6 h-6" />
                                        <span className="text-[13px] md:text-base">{staker?.staker?.staker_nft_staked ?? 0} NFTs/{formatDecimal(staker?.staker?.staker_total_points ?? 0)} $WZRD</span>
                                    </div>
                                    <div className="p-4 bg-[#18181B] border border-[#323237] rounded-2xl font-bold w-[200px] flex items-center gap-x-4 blur-[1.5px]">
                                        <img src="/images/Icon/wzrd.png" className="w-6 h-6" />
                                        <span>Soon..</span>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="absolute left-0 bottom-0 z-1 w-full h-[350px] bg-gradient-to-b from-transparent to-black" />
            </div >
            <div>
                <NFTGallery address={params.address} />
            </div>
            <div className="bg-[url('/images/bg-line-grid.png')] bg-cover bg-center py-8">
                <Footer className="my-0" />
            </div>
        </div >
    );
}
