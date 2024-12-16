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
    { src: "https://i.stargaze-apis.com/pZa0xBOtYOrxbFADavj6t8T8MVRUkeSDo9OvfpvDRXc/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeifpduio7sv3cy3ok76j3ldvrwan6owqv5uvrkk5xhuiuvhuy5eupe/558.jpg", alt: "German Shepherd #558", name: "Expedition" },
    { src: "https://i.stargaze-apis.com/dIbflJ7mIjUVCe3t0p-XzDsaaROmvetFM_20Q6DNUmc/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeibhs2db2hthmlnwfvbuduvorybvazltxdmir5w4zoidhzfrbmyvom/885.png", alt: "Drama Queens #885", name: "Drama Queens" },
    { src: "https://i.stargaze-apis.com/gc2RJCII4OxW2eu7W8OulJKJslninJnVrE0LPWK5zjw/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeihl5m3fuioq347gcry7v6zfvriioqwjjl5q7y74cecj6zvsmn65ci/4424.png", alt: "Elysian Horde #4424", name: "Elysian Horde" },
    { src: "https://i.stargaze-apis.com/YmIq6v-GqHokiewtXL0sGrcgf35jzRLjTH6rU0ANrrY/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeihdqphkd5t3max6flguoclbanvuxmt5krae5ga3u7zwxajzrlfocq/1619.png", alt: "Digitz #1619", name: "Digitz" },
    { src: "https://i.stargaze-apis.com/QXMxL1PKl2iQGXz_PdwoF91nxE4QxQm3_gW24MyYdd4/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeigw4vpt3hgdqljtcwglxxb3cwojt24rxnx77cii5wueubsi73temq/32.png", alt: "Pixel Plebs #32", name: "Pixel Plebs" },
    { src: "https://i.stargaze-apis.com/aRID07xNUwrVpu6-neWOk8oFPcMEy0VteVJR2afEiLw/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeidfqzk3dw35shideegsoa6pbkrnfl2gljmvlqpxo73of77ohjyqwq/35.png", alt: "Rebbits #35", name: "Rebbits" },
    { src: "https://i.stargaze-apis.com/AEXkz10rYjBog11DNW3wL3KyPSTUlmlRga_NgtsuK3E/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeidfqzk3dw35shideegsoa6pbkrnfl2gljmvlqpxo73of77ohjyqwq/657.png", alt: "Rebbits #657", name: "Rebbits" },
    { src: "https://i.stargaze-apis.com/447rBZJ_KvWddvqaLSd8O1ZoqS_CuJmPbQvJD427hQk/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeidgd7uu236aicaqd7bydry2xp4zbjdmqhfmb6tftk6plvykg5tgmq/1435.png", alt: "Hitobito #1435", name: "Hitobito" },
    { src: "https://i.stargaze-apis.com/tcQv_XHOQ51n22qWForHitzoRIf4KV5S6A8PDOlKbMk/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeiee72m4iurkpon5fflg3w5twce6pkqywmvsdedrgq6nqvmnm534o4/574.png", alt: "Baaaad Kid #574", name: "Baaaad Kids" },
    { src: "https://i.stargaze-apis.com/TNOoS03TvDUFlkDSZ67tDpC0RxzTLclf8hL5qyiAygg/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeidbxpppa6catqaf2zatk6nh3b3ca7mune6jluima7mxaj4uijt6fq/9853.png", alt: "Baaaad Kid #9853", name: "Baaaad Kids" },
  ];

export default function Stake() {

    const [color, setColor] = useState("#ffffff");

    return (
        <div className="relative bg-black w-full">
            <Header />
            <div>
                <div className="grid">
                    <div className="px-10 mt-20 px-4 md:!px-20 md:!mt-32 mx-auto py-6 text-center">
                        <CustomGradualSpacing
                            className="font-display text-center text-2xl md:!text-6xl font-black tracking-tighter md:leading-[5rem] text-transparent bg-clip-text bg-gradient-to-b from-gray-400 to-white"
                            text="Stake, Win, and LFGODDS!"
                        />
                        {/* <h1 className="text-4xl text-white font-black">Stake, Win, and LFGODDS!</h1> */}
                        <div className="mt-6">
                            <p className="text-sm md:!text-xl text-gray-400 leading-tight">Discover the ultimate NFT staking challenge!</p>
                            <p className="text-sm md:!text-xl text-gray-400 leading-tight">Joing to complete, stack the most NFTs, and wind prizes</p>
                            {/* <p className="text-lg text-gray-400 leading-tight"></p> */}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col-reverse md:!flex-row mt-8">
                    <div className="relative mx-4 md:!ml-20 max-h-max">
                        <StakeCard />
                    </div>
                    <div className="mx-auto relative w-[375px] mb-4">
                        <CarouselStake images={imageList} interval={15000} />
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
