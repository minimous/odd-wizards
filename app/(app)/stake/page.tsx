"use client"
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import CarouselStake from "@/components/CarouselStake";
import StakeCard from "@/components/StakeCard";
import { BoxLeaderboard } from "@/components/BoxLaederboard";
import Leaderboard from "@/components/Leaderboard";
import Particles from "@/components/ui/particles";
import CustomGradualSpacing from "@/components/CustomGradouselSpacing";
import { useState } from "react";

const imageList = [
    { src: "/images/Prize/BytePets 12th.jpg", alt: "Image 1" },
    { src: "/images/Prize/Celothiraptop 5th.jpg", alt: "Image 2" },
    { src: "/images/Prize/Digitz 4th.jpg", alt: "Image 3" },
    { src: "/images/Prize/Drama Queens 2nd.jpg", alt: "Image 4" },
    { src: "/images/Prize/Elysian Horde 3rd.jpg", alt: "Image 5" },
    { src: "/images/Prize/Expedition 1st.jpg", alt: "Image 6" },
    { src: "/images/Prize/Pixel Plebs 8th.jpg", alt: "Image 7" },
    { src: "/images/Prize/RarityBotz 7th.jpg", alt: "Image 8" },
    { src: "/images/Prize/Rebbits 6th.jpg", alt: "Image 9" },
    { src: "/images/Prize/Stamp 11th.jpg", alt: "Image 10" },
    { src: "/images/Prize/Steamland 10th.jpg", alt: "Image 11" },
    { src: "/images/Prize/The Watchers 9th.jpg", alt: "Image 12" },
];

export default function Stake() {

    const [color, setColor] = useState("#ffffff");

    return (
        <div className="relative bg-black w-full">
            <Header />
            <div>
                <div className="grid">
                    <div className="px-10 mt-20 md:!px-20 md:!mt-32 mx-auto py-6 text-center">
                        <CustomGradualSpacing
                            className="font-display text-center text-4xl md:!text-6xl font-black tracking-tighter md:leading-[5rem] text-transparent bg-clip-text bg-gradient-to-b from-gray-400 to-white"
                            text="Stake, Win, and LFGODDS!"
                        />
                        {/* <h1 className="text-4xl text-white font-black">Stake, Win, and LFGODDS!</h1> */}
                        <div className="mt-6">
                            <p className="text-xl text-gray-400 leading-tight">Discover the ultimate NFT staking challenge!</p>
                            <p className="text-xl text-gray-400 leading-tight">Joing to complete, stack the most NFTs, and wind prizes</p>
                            {/* <p className="text-lg text-gray-400 leading-tight"></p> */}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col-reverse md:!flex-row mt-8">
                    <div className="relative mx-4 md:!ml-20 max-h-max">
                        <StakeCard />
                    </div>
                    <div className="mx-auto relative w-[350px]">
                        <CarouselStake images={imageList} interval={7500} />
                    </div>
                </div>
            </div>
            <div className="my-4">
                <BoxLeaderboard />
            </div>
            <div className="pt-20 bg-cover bg-center">
                <Leaderboard />
            </div>
            <div className="bg-[url('/images/bg-line-grid.png')] bg-cover bg-center h-full py-16">
                <Footer className="my-0" />
            </div>
            <Particles
                className="absolute inset-0 z-0"
                quantity={100}
                ease={80}
                color={color}
                refresh
            />
        </div >
    );
}
