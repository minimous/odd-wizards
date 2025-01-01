import { ArrowUp, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { Raffle } from "@/types/raflles";
import { cn } from "@/lib/utils";

export interface RaffleCardProps {
    data: Raffle;
    onBuy?: (amount: number, raffle_id: number) => void;
}

const RaffleCard = ({ data, onBuy }: RaffleCardProps) => {
    const [amount, setAmount] = useState<number>(1);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [status, setStatus] = useState<'not_started' | 'active' | 'expired'>('active');
    const [totalTickets, setTotalTickets] = useState(0);
    const [userTickets, setUserTickets] = useState(0);

    const calculateTimeLeft = () => {
        if (!data.raffle_start || !data.raffle_end) return "";
        
        const now = new Date().getTime();
        const startTime = new Date(data.raffle_start).getTime();
        const endTime = new Date(data.raffle_end).getTime();

        if (now < startTime) {
            setStatus('not_started');
            const difference = startTime - now;
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            return `${hours}h ${minutes}min ${seconds}s`;
        } else if (now > endTime) {
            setStatus('expired');
            return "Expired";
        } else {
            setStatus('active');
            const difference = endTime - now;
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            return `${hours}h ${minutes}min ${seconds}s`;
        }
    };

    const getStatusStyles = () => {
        switch (status) {
            case 'not_started':
                return {
                    bgColor: "bg-yellow-700/20",
                    dotBg: "bg-yellow-500/50",
                    dot: "bg-yellow-500",
                    text: "Starts in:"
                };
            case 'expired':
                return {
                    bgColor: "bg-red-700/20",
                    dotBg: "bg-red-500/50",
                    dot: "bg-red-500",
                    text: "Ended"
                };
            default:
                return {
                    bgColor: "bg-lime-700/20",
                    dotBg: "bg-green-500/50",
                    dot: "bg-green-500",
                    text: "Ends in:"
                };
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        const totalTickets = data.participants?.reduce((sum, p) => sum + (p.participant_amount || 0), 0) || 0;
        setTotalTickets(totalTickets);

        const userAddress = "user_address";
        const userTickets = data.participants?.reduce((sum, p) => 
            p.participant_address === userAddress ? sum + (p.participant_amount || 0) : sum, 0) || 0;
        setUserTickets(userTickets);

        return () => clearInterval(timer);
    }, [data]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            setAmount(1);
            return;
        }
        if (data.raffle_max_ticket && value > data.raffle_max_ticket) {
            setAmount(data.raffle_max_ticket);
            return;
        }
        setAmount(value);
    };

    const handleBuy = () => {
        if (status !== 'active') return;
        if (data.raffle_max_ticket && totalTickets + amount > data.raffle_max_ticket) return;
        onBuy?.(amount, data.raffle_id);
    };

    const statusStyles = getStatusStyles();

    return (
        <div className="w-full bg-[#18181B] border-2 border-[#323237] rounded-[20px] overflow-hidden">
            <div className={cn("flex items-center gap-2 p-2 px-2 text-sm", statusStyles.bgColor)}>
                <div className={cn("w-4 h-4 flex items-center justify-center rounded-full blinker", statusStyles.dotBg)}>
                    <div className={cn("w-2 h-2 rounded-full", statusStyles.dot)} />
                </div>
                <span className="text-gray-400">{statusStyles.text}</span>
                <span className="font-bold">{timeLeft}</span>
            </div>
            <div className="p-2 border-t-2 border-[#323237]">
                {data?.rewards?.[0] && (
                    <Link href={`https://www.stargaze.zone/m/${data.rewards[0].reward_collection}/${data.rewards[0].reward_token_id}`}>
                        <div className="flex items-center justify-between">
                            <h1 className="font-bold text-xl truncate">{data.rewards[0].reward_name}</h1>
                            <ArrowUp className="rotate-45" />
                        </div>
                    </Link>
                )}
                <div className="py-2">
                    <div className={cn("w-full bg-cover bg-center aspect-square rounded-xl")}
                        style={{ backgroundImage: `url(${data.rewards?.[0]?.reward_token_img})` }}>
                    </div>
                </div>
                <div className="grid gap-y-2 py-2">
                    <div className="flex items-center text-xs gap-x-2">
                        <span className="text-gray-400">Price: </span>
                        <span className="font-bold">
                            {data.raffle_price} ${data.raffle_price_type} | {totalTickets} Ticket Sold
                        </span>
                    </div>
                    <div className="flex items-center text-xs gap-x-2">
                        <span className="text-gray-400">Bought: </span>
                        <span className="font-bold text-green-500">
                            {userTickets * (data.raffle_price || 0)} ${data.raffle_price_type} | {userTickets} Ticket
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-x-2 py-2">
                    <Input 
                        className="bg-stone-800 text-white font-black text-lg text-center border-none focus:border-none hover:border-none focus-visible:ring-0 rounded-[10px] w-[100px]"
                        value={amount}
                        onChange={handleAmountChange}
                        type="number"
                        min={1}
                        max={data.raffle_max_ticket ?? undefined}
                        disabled={status !== 'active'}
                    />
                    <Button 
                        variant="ghost"
                        className={cn(
                            "w-full font-black text-lg text-black rounded-[10px]",
                            status === 'active' ? "bg-green-500 hover:bg-green-400 hover:text-black" : 
                            status === 'not_started' ? "bg-yellow-500 hover:bg-yellow-400" : 
                            "bg-gray-500 hover:bg-gray-400"
                        )}
                        onClick={handleBuy}
                        disabled={status !== 'active'}
                    >
                        {status === 'not_started' ? 'Not Started' : status === 'expired' ? 'Ended' : 'Buy'}
                    </Button>
                </div>
                <div className="flex items-center justify-center text-sm gap-x-1">
                    <Button variant="ghost" className="hover:bg-transparent">
                        <Eye size={20} />
                        <span className="italic">See Participant</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RaffleCard;