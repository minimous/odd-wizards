'use client';
import Header from '@/components/layout/header';
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
import {
  cn,
  extractCollectionAndTokenId,
  formatDecimal,
  getToken
} from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import ImageUpload from '@/components/ImageUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X } from 'lucide-react';
import { useDynamicTables } from '@/hooks/useDynamicTables';
import { columns } from '@/components/tables/collections-tables/columns';
import { useRouter } from 'next/navigation';
import { MstCollection } from '@/types/collection';
import { DataTable } from '@/components/tables/dynamic-tables';
import CollectionModal from '@/components/modal/form/collection-modal';
import { mst_collection } from '@prisma/client';

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function Stake({ searchParams }: paramsProps) {
  const config = getConfig();
  const [loading, setLoading] = useState<boolean>(false);
  const { address } = useChain('stargaze');
  const [collectionModal, setCollectionModal] = useState<boolean>(false);
  const [fileBanner, setFileBanner] = useState<File | undefined>();
  const [fileTwitter, setFileTwitter] = useState<File | undefined>();
  const [fileDiscord, setFileDiscord] = useState<File | undefined>();
  const [listCollection, setListCollection] = useState<any[] | []>([]);

  useEffect(() => {
    if (config && address && !config.owners.includes(address)) {
      window.location.href = '/raffle';
    }
  }, [address]);

  const defaultValues = {
    project_is_leaderboard: 'Y',
    project_status: 'N'
  };

  const formSchema = z.object({
    project_code: z.string().min(1, 'Project Code is required'),
    project_name: z.string().min(1, 'Project name is required'),
    project_description: z.string().min(1, 'Project description is required'),
    project_banner: z.instanceof(File, { message: 'A file is required' }),
    project_status: z.string(),
    project_is_leaderboard: z.string(),
    project_footer_discord: z.instanceof(File).optional(),
    project_footer_twitter: z.instanceof(File).optional(),
    project_footer_discord_color: z.string().optional(),
    project_footer_twitter_color: z.string().optional()
  });
  type FormValue = z.infer<typeof formSchema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = (data: FormValue) => {
    setLoading(true);
    promiseToast(createProject(data), {
      loading: {
        title: 'Processing...',
        description: 'Please Wait'
      },
      success: () => {
        window.location.reload();
        setLoading(false);
        return {
          title: 'Success!',
          description: 'Create Project Success'
        };
      },
      error: (error: AxiosError | any) => {
        setLoading(false);
        return {
          title: 'Ups! Something wrong.',
          description:
            error?.response?.data?.message || 'Internal server error.'
        };
      }
    });
  };

  const createProject = async (data: Record<string, any>) => {
    const formData = new FormData();

    // Menambahkan setiap properti dari data ke dalam FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value); // Jika ada file, langsung tambahkan
      } else if (Array.isArray(value)) {
        value.forEach((val, index) => {
          formData.append(`${key}[${index}]`, val); // Menangani array
        });
      } else {
        formData.append(key, String(value)); // Konversi lainnya ke string
      }
    });

    formData.append('collections', JSON.stringify(listCollection));

    await axios.post(`/api/project/create?wallet_address=${address}`, formData);
  };

  const doAddCollection = (dataForm: any) => {
    setListCollection((prev) => [...(prev || []), dataForm]);
  };

  const removeItem = (indexRemove: number) => {
    setListCollection((prev) =>
      prev.filter((_, index) => index !== indexRemove)
    );
  };

  return (
    <div className="relative w-full bg-black">
      <HeaderV2 />
      <CollectionModal
        isOpen={collectionModal}
        onClose={() => setCollectionModal(false)}
        loading={false}
        doAddCollection={doAddCollection}
      />
      <div className="flex items-center justify-center">
        <div className="grid w-full max-w-4xl">
          <div className="mx-auto mt-16 flex w-full flex-col items-center gap-x-32 px-10 px-4 py-4 text-left md:!mt-24 md:!px-10 md:!py-6">
            {!address ? (
              <div className="flex h-[350px] w-full items-center justify-center">
                <h1 className="text-4xl font-bold">Please Login</h1>
              </div>
            ) : (
              <div className="w-full">
                <div>
                  <div className="flex justify-center">
                    <h1 className="font-display text-[36px] font-black md:!text-4xl">
                      Create Project
                    </h1>
                  </div>
                </div>
                {/* <div className="grid grid-cols-1 gap-10"> */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-4"
                  >
                    <div className="flex w-full gap-x-8">
                      <div className="grid w-full">
                        <div className="my-4">
                          <h1 className="mr-4 font-londrina text-xl font-bold text-green-500 md:text-2xl xl:text-2xl">
                            Project Details:
                          </h1>
                          <div className="my-2 grid grid-cols-2">
                            <div className="mr-4">
                              <FormField
                                control={form.control}
                                name="project_code"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center">
                                      <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                      Project Code:{' '}
                                      <span className="text-green-500">*</span>
                                    </FormLabel>
                                    <div className="relative ml-auto flex-1 md:grow-0">
                                      <FormControl>
                                        <Input
                                          type="text"
                                          disabled={loading}
                                          placeholder="oddswizard..."
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
                            <div className="ml-4">
                              <FormField
                                control={form.control}
                                name="project_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center">
                                      <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                      Project Name:{' '}
                                      <span className="text-green-500">*</span>
                                    </FormLabel>
                                    <div className="relative ml-auto flex-1 md:grow-0">
                                      <FormControl>
                                        <Input
                                          type="text"
                                          disabled={loading}
                                          placeholder="Odds Wizard..."
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
                          <div className="my-2 grid grid-cols-2">
                            <div className="col-span-2">
                              <FormField
                                control={form.control}
                                name="project_description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="flex items-center">
                                      <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                      Description:{' '}
                                      <span className="text-green-500">*</span>
                                    </FormLabel>
                                    <div className="relative ml-auto flex-1 md:grow-0">
                                      <FormControl>
                                        <Textarea
                                          rows={3}
                                          disabled={loading}
                                          placeholder="Dive into the magic..."
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
                            <div className="my-2 grid grid-cols-2 gap-y-4">
                              <div className="mr-4">
                                <FormField
                                  control={form.control}
                                  name="project_is_leaderboard"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center">
                                        <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                        Is Leaderboard:{' '}
                                        <span className="text-green-500">
                                          *
                                        </span>
                                      </FormLabel>
                                      <div className="relative ml-auto flex-1 md:grow-0">
                                        <FormControl>
                                          <Checkbox
                                            disabled={loading}
                                            value={field.value?.toString()}
                                            defaultChecked={
                                              field.value?.toString() === 'Y'
                                            }
                                            onCheckedChange={(checked) => {
                                              field.onChange(
                                                checked ? 'Y' : 'N'
                                              );
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
                                  name="project_status"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center">
                                        <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                        Status :{' '}
                                        <span className="text-green-500">
                                          *
                                        </span>
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
                                                  Choose Status
                                                </SelectLabel>
                                                <SelectItem value="N">
                                                  DRAFT
                                                </SelectItem>
                                                <SelectItem value="P">
                                                  PUBLISH
                                                </SelectItem>
                                                <SelectItem value="C">
                                                  CANCELED
                                                </SelectItem>
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
                                  name="project_footer_discord_color"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center">
                                        <div className="mr-2 h-1 w-1 rounded-full bg-white" />
                                        Discord Color
                                        <span className="text-green-500">
                                          *
                                        </span>
                                      </FormLabel>
                                      <div className="relative ml-auto flex-1 md:grow-0">
                                        <FormControl>
                                          <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="#fff..."
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
                              <div className="ml-4">
                                <FormField
                                  control={form.control}
                                  name="project_footer_twitter_color"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center">
                                        <div className="mr-2 h-1 w-1 rounded-full bg-white" />
                                        Twiter Color:{' '}
                                        <span className="text-green-500">
                                          *
                                        </span>
                                      </FormLabel>
                                      <div className="relative ml-auto flex-1 md:grow-0">
                                        <FormControl>
                                          <Input
                                            type="text"
                                            disabled={loading}
                                            placeholder="#fff..."
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
                              <div className="col-span-2">
                                <FormField
                                  control={form.control}
                                  name="project_banner"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center">
                                        <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                        Banner Url:{' '}
                                        <span className="text-green-500">
                                          *
                                        </span>
                                      </FormLabel>
                                      <div className="relative ml-auto max-w-[820px] flex-1 md:grow-0">
                                        <FormControl>
                                          <ImageUpload
                                            onImageUpload={(file) => {
                                              setFileBanner(file);
                                              field.onChange(file);
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
                                  name="project_footer_discord"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center">
                                        <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                        Footer Discord{' '}
                                        <span className="text-green-500">
                                          *
                                        </span>
                                      </FormLabel>
                                      <div className="relative ml-auto max-w-[380px] flex-1 md:grow-0">
                                        <FormControl>
                                          <ImageUpload
                                            onImageUpload={(file) => {
                                              setFileDiscord(file);
                                              field.onChange(file);
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
                                  name="project_footer_twitter"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center">
                                        <div className="mr-2 h-1 w-1 rounded-full bg-white" />{' '}
                                        Footer Twiter :{' '}
                                        <span className="text-green-500">
                                          *
                                        </span>
                                      </FormLabel>
                                      <div className="relative ml-auto max-w-[380px] flex-1 md:grow-0">
                                        <FormControl>
                                          <ImageUpload
                                            onImageUpload={(file) => {
                                              setFileTwitter(file);
                                              field.onChange(file);
                                            }}
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
                          <Tabs defaultValue="collection" className="w-full">
                            <TabsList className="flex">
                              <TabsTrigger
                                className="w-full"
                                value="collection"
                              >
                                Collection
                              </TabsTrigger>
                              {form.watch('project_is_leaderboard') == 'Y' && (
                                <TabsTrigger className="w-full" value="rewards">
                                  Rewards
                                </TabsTrigger>
                              )}
                            </TabsList>
                            <TabsContent value="collection">
                              <Button
                                type="button"
                                onClick={() => setCollectionModal(true)}
                                className="rounded-[10px] bg-green-500 text-black hover:bg-green-600"
                              >
                                <Plus className="mr-1" />
                                Add Collection
                              </Button>
                              <div className="mt-4 grid grid-cols-2 gap-4">
                                {/* <DataTable columns={columnDefs} data={data} pageCount={pageCount} /> */}
                                {listCollection?.map(
                                  (item: any, index: number) => {
                                    return (
                                      <div
                                        key={item.collection_code}
                                        className="flex items-center gap-x-4 rounded-[20px] bg-[#171717] p-4"
                                      >
                                        <div className="grid w-full">
                                          <div className="flex w-full items-center justify-between">
                                            <span className="text-2xl font-bold">
                                              {item.collection_name}
                                            </span>
                                            <div>
                                              <button
                                                onClick={() => {
                                                  removeItem(index);
                                                }}
                                                className="rounded-full bg-red-500 text-white hover:bg-red-600"
                                                type="button"
                                              >
                                                <X className="h-5 w-5" />
                                              </button>
                                            </div>
                                          </div>
                                          <div className="flex gap-x-1">
                                            <p className="line-clamp-1 text-xs leading-tight text-gray-400 md:!text-lg">
                                              {item.collection_description}
                                            </p>
                                            <span className="cursor-pointer text-green-500">
                                              more
                                            </span>
                                          </div>
                                          <span className="text-xs text-gray-400 md:!text-lg">
                                            see traits:{' '}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </TabsContent>
                            <TabsContent value="rewards">
                              Change your password here.
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    </div>
                    <Button
                      disabled={loading}
                      variant={'ghost'}
                      className="h-12 w-full rounded-full bg-green-500 text-2xl font-bold text-black hover:bg-green-500 hover:text-black"
                    >
                      Create Project
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
