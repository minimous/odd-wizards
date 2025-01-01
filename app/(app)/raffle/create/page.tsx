"use client"
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from "react";
import getConfig from "@/config/config";
import { useUser } from "@/hooks/useUser";
import axios from "axios";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormMessage,
    FormControl,
    FormLabel,
    FormItem,
    FormField
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import RaffleCard from "@/components/raffle/RaffleCard";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import moment from 'moment';

export default function Stake() {
    const config = getConfig();
    const { user, staker } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const [raffles, setRaffles] = useState([]);

    const defaultValues = {
        startDate: new Date(),
        endDate: new Date()
    };

    const formSchema = z.object({
        collection: z.string(),
        tokenId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        price: z.any().refine(value => value !== null && value !== undefined && value !== '' && !isNaN(value) && value > 0, {
            message: "Required",
        }),
        priceType: z.string(),
        maxTicket: z.any().refine(value => value !== null && value !== undefined && value !== '' && !isNaN(value) && value > 0, {
            message: "Required",
        }),
        winner: z.string().optional()
    });
    type FormValue = z.infer<typeof formSchema>;

    const form = useForm<FormValue>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit = (data: FormValue) => {
        console.log("data", data)
    };

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
                    <div className="px-10 mt-16 px-4 md:!px-10 md:!mt-24 mx-auto py-4 md:!py-6 gap-x-32 text-left flex flex-col items-center">
                        <div>
                            <div className="flex justify-center">
                                <h1 className="font-display text-[36px] md:!text-4xl font-black">
                                    Create Raffle
                                </h1>
                            </div>
                        </div>
                        {/* <div className="grid grid-cols-1 gap-10"> */}
                        <div>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="w-full space-y-4"
                                >
                                    <div className="my-4">
                                        <h1 className="mr-4 bg-gradient-to-r from-yellow-400 via-green-400 to-cyan-400 bg-clip-text font-londrina text-xl text-transparent md:text-2xl xl:text-2xl">
                                            Rewards:
                                        </h1>
                                        <div className="my-2 grid grid-cols-2">
                                            <div className="mr-4">
                                                <FormField
                                                    control={form.control}
                                                    name="collection"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Collection: <span className="text-green-500">*</span>
                                                            </FormLabel>
                                                            <div className="relative ml-auto flex-1 md:grow-0">
                                                                <FormControl>
                                                                    <Input
                                                                        type="text"
                                                                        disabled={loading}
                                                                        placeholder="Starsxx ..."
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <FormField
                                                    control={form.control}
                                                    name="tokenId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Token ID: <span className="text-green-500">*</span>
                                                            </FormLabel>
                                                            <div className="relative ml-auto flex-1 md:grow-0">
                                                                <FormControl>
                                                                    <Input
                                                                        type="text"
                                                                        disabled={loading}
                                                                        placeholder="00 ..."
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Separator orientation="horizontal" className="my-4" />
                                    <div className="my-4">
                                        <h1 className="mr-4 bg-gradient-to-r from-yellow-400 via-green-400 to-cyan-400 bg-clip-text font-londrina text-xl text-transparent md:text-2xl xl:text-2xl">
                                            Raffle Details:
                                        </h1>
                                        <div className="my-2 grid grid-cols-2 gap-y-4">
                                            <div className="mr-4">
                                                <FormField
                                                    control={form.control}
                                                    name="startDate"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Start Date: <span className="text-green-500">*</span>
                                                            </FormLabel>
                                                            <div className="relative ml-auto flex-1 md:grow-0">
                                                                <FormControl>
                                                                    <DateTimePicker
                                                                        className="w-full"
                                                                        placeholder="MMMM DD, YYYY h:mm A ..."
                                                                        value={moment(field.value).format("YYYY-MM-DD HH:mm:ss")}
                                                                        onChangeDateTime={(value) => {
                                                                            const date = new Date(moment(value, "YYYY-MM-DD h:mm A").format());
                                                                            field.onChange(date);
                                                                            field.value = date;
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <FormField
                                                    control={form.control}
                                                    name="endDate"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                End Date: <span className="text-green-500">*</span>
                                                            </FormLabel>
                                                            <div className="relative ml-auto flex-1 md:grow-0">
                                                                <FormControl>
                                                                    <DateTimePicker
                                                                        className="w-full"
                                                                        placeholder="MMMM DD, YYYY h:mm A ..."
                                                                        value={moment(field.value).format("YYYY-MM-DD HH:mm:ss")}
                                                                        onChangeDateTime={(value) => {
                                                                            const date = new Date(moment(value, "YYYY-MM-DD h:mm A").format());
                                                                            field.onChange(date);
                                                                            field.value = date;
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="mr-4">
                                                <FormField
                                                    control={form.control}
                                                    name="price"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Price : <span className="text-green-500">*</span>
                                                            </FormLabel>
                                                            <div className="relative ml-auto flex-1 md:grow-0">
                                                                <FormControl>
                                                                    <Input
                                                                        min={1}
                                                                        type="number"
                                                                        disabled={loading}
                                                                        placeholder="100 ..."
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <FormField
                                                    control={form.control}
                                                    name="priceType"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Price Type: <span className="text-green-500">*</span>
                                                            </FormLabel>
                                                            <div className="relative ml-auto flex-1 md:grow-0">
                                                                <FormControl>
                                                                    <Select onValueChange={field.onChange}
                                                                        value={field.value?.toString()}
                                                                        defaultValue={field.value?.toString()}
                                                                        disabled={loading}>
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue defaultValue={field.value?.toString()} placeholder="--Select--" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectGroup>
                                                                                <SelectLabel>Select Price Type</SelectLabel>
                                                                                <SelectItem value="WZRD">$WZRD</SelectItem>
                                                                            </SelectGroup>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="mr-4">
                                                <FormField
                                                    control={form.control}
                                                    name="maxTicket"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Max Ticket : <span className="text-green-500">*</span>
                                                            </FormLabel>
                                                            <div className="relative ml-auto flex-1 md:grow-0">
                                                                <FormControl>
                                                                    <Input
                                                                        min={1}
                                                                        type="number"
                                                                        disabled={loading}
                                                                        placeholder="2500 ..."
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <FormField
                                                    control={form.control}
                                                    name="winner"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Winner:
                                                            </FormLabel>
                                                            <div className="relative ml-auto flex-1 md:grow-0">
                                                                <FormControl>
                                                                    <Input
                                                                        type="text"
                                                                        disabled={loading}
                                                                        placeholder="Starsxx ..."
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant={'ghost'}
                                        className="h-14 w-full rounded-full bg-gradient-to-r from-yellow-400 via-green-400 to-cyan-400 text-2xl font-bold text-black hover:text-black"
                                    >
                                        Create Raffle
                                    </Button>
                                </form>
                            </Form>
                        </div>
                        {/* <div className="px-8">
                                <div className="my-4 grid gap-y-4">
                                    <h1 className="mr-4 bg-gradient-to-r from-yellow-400 via-green-400 to-cyan-400 bg-clip-text font-londrina text-xl text-transparent md:text-2xl xl:text-2xl">
                                        Preview:
                                    </h1>
                                    <RaffleCard />
                                </div>
                            </div> */}
                        {/* </div> */}
                    </div>
                </div>
            </div>
            <div className="h-full py-12 md:py-16">
                <Footer className="my-0" />
            </div>
        </div >
    );
}
