"use client";
import StakeSection from "@/components/home/StakeSection";
import Header from "@/components/layout/header";
import Carousel from "@/components/Carausel";
import Leaderboard from "@/components/Leaderboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Footer } from "@/components/layout/footer";
import Snowfall from 'react-snowfall';


export default function About() {
    return (
        <div className="relative w-full bg-[url('/images/About.gif')] bg-cover bg-center">
            <div className="p-4 md:!p-8">
                <div className="bg-black/40 absolute top-0 left-0 right-0 bottom-0 z-0" />
                <Header />
                <div className="relative">
                    {/* <img src="/images/about.gif" className="absolute top-0 z-0 w-full" /> */}
                    <div className="text-center w-full px-10 md:!px-40 mt-20 md:!mt-28">
                        <h1 className="text-3xl md:!text-6xl text-white font-bold my-4">Participate in the Odds Wizard NFTS Stake Challenge</h1>
                        {/* <h1 className="text-3xl md:!text-6xl text-white font-bold my-4"></h1> */}

                        <div className="my-6">
                            <p className="text-sm md:!text-xl">Wizards are divided into 3 tier traits: <span className="font-bold">Gold, Silver, and Bronze.</span></p>
                            {/* <p className="text-sm md:!text-xl">You can mint them on <span className="font-bold">Dec 16, 2024, at 7 PM UTC</span> only on Stargaze.</p>
                            <p className="text-sm md:!text-xl">After obtaining your Wizard NFT, make sure to stake them here.</p> */}
                        </div>
                        <div className="relative text-xl md:text-3xl font-bold my-6 text-center">
                            EACH TIER WILL EARN DIFFERENT POINTS:
                            <div>
                                <li className="text-sm md:!text-xl">Gold earns 10 $WZRD per day</li>
                                <li className="text-sm md:!text-xl">Silver earns 8 $WZRD per day</li>
                                <li className="text-sm md:!text-xl">Bronze earns 5 $WZRD per day</li>
                            </div>
                        </div>
                        <div className="hidden md:!block">
                            <p className="text-sm md:!text-xl">The challenge will run for a month. We have a leaderboard system that you can see,</p>
                            <p className="text-sm md:!text-xl">ensuring everything is transparently accessible. Join the fun with us and win</p>
                            <p className="text-sm md:!text-xl">one of the Top collections on Stargaze!</p>
                            <div className="my-6">
                                <h1 className="text-2xl md:!text-4xl text-white font-bold my-4">Staking Challenge Periode</h1>
                                <p className="text-sm md:!text-xl">Staking challenge ends around mid-January, later the prizes can be claimed or will</p>
                                <p className="text-sm md:!text-xl">automatically go to your wallet, we will try the best method, so keep up your rank.</p>
                            </div>
                        </div>
                        {/* mobile */}
                        <div className="md:!hidden">
                            <p className="text-sm md:!text-xl">The challenge will run for a month.</p>
                            <p className="text-sm md:!text-xl">We have a leaderboard system that</p>
                            <p className="text-sm md:!text-xl">you can see, ensuring everything</p>
                            <p className="text-sm md:!text-xl">is transparently accessible.</p>
                            <p className="text-sm md:!text-xl">Join the fun with us and win one</p>
                            <p className="text-sm md:!text-xl">of the Top collections on Stargaze!</p>
                            <div className="my-6">
                                <h1 className="text-2xl md:!text-4xl text-white font-bold my-4">Staking Challenge Periode</h1>
                                <p className="text-sm md:!text-xl">Staking challenge ends around</p>
                                <p className="text-sm md:!text-xl">mid-January, later the prizes</p>
                                <p className="text-sm md:!text-xl">can be claimed or will automatically</p>
                                <p className="text-sm md:!text-xl">go to your wallet, we will try</p>
                                <p className="text-sm md:!text-xl">the best method, so keep up your rank.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer className="my-0 md:!my-0 py-8" />
        </div>
    );
}
