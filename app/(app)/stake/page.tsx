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
    { src: "https://i.stargaze-apis.com/i3462axock4w0yZqFyU1KFs1wqI5BPWaJd9staBClHI/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeigkl7dwo6n7lgvq6g6kh2n37mojxxsebgshiguztm7buce2zisg6q/6765.png", alt: "The Watchers #6765", name: "The Watchers" },
    { src: "https://i.stargaze-apis.com/DQiMyw-oIiRqc7W_ehnEJ-lIUJfskuvGPKa8XdzdfcA/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeid7jma4j7lhmnwen53x76vnixcv6d3cklaavxoyb2cu2bnlwwh5ni/288.png", alt: "RarityBotz #288", name: "RarityBotz" },
    { src: "https://i.stargaze-apis.com/vBqyi3nb9gWfeQ5hoznH7BAIaBE_2keZt80U1v0by0w/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeif7yizijnyifm52iugokjhghfzbpxpsicq3lyal3hkszradkzzora/790.png", alt: "Yield Kitty #790", name: "Yield Kitty" },
    { src: "https://i.stargaze-apis.com/Wo1hmNFgB8speFhQKeZwEiJQlnADUVDpcJ25zmgIPk0/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://Qmc2e9A7GM5AsqxhK6ny9TLVEnKMJeFyZWETYZNeU4awBE/openart-269b0d069edb438185e076a464cfb3ec_raw.jpg", alt: "Smokey Samantha", name: "Things" },
    { src: "https://i.stargaze-apis.com/koYlOq1KI2lZlK_aj-ILUCjsmhJUtfNFUon3DOtuk4o/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeicxaf7as66zpshjil4xmhcmogakow5wqxje22ksyq6sltsotabuaa/2271.png", alt: "CELOTHIRAPTOR 2271", name: "Celothiraptors" },
    { src: "https://i.stargaze-apis.com/GFsVdB1KeS6wMWFNIDgMAwvUgZgIBnODd4kSymXrv7k/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/12.png", alt: "Steamland #12", name: "Steamland" },
    { src: "https://i.stargaze-apis.com/aWGugQIHWT6Zdx6o65UeToyIznzKNlF_r_jq7i-EqtA/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeiaa3eueevoug6vkvyhyrjbwonzfpifmea2wui7xfgac7fevgresha/21.png", alt: "Steamland #21", name: "Steamland" },
    { src: "https://i.stargaze-apis.com/EbmwYUojWPPyaBklwBn2xWZrcgtT2y5qysWQ-LFz5aE/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeifjyejf6s4lnnqyapkyziyadubsa4topvh3dyicn374b4vukzpiam/7949.jpg", alt: "Stamp #1215", name: "Stamps" },
    { src: "https://i.stargaze-apis.com/M5Tx-3ub6OyrCbNubQRJY8I8BTVG8v-_YQshH3QI1iw/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeifjyejf6s4lnnqyapkyziyadubsa4topvh3dyicn374b4vukzpiam/8054.jpg", alt: "Stamp #7274", name: "Stamps" },
    { src: "https://i.stargaze-apis.com/IxudzWVd_qOI1LReJodhb6ZDXwWXkBhK0XbAkcisD2w/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeifmjwkgr6owmmqons7alu2as2jiig7gnrpjy5pekpkhslnl7d6jj4/839.png", alt: "Cham #839", name: "the Sidekicks" },
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
