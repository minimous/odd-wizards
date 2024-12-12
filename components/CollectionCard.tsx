export interface CollectionCardType {
    image: string
    name: string
    floor: number
    totalNft: number
}

export interface CollectionCardProps {
    data: CollectionCardType
}

const CollectionCard = ({ data }: CollectionCardProps) => {
    return (
        <div className="flex flex-col items-center bg-black text-white border border-white">
            <div className="flex justify-center items-center w-50 h-50 rounded-full mb-4 px-12 py-8">
                <img src={data.image} alt={data.name} className="h-full w-full" />
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