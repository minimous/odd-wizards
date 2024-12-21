"use client";
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { useUser } from "@/hooks/useUser";
import { useChain } from "@cosmos-kit/react";
import { formatAddress } from "@/lib/utils";
import NFTGallery from "@/components/profile/NFTGallery";
import { useEffect } from "react";

export default function Profile({params}: { params: { address: string} }) {
    const { user } = useUser();
    const { address } = useChain("stargaze"); // Use the 'stargaze' chain from your Cosmos setup

    useEffect(() => {

        async function fetchData() {

        }

        fetchData();
    
    }, []);

    return (
        <div className="relative w-full h-screen bg-[url('/images/Account.gif')] bg-cover bg-center">
            <Header />
            <div className="realative h-screen flex items-end pb-4">
                <div className="absolute z-10 left-4 md:left-24 bottom-5">
                    <div className="flex gap-x-6 items-center">
                        <div className="shrink-0">
                            <img src={user?.user_image_url ?? DEFAULT_IMAGE_PROFILE} onError={(e: any) => {
                                e.target.src = DEFAULT_IMAGE_PROFILE;
                            }} className="w-[125px] h-[125px] rounded-full" />
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <span className="text-sm md:!text-3xl font-black">{formatAddress(params.address)}</span>
                            <div className="flex items-center gap-x-4">
                                <img src="/images/discord.png" className="w-[30px] md:w-[40px]" />
                                <img src="/images/x.png" className="w-[30px] md:w-[40px]" />
                            </div>
                            <span className="md:!text-md text-gray-400 hover:text-white">Edit Profile</span>
                        </div>
                    </div>
                    <div className="mt-8 px-2">
                        <span className="text-gray-400">Token</span>
                        <div className="mt-1 flex items-center gap-x-4">
                            <div className="p-4 bg-[#18181B] border border-[#323237] rounded-2xl font-bold max-w-max flex items-center gap-x-4">
                                <img src="/images/Icon/wzrd.png" className="w-6 h-6" />
                                <span>22 NFTs/2.1K $WZRD</span>
                            </div>
                            <div className="p-4 bg-[#18181B] border border-[#323237] rounded-2xl font-bold w-[200px] flex items-center gap-x-4 blur-[1.5px]">
                                <img src="/images/Icon/wzrd.png" className="w-6 h-6" />
                                <span>Soon..</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute left-0 bottom-0 z-1 w-full h-[350px] bg-gradient-to-b from-transparent to-black" />
            </div>
            <div>
                <NFTGallery address={params.address} />
            </div>
            <div className="bg-[url('/images/bg-line-grid.png')] bg-cover bg-center py-8">
                <Footer className="my-0" />
            </div>
        </div>
    );
}
