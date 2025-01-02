import { ArrowUp, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import { Raffle } from "@/types/raflles";
import { cn, formatAddress, formatDecimal } from "@/lib/utils";
import ParticipantsModal from "../modal/participant-modal";
import { useChain } from "@cosmos-kit/react";
import axios, { AxiosError } from "axios";
import { promiseToast } from "../ui/use-toast";
import { useToast } from "@/components/ui/use-toast";

export interface RaffleCardProps {
    data: Raffle;
}

const RaffleCard = ({ data }: RaffleCardProps) => {
    const [raffle, setRaffle] = useState<Raffle>(data);
    const [amount, setAmount] = useState<number>(1);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [status, setStatus] = useState<'not_started' | 'active' | 'expired'>('active');
    const [totalTickets, setTotalTickets] = useState(0);
    const [userTickets, setUserTickets] = useState(0);
    const [participantModal, setParticipantModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { address } = useChain("stargaze");
    const { toast } = useToast();
    
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        const totalTickets = raffle.participants?.reduce((sum, p) => sum + (p.participant_amount || 0), 0) || 0;
        setTotalTickets(totalTickets);

        if (address) {
            const userTickets = raffle.participants?.reduce((sum, p) =>
                p.participant_address == address ? sum + (p.participant_amount || 0) : sum, 0) || 0;
            setUserTickets(userTickets);
        }

        return () => clearInterval(timer);
    }, [data]);

    const calculateTimeLeft = () => {
        if (!raffle.raffle_start || !raffle.raffle_end) return "";

        const now = new Date().getTime();
        const startTime = new Date(raffle.raffle_start).getTime();
        const endTime = new Date(raffle.raffle_end).getTime();

        if (now < startTime) {
            setStatus('not_started');
            const difference = startTime - now;
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            return `${hours}h ${minutes}min ${seconds}s`;
        } else if (now > endTime) {
            setStatus('expired');
            return "";
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
                    fontBold: "font-base",
                    bgColor: "bg-yellow-700/20",
                    dotBg: "bg-yellow-500/50",
                    dot: "bg-yellow-500",
                    text: "Starts in:"
                };
            case 'expired':
                return {
                    fontBold: "font-bold !text-white",
                    bgColor: "bg-red-700/20",
                    dotBg: "bg-red-500/50",
                    dot: "bg-red-500",
                    text: "Ended"
                };
            default:
                return {
                    fontBold: "font-base",
                    bgColor: "bg-lime-700/20",
                    dotBg: "bg-green-500/50",
                    dot: "bg-green-500",
                    text: "Ends in:"
                };
        }
    };

    const statusStyles = getStatusStyles();

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            setAmount(1);
            return;
        }
        if (raffle.raffle_max_ticket && value > raffle.raffle_max_ticket) {
            setAmount(raffle.raffle_max_ticket);
            return;
        }
        setAmount(value);
    };

    const handleBuy = () => {
        if (status !== 'active') return;
        if (raffle.raffle_max_ticket && totalTickets + amount > raffle.raffle_max_ticket) return;
        
        if(!address) {
            toast({
                variant: "destructive",
                title: "Please Login first",
                description: "You must be logged in to buy tickets. Please login to your account to proceed."
            })
            return;
        }

        promiseToast(doBuy(amount, raffle.raffle_id), {
            loading: {
                title: "Processing...",
                description: "Please Wait"
            },
            success: () => {
                setLoading(false);
                updateRaffle();
                return {
                    title: "Success!",
                    description: "Buy Ticket Success"
                };
            },
            error: (error: AxiosError | any) => ({
                title: "Ups! Something wrong.",
                description: error?.response?.data?.message || 'Internal server error.'
            })
        });
    };

    const doBuy = async (amount: number, raffle_id: number) => {
        await axios.post("/api/raffle/buy", {
            raffle_id,
            wallet_address: address,
            amount
        })
    }

    const handleDrawWinner = () => {
        setLoading(true);
        promiseToast(doWinner(), {
            loading: {
                title: "Processing...",
                description: "Please Wait"
            },
            success: () => {
                setLoading(false);
                updateRaffle();
                return {
                    title: "Success!",
                    description: "Draw Winner Success"
                };
            },
            error: (error: AxiosError | any) => ({
                title: "Ups! Something wrong.",
                description: error?.response?.data?.message || 'Internal server error.'
            })
        });
    }

    const doWinner = async () => {
        await axios.post("/api/raffle/draw", {
            raffle_id: raffle.raffle_id
        });
    }

    const renderButton = () => {
        switch (status) {
            case 'active':
            case 'not_started':
                return <div className="flex items-center gap-x-2 py-2">
                    <Input
                        className="bg-stone-800 text-white font-black text-lg text-center border-none focus:border-none hover:border-none focus-visible:ring-0 rounded-[10px] w-[100px]"
                        value={amount}
                        onChange={handleAmountChange}
                        type="number"
                        min={1}
                        max={raffle.raffle_max_ticket ?? undefined}
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
                        disabled={status !== 'active' || loading}
                    >
                        {status === 'not_started' ? 'Not Started' : 'Buy'}
                    </Button>
                </div>
            case 'expired':
                return raffle.rewards[0].reward_win_address ? (
                    <div className="flex items-center gap-x-2">
                        <h1 className="text-lg text-yellow-500">Winner: </h1>
                        <Link href={`https://www.stargaze.zone/p/${raffle.rewards[0].reward_win_address}/tokens`} >
                            <span className='font-bold'>{formatAddress(raffle.rewards[0].reward_win_address ?? undefined)}</span>
                        </Link>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full font-black text-lg text-black rounded-[10px]",
                            "bg-green-500 hover:bg-green-400 hover:text-black"
                        )}
                        disabled={loading}
                        onClick={handleDrawWinner}>
                        Draw Winner
                    </Button>
                )

        }
    }

    const updateRaffle = async () => {
        const resp = await axios.get("/api/raffle/"+ data.raffle_id);
        setRaffle(resp.data.data);
    }

    return (
        <div className="w-full bg-[#18181B] border-2 border-[#323237] rounded-[20px] overflow-hidden">
            <ParticipantsModal participants={raffle.participants} isOpen={participantModal} onClose={() => { setParticipantModal(false) }} loading={false} />
            <div className={cn("flex items-center gap-2 p-2 px-2 text-sm", statusStyles.bgColor)}>
                <div className={cn("w-4 h-4 flex items-center justify-center rounded-full blinker", statusStyles.dotBg)}>
                    <div className={cn("w-2 h-2 rounded-full", statusStyles.dot)} />
                </div>
                <span className={cn("text-gray-400", statusStyles.fontBold)}>{statusStyles.text}</span>
                <span className="font-bold">{timeLeft}</span>
            </div>
            <div className="p-2 border-t-2 border-[#323237]">
                {data?.rewards?.[0] && (
                    <Link href={`https://www.stargaze.zone/m/${raffle.rewards[0].reward_collection}/${raffle.rewards[0].reward_token_id}`}>
                        <div className="flex items-center justify-between">
                            <h1 className="font-bold text-xl truncate">{raffle.rewards[0].reward_name}</h1>
                            <ArrowUp className="rotate-45" />
                        </div>
                    </Link>
                )}
                <div className="py-2">
                    <div className={cn("w-full bg-cover bg-center aspect-square rounded-xl")}
                        style={{ backgroundImage: `url(${raffle.rewards?.[0]?.reward_token_img})` }}>
                    </div>
                </div>
                <div className="grid gap-y-2 py-2">
                    <div className="flex items-center text-xs gap-x-2">
                        <span className="text-gray-400">Price: </span>
                        <span className="font-bold">
                            {formatDecimal(raffle.raffle_price, 2)} ${raffle.raffle_price_type} | {formatDecimal(totalTickets, 2)} Ticket Sold
                        </span>
                    </div>
                    {
                        address && <div className="flex items-center text-xs gap-x-2">
                            <span className="text-gray-400">Bought: </span>
                            <span className="font-bold text-green-500">
                                {formatDecimal(userTickets * (raffle.raffle_price || 0), 2)} ${raffle.raffle_price_type} | {formatDecimal(userTickets, 2)} Ticket
                            </span>
                        </div>
                    }
                </div>
                {renderButton()}
                <div className="flex items-center justify-center text-sm gap-x-1">
                    <Button onClick={() => setParticipantModal(true)} variant="ghost" className="hover:bg-transparent">
                        <Eye size={20} />
                        <span className="italic">See Participant</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RaffleCard;