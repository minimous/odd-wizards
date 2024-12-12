import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export interface CollectionCardType {
    image: string
    imageGif: string
    name: string
    floor: number
    totalNft: number
}

export interface CollectionCardProps {
    data: CollectionCardType
}

const CollectionCard = ({ data }: CollectionCardProps) => {
    return (
        <div className="flex flex-col items-center bg-black text-white border border-white group">
            <div className="relative flex justify-center items-center w-50 h-50 rounded-full">
                <Link href="#">
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
                    <p className="font-bold">{data.floor} STARS</p>
                    <span>Floor</span>
                </div>
                <div className="p-4 border border-white w-full">
                    <p className="font-bold">{data.totalNft} NFTs</p>
                    <span>Listing</span>
                </div>
            </div>
        </div>
    )
}

export default CollectionCard;