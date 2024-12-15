import StakeSection from "@/components/home/StakeSection";
import Header from "@/components/layout/header";
import Carousel from "@/components/Carausel";
import Leaderboard from "@/components/Leaderboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Footer } from "@/components/layout/footer";
import GradualSpacing from "@/components/ui/gradual-spacing";
import CustomGradualSpacing from "@/components/CustomGradouselSpacing";

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

export default function Home() {
  return (
    <div className="relative bg-black w-full">
      <div className="relative">
        <Header />
        {/* <img src="/images/hero.png" className="w-full" /> */}
        <video autoPlay loop muted className="w-full">
          <source src="/images/home.mp4" type="video/mp4" />
          <img src="/images/hero.png" className="w-full" />
        </video>
        <div className="absolute bottom-0 w-full h-[200px] bg-gradient-to-b from-transparent to-[#201621]"></div>
      </div>
      <div className="w-full bg-[#201621] px-4 py-12 text-center">
        {/* <h1 className="text-4xl md:!text-6xl text-white font-black">Stake, Win, and LFGODDS!</h1> */}
        <CustomGradualSpacing
          className="font-display text-center text-4xl md:!text-6xl font-black tracking-tighter md:leading-[5rem] text-transparent bg-clip-text bg-gradient-to-b from-gray-400 to-white"
          text="Stake, Win, and LFGODDS!"
        />
        <div className="mt-4">
          <p className="text-lg md:!text-xl text-gray-400 leading-none">Discover the ultimate NFT stake challenge</p>
          <p className="text-lg md:!text-xl text-gray-400 leading-none">Join to compete, stack the most NFTs, and win prizes.</p>
        </div>
      </div>
      <div className="w-full h-[125px] bg-[#201621]" />
      <div className="w-full bg-[#201621] md:mb-16">
        <StakeSection />
      </div>
      <div className="bg-[url('/images/blur-brown.png')] bg-cover bg-center mt-8 md:!mt-0">
        <Leaderboard />
        <div className="w-full relative text-white flex flex-col justify-center items-center text-center">
          <div className="mt-8 mb-4 mx-4">
            <h1 className="text-[24px] md:text-[36px] font-bold mb-4">
              Prize
            </h1>
            <p className="text-xs md:!text-lg text-gray-400 leading-relaxed">
              Only the biggest stakers will claim victory and win the prize!
            </p>
          </div>
          <Carousel images={imageList} interval={15000} />
        </div>
      </div>
      <div className="bg-[url('/images/bg-line-grid.png')] bg-cover bg-center h-full py-8 md:py-16">
        <Footer className="my-0" />
      </div>
    </div>
  );
}
