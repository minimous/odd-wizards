"use client";
import { formatToStars } from "@/lib/utils";
import { CollectionStat } from "@/types/collection-stat";
import axios from "axios";
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react";
import Loading from "./Loading";

export interface CollectionCardType {
    id: string
    address?: string
    image: string
    imageGif: string
    name: string
    link: string
}

export interface CollectionCardProps {
    data: CollectionCardType
}

const CollectionCard = ({ data }: CollectionCardProps) => {

    const [stat, setStat] = useState<CollectionStat>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            let resp = await axios.get(`/api/collection/stat/${data.id}`);
            setStat(resp.data.data);
            setLoading(false);
        }

        fetchData();
    }, []);

    return (
        <div className="flex flex-col items-center bg-black text-white border border-white group">
            <div className="relative flex justify-center items-center w-50 h-50 rounded-full">
                <Link href={data.link} target="_blank">
                    <div className="absolute top-0 w-full group overflow-hidden">
                        <div className="hidden group-hover:flex justify-between items-center p-2 animate-slide-down group-not-hover:animate-slide-up">
                            <span>Trade Collection</span>
                            <ArrowUpRight />
                        </div>
                    </div>
                    <div className="p-20 group-hover:hidden">
                        <img src={data.image} alt={data.name} className="h-full w-full" />
                    </div>
                    <img src={data.imageGif} alt={data.name} className="h-full w-full hidden group-hover:flex" />
                </Link>
            </div>
            <div className="border border-white w-full p-4">
                <h2 className="text-xl font-bold">{data.name}</h2>
            </div>
            <div className="grid grid-cols-2 w-full">
                <div className="p-4 border border-white w-full">
                    {
                        loading ?
                            (<Loading />) :
                            (<div><p className="font-bold">{data.id ? formatToStars(stat?.floor.amount) : 0} {stat?.floor.symbol}</p>
                                <span>Floor</span></div>)
                    }
                </div>
                <div className="p-4 border border-white w-full">
                    {
                        loading ?
                            (<Loading />) : (
                                <div>
                                    <p className="font-bold">{data.id ? stat?.tokenCounts.listed : 0} NFTs</p>
                                    <span>Listing</span>
                                </div>)
                    }
                </div>
            </div>
        </div>
    )
}

export default CollectionCard;