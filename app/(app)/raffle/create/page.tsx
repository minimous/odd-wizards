"use client"
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from "react";
import Snowfall from 'react-snowfall';
import CustomGradualSpacing from "@/components/CustomGradouselSpacing";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { formatAddress, formatDecimal } from "@/lib/utils";
import Link from "next/link";
import getConfig from "@/config/config";
import { useUser } from "@/hooks/useUser";
import RaffleCard from "@/components/raffle/RaffleCard";
import axios from "axios";

export default function Stake() {
    const config = getConfig();
    const { user, staker } = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const [raffles, setRaffles] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const resp = await axios.get("/api/raffle/list");
            setRaffles(resp.data.data);
        }

        fetchData();
    }, [user]);

    return (
        <div className="relative bg-black w-full">
            <Header />
            <div>
                <div className="grid">
                    <div className="px-10 mt-16 px-4 md:!px-16 md:!mt-24 mx-auto py-4 md:!py-6 gap-x-32 text-left grid md:flex justify-between items-center">
                        <div>
                            <div className="flex justify-center">
                                <h1 className="font-display text-[36px] md:!text-4xl font-black">
                                    Create Raffle
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-full py-12 md:py-16">
                <Footer className="my-0" />
            </div>
        </div >
    );
}
