import { useState } from "react";
import { SearchBox } from "../searchbox";
import { cn } from "@/lib/utils";

const chains = [
    {
        name: "Atom",
        icon: "/images/Icon/atom.png"
    },
    {
        name: "Initia",
        icon: "/images/Icon/initia.png"
    },
    {
        name: "MegaEth",
        icon: "/images/Icon/megaeth.png"
    }
]

const ChainSelection = () => {

    const [selectedChain, setSelectedChain] = useState<string>("Atom");

    return (
        <div className="flex items-center gap-2">
            {chains.map((chain) => (
                <button onClick={() => setSelectedChain(chain.name)} key={chain.name} className={cn(selectedChain === chain.name ? "bg-[#2D253E]" : "bg-[#15111D]", "h-[28px] flex gap-2 text-[#DDDDDD] rounded-[5px] px-3 items-center justify-center flex gap-2 py-1 transition-all duration-300")}>
                    <img src={chain.icon} alt={chain.name} className="h-4 mx-auto" />
                    { selectedChain === chain.name && <span className="text-sm">{chain.name}</span>}
                </button>
            ))}
            <div className="w-full">
                <SearchBox />
            </div>
        </div>
    )
}

export default ChainSelection;