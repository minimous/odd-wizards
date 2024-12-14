import StakeSection from "@/components/home/StakeSection";
import Header from "@/components/layout/header";
import Carousel from "@/components/Carausel";
import Leaderboard from "@/components/Leaderboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Footer } from "@/components/layout/footer";


export default function About() {
    return (
        <div className="relative w-full bg-[url('/images/About.gif')] bg-cover bg-center">
            <div className="p-4 md:!p-8">
                <div className="bg-black/40 absolute top-0 left-0 right-0 bottom-0 z-0" />
                <Header />
                <div className="relative">
                    {/* <img src="/images/about.gif" className="absolute top-0 z-0 w-full" /> */}
                    <div className="text-center w-full mt-20 md:!mt-28">
                        <h1 className="text-2xl md:!text-6xl text-white font-bold my-4">Ok, Let’s start from here</h1>
                        <div className="my-6">
                            <p className="text-sm md:!text-xl">We invite you to participate in the Odds Wizard NFT stake challenge. Wizard are</p>
                            <p className="text-sm md:!text-xl">divided into 3 tier traits: <span className="font-bold">Gold, Silver, and Bronze.</span> You can mint them on <span className="font-bold">December</span></p>
                            <p className="text-sm md:!text-xl"><span className="font-bold">16, 2024, at 7 PM UTC</span>only on Stargaze. After obtaining your Wizard NFT, make sure</p>
                            <p className="text-sm md:!text-xl">to stake them here.</p>
                        </div>
                        <div className="relative text-xl md:text-3xl font-bold my-6 text-center">
                            For your information, each tier will earn different points:
                            <div>
                                <li className="text-sm md:!text-xl" >Gold earns 10 $WZRD per day</li>
                                <li className="text-sm md:!text-xl">Silver earns 8 $WZRD per day</li>
                                <li className="text-sm md:!text-xl">Bronze earns 5 $WZRD per day</li>
                            </div>
                        </div>
                        <p className="text-sm md:!text-xl">The challenge will run for a month. We have a leaderboard system that you can see,</p>
                        <p className="text-sm md:!text-xl">so everything is accessible transparently. Join the fun with us and win one of the Top</p>
                        <p className="text-sm md:!text-xl">collections on Stargaze!</p>
                    </div>
                </div>
            </div>
            <Footer className="my-0 md:!my-0 py-8" />
        </div>
    );
}
