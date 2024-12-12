import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import CarouselStake from "@/components/CarouselStake";
import StakeSection from "@/components/home/StakeSection";
import StakeCard from "@/components/StakeCard";
import { BoxLeaderboard } from "@/components/BoxLaederboard";
import Leaderboard from "@/components/Leaderboard";

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

export default function Home() {
    return (
        <div className="relative bg-black w-full">
            <Header />
            <div className="grid grid-cols-2">
                <div className="mt-32 mx-auto p-6">
                    <h1 className="text-4xl text-white font-black">Stake, Win, and LFGODDS!</h1>
                    <div className="mt-6">
                        <p className="text-lg text-gray-400 leading-tight">Discover the ultimate NFT staking challenge! Compete to</p>
                        <p className="text-lg text-gray-400 leading-tight">see who holds the most stacked NFTs and win prizes. Only</p>
                        <p className="text-lg text-gray-400 leading-tight">the biggest Wizard will claim victory and win the prize!</p>
                    </div>
                </div>
                <div className="p-6 mt-20">
                    <CarouselStake images={imageList} interval={7500} />
                </div>
            </div>
            <div className="my-6 px-20">
                <StakeCard />
            </div>
            <div className="my-6">
                <BoxLeaderboard />
            </div>
            <div className="py-36 bg-[url('/images/blur-brown.png')] bg-cover bg-center">
                <Leaderboard />
            </div>
            <Footer />
        </div>
    );
}
