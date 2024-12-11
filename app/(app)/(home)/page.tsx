import StakeSection from "@/components/home/StakeSection";
import Header from "@/components/layout/header";
import Carousel from "@/components/Carausel";
import Leaderboard from "@/components/Leaderboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Footer } from "@/components/layout/footer";

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
      <div className="relative">
        <Header />
        <img src="/images/hero.png" className="w-full" />
        <div className="absolute bottom-0 w-full h-[200px] bg-gradient-to-b from-transparent to-[#201621]"></div>
      </div>
      <div className="w-full bg-[#201621] py-8 text-center">
        <h1 className="text-6xl text-white font-black">Stake, Win, and LFGODDS!</h1>
        <div className="mt-8">
          <p className="text-2xl text-gray-400 leading-tight">Discover the ultimate NFT staking challenge! Compete</p>
          <p className="text-2xl text-gray-400 leading-tight">to see who holds the most stacked NFTs and win prizes.</p>
        </div>
      </div>
      <div className="w-full h-[125px] bg-[#201621]" />
      <div className="w-full bg-[#201621] mb-16">
        <StakeSection />
      </div>
      <div className="bg-[url('/images/blur-brown.png')] bg-cover bg-center">
        <Leaderboard />
        <div className="w-full relative text-white flex flex-col justify-center items-center text-center">
          <div className="mt-8">
            <h1 className="text-[24px] md:text-[36px] font-bold mb-4">
              Prize
            </h1>
            <p className="text-lg leading-relaxed">
              Only the biggest Seals will claim victory and win the prize!
            </p>
          </div>
          <Carousel images={imageList} interval={7500} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
