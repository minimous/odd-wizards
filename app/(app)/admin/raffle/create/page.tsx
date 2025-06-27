'use client';
import HeaderV2 from '@/components/layout/headerV2';
import { Footer } from '@/components/layout/footer';
import { ChangeEvent, useEffect, useState } from 'react';
import getConfig from '@/config/config';
import { useUser } from '@/hooks/useUser';
import axios, { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
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
import RaffleCard from '@/components/raffle/RaffleCard';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import moment from 'moment';
import { promiseToast } from '@/components/ui/use-toast';
import { useChain } from '@cosmos-kit/react';
import { MagicCard } from '@/components/ui/magic-card';
import {
  cn,
  extractCollectionAndTokenId,
  formatDecimal,
  getToken
} from '@/lib/utils';
import Link from 'next/link';
import { ArrowUp, ChevronUp, ChevronDown } from 'lucide-react';
import { mst_project } from '@prisma/client';
import { useSyncedWallet } from '@/providers/wallet-provider-wrapper';

const config = getConfig();
export default function Stake() {
  const { user, staker } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [raffles, setRaffles] = useState([]);
  const { address, isConnected } = useSyncedWallet();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [status, setStatus] = useState<'not_started' | 'active' | 'expired'>(
    'active'
  );
  const [token, setToken] = useState<any>();
  const [listType, setListType] = useState<string[] | []>([]);

  useEffect(() => {
    if (config && address && !config.owners.includes(address)) {
      window.location.href = '/raffle';
    }
  }, [address]);

  useEffect(() => {
    async function fetchData() {
      const resp = await axios.get('/api/project/list');
      const projects = resp.data.data ?? [];
      setListType(
        projects.map((project: mst_project) => project.project_symbol)
      );
    }

    fetchData();
  }, []);

  const defaultValues = {
    startDate: new Date(),
    endDate: new Date()
  };

  const formSchema = z.object({
    priceUrl: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    price: z
      .any()
      .refine(
        (value) =>
          value !== null &&
          value !== undefined &&
          value !== '' &&
          !isNaN(value) &&
          value > 0,
        {
          message: 'Required'
        }
      ),
    priceType: z.string(),
    maxTicket: z
      .any()
      .refine(
        (value) =>
          value !== null &&
          value !== undefined &&
          value !== '' &&
          !isNaN(value) &&
          value > 0,
        {
          message: 'Required'
        }
      ),
    winner: z.string().optional()
  });
  type FormValue = z.infer<typeof formSchema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = (data: FormValue) => {
    setLoading(true);
    promiseToast(createRaffle(data), {
      loading: {
        title: 'Processing...',
        description: 'Please Wait'
      },
      success: () => {
        window.location.reload();
        setLoading(false);
        return {
          title: 'Success!',
          description: 'Create Raffle Success'
        };
      },
      error: (error: AxiosError | any) => ({
        title: 'Ups! Something wrong.',
        description: error?.response?.data?.message || 'Internal server error.'
      })
    });
  };

  const createRaffle = async (data: FormValue) => {
    const { collection, tokenId } = extractCollectionAndTokenId(
      form.watch('priceUrl')
    );
    await axios.post('/api/raffle/create', {
      price: data.price,
      wallet_address: address,
      start_date: data.startDate,
      end_date: data.endDate,
      max_ticket: data.maxTicket,
      type: data.priceType,
      win_address: data.winner,
      collection_address: collection,
      token_id: tokenId
    });
  };

  useEffect(() => {
    async function fetchData() {
      const resp = await axios.get('/api/raffle/list');
      setRaffles(resp.data.data);
    }

    fetchData();
  }, [user]);

  const getStatusStyles = () => {
    switch (status) {
      case 'not_started':
        return {
          fontBold: 'font-base',
          bgColor: 'bg-yellow-700/20',
          dotBg: 'bg-green-500/50',
          dot: 'bg-green-500',
          text: 'Starts in:'
        };
      case 'expired':
        return {
          fontBold: 'font-bold !text-white',
          bgColor: 'bg-red-700/20 justify-center',
          dotBg: 'bg-green-500/50',
          dot: 'bg-green-500',
          text: 'Ended!'
        };
      default:
        return {
          fontBold: 'font-base',
          bgColor: 'bg-lime-700/20',
          dotBg: 'bg-green-500/50',
          dot: 'bg-green-500',
          text: 'Ends in:'
        };
    }
  };

  useEffect(() => {
    async function fetchData() {
      const { collection, tokenId } = extractCollectionAndTokenId(
        form.watch('priceUrl')
      );
      if (collection && tokenId) {
        const token = await getToken(collection, tokenId);
        setToken(token);
      }
    }

    fetchData();
  }, [form.watch('priceUrl')]);

  const statusStyles = getStatusStyles();

  const calculateTimeLeft = () => {
    const startDate = form.watch('startDate');
    const endDate = form.watch('endDate');
    if (!startDate || !endDate) return '';

    const now = new Date().getTime();
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    if (now < startTime) {
      setStatus('not_started');
      const difference = startTime - now;
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      return `${hours}h ${minutes}min ${seconds}s`;
    } else if (now > endTime) {
      setStatus('expired');
      return '';
    } else {
      setStatus('active');
      const difference = endTime - now;
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      return `${hours}h ${minutes}min ${seconds}s`;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [form.watch('startDate'), form.watch('endDate')]);

  return (
    <div className="relative w-full bg-black">
      {/* <HeaderV2 /> */}
      <div>
        <div className="grid">
          <div className="mx-auto mt-16 flex flex-col items-center gap-x-32 px-10 px-4 py-4 text-left md:!mt-24 md:!px-10 md:!py-6">
            {!address ? (
              <div className="flex h-[350px] w-full items-center justify-center">
                <h1 className="text-4xl font-bold">Please Login</h1>
              </div>
            ) : (
              <div>
                <div>
                  <div className="flex justify-center">
                    <h1 className="font-display text-[36px] font-black md:!text-4xl">
                      Create Raffle
                    </h1>
                  </div>
                </div>
                {/* <div className="grid grid-cols-1 gap-10"> */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-4"
                  >
                    <div className="flex gap-x-8">
                      <div className="grid">
                        <div className="my-4">
                          <h1 className="mr-4 font-londrina text-xl font-bold text-green-500 md:text-2xl xl:text-2xl">
                            Raffle Details:
                          </h1>
                          <div className="my-2 grid grid-cols-2">
                            <div className="col-span-2">
                              <FormField
                                control={form.control}
                                name="priceUrl"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center">
                                      <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                      Prize Link:{' '}
                                      <span className="text-green-500">*</span>
                                    </FormLabel>
                                    <div className="relative ml-auto flex-1 md:grow-0">
                                      <FormControl>
                                        <Input
                                          type="text"
                                          disabled={loading}
                                          placeholder="https://www.stargaze.zone/m/oddswizard/5263"
                                          className="w-full"
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
                          <div className="my-4">
                            <FormField
                              control={form.control}
                              name="priceType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center">
                                    <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                    Choose Token:{' '}
                                    <span className="text-green-500">*</span>
                                  </FormLabel>
                                  <div className="relative ml-auto flex-1 md:grow-0">
                                    <FormControl>
                                      <Select
                                        onValueChange={field.onChange}
                                        value={field.value?.toString()}
                                        defaultValue={field.value?.toString()}
                                        disabled={loading}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue
                                            defaultValue={field.value?.toString()}
                                            placeholder="--Select--"
                                          />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            <SelectLabel>
                                              Choose Token
                                            </SelectLabel>
                                            {listType?.map((type, index) => {
                                              return (
                                                <SelectItem
                                                  key={index}
                                                  value={type}
                                                >
                                                  ${type}
                                                </SelectItem>
                                              );
                                            })}
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
                          <div className="my-4">
                            <div className="my-2 grid grid-cols-2 gap-y-4">
                              <div className="mr-4">
                                <FormField
                                  control={form.control}
                                  name="startDate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center">
                                        <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                        Start Date:{' '}
                                        <span className="text-green-500">
                                          *
                                        </span>
                                      </FormLabel>
                                      <div className="relative ml-auto flex-1 md:grow-0">
                                        <FormControl>
                                          <DateTimePicker
                                            className="w-full"
                                            placeholder="MMMM DD, YYYY h:mm A ..."
                                            value={moment(field.value).format(
                                              'YYYY-MM-DD HH:mm:ss'
                                            )}
                                            onChangeDateTime={(value) => {
                                              const date = new Date(
                                                moment(
                                                  value,
                                                  'YYYY-MM-DD h:mm A'
                                                ).format()
                                              );
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
                                  name="price"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center">
                                        <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                        Entry Price :{' '}
                                        <span className="text-green-500">
                                          *
                                        </span>
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
                              <div className="mr-4">
                                <FormField
                                  control={form.control}
                                  name="endDate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center">
                                        <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                        End Date:{' '}
                                        <span className="text-green-500">
                                          *
                                        </span>
                                      </FormLabel>
                                      <div className="relative ml-auto flex-1 md:grow-0">
                                        <FormControl>
                                          <DateTimePicker
                                            className="w-full"
                                            placeholder="MMMM DD, YYYY h:mm A ..."
                                            value={moment(field.value).format(
                                              'YYYY-MM-DD HH:mm:ss'
                                            )}
                                            onChangeDateTime={(value) => {
                                              const date = new Date(
                                                moment(
                                                  value,
                                                  'YYYY-MM-DD h:mm A'
                                                ).format()
                                              );
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
                                  name="maxTicket"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center">
                                        <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                        Entry Limit :{' '}
                                        <span className="text-green-500">
                                          *
                                        </span>
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
                              <div className="col-span-2">
                                <FormField
                                  control={form.control}
                                  name="winner"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center">
                                        <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
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
                        </div>
                      </div>
                      <div className="py-6">
                        <MagicCard
                          className="h-full w-[275px]"
                          gradientColor={'#262626'}
                        >
                          <div
                            className={cn(
                              'flex items-center gap-2 p-2 px-2 text-sm',
                              statusStyles.bgColor
                            )}
                          >
                            <div
                              className={cn(
                                'blinker flex h-4 w-4 items-center justify-center rounded-full',
                                statusStyles.dotBg
                              )}
                            >
                              <div
                                className={cn(
                                  'h-2 w-2 rounded-full',
                                  statusStyles.dot
                                )}
                              />
                            </div>
                            <span
                              className={cn(
                                'text-gray-400',
                                statusStyles.fontBold
                              )}
                            >
                              {statusStyles.text}
                            </span>
                            <span className="font-bold">{timeLeft}</span>
                          </div>
                          <div className="border-t-2 border-[#323237] px-4 pb-2">
                            <div className="p-2">
                              {token && (
                                <Link href={`${form.watch('priceUrl')}`}>
                                  <div className="flex items-center justify-between">
                                    <h1 className="truncate text-xl font-bold">
                                      {token?.name}
                                    </h1>
                                    <ArrowUp className="rotate-45" />
                                  </div>
                                </Link>
                              )}
                              <div>
                                <div className="py-2">
                                  <div
                                    className={cn(
                                      'aspect-square w-full rounded-xl bg-cover bg-center'
                                    )}
                                    style={{
                                      backgroundImage: `url(${token?.media?.url})`
                                    }}
                                  ></div>
                                </div>
                                <div className="grid gap-y-2 py-2">
                                  <div className="flex items-center gap-x-2 text-xs">
                                    <span className="text-gray-400">
                                      Price:{' '}
                                    </span>
                                    <span className="font-bold">
                                      {formatDecimal(form.watch('price'), 2)} $$
                                      {form.watch('priceType')} |{' '}
                                      {formatDecimal(
                                        form.watch('maxTicket'),
                                        2
                                      )}{' '}
                                      Ticket Sold
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-x-2 py-2">
                              <div className="group relative">
                                <input
                                  className="no-spinner h-[45px] w-[80px] rounded-[10px] border-none bg-stone-800 text-center text-lg font-black text-white hover:border-none focus:border-none focus-visible:ring-0"
                                  value={100}
                                  type="number"
                                  min={1}
                                  max={form.watch('maxTicket')}
                                  disabled={status !== 'active'}
                                  style={{
                                    WebkitAppearance: 'none', // Chrome, Safari, Edge
                                    MozAppearance: 'textfield' // Firefox
                                  }}
                                />
                                <div className="absolute right-2 top-0 flex h-full flex-col justify-center opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                                  <button
                                    className="-mb-1 text-white opacity-50 hover:text-gray-300 focus:outline-none"
                                    disabled={status !== 'active'}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="-mt-1 text-white opacity-50 hover:text-gray-300 focus:outline-none"
                                    disabled={status !== 'active'}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                className={cn(
                                  'h-[45px] w-full rounded-[10px] text-lg font-black text-black',
                                  'bg-green-500 hover:bg-green-400 hover:text-black'
                                )}
                                disabled={status !== 'active' || loading}
                              >
                                Buy
                              </Button>
                            </div>
                            <div className="mt-2 flex items-center justify-center gap-x-1 text-sm">
                              <span className="opacity-50">*Just Preview</span>
                            </div>
                          </div>
                        </MagicCard>
                      </div>
                    </div>
                    <Button
                      disabled={loading}
                      variant={'ghost'}
                      className="h-12 w-full rounded-full bg-green-500 text-2xl font-bold text-black hover:bg-green-500 hover:text-black"
                    >
                      Create Raffle
                    </Button>
                  </form>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-full py-12 md:py-16">
        <Footer className="my-0" />
      </div>
    </div>
  );
}
