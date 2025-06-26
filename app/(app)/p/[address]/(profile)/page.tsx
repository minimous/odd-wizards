'use client';
import HeaderV2 from '@/components/layout/headerV2';
import { Footer } from '@/components/layout/footer';
import { DEFAULT_IMAGE_PROFILE } from '@/constants';
import { useUser } from '@/hooks/useUser';
import { useChain } from '@cosmos-kit/react';
import { formatAddress, formatDecimal } from '@/lib/utils';
import NFTGallery from '@/components/profile/NFTGallery';
import { useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import getConfig from '@/config/config';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import Loading from '@/components/Loading';
import { promiseToast } from '@/components/ui/use-toast';
import { mst_users } from '@prisma/client';
import NumberTicker from '@/components/ui/number-ticker';
import { sum } from '@cosmos-kit/core';
import TokensCard from '@/components/profile/TokensCard';
import { Bot } from 'lucide-react';

export default function Profile({ params }: { params: { address: string } }) {
  const config = getConfig();
  const [user, setUser] = useState<mst_users>();
  const [stakers, setStakers] = useState<any>();
  const [tokens, setTokens] = useState<any[] | []>([]);
  const [associated, setAssociated] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const componentRef = useRef<HTMLDivElement>(null);
  const [html2pdf, setHtml2pdf] = useState<any>(null);
  const [tokenType, setTokenType] = useState<string[] | []>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      let resp = await axios.get(`/api/user/${params.address}`);
      const data = resp.data.data;
      setStakers(data.staker);
      setUser(data.user);
      setAssociated(
        data.associated.names.length > 0 ? data.associated.names[0] : undefined
      );

      setTokens(
        Object.values(
          data.staker.reduce(
            (acc: any, staker: any) => {
              const projectId = staker.staker_project_id ?? 0;
              const project = staker.projects; // Getting the related project data

              if (!acc[projectId]) {
                acc[projectId] = {
                  project_id: projectId,
                  project_seqn: project?.project_seqn,
                  project_symbol: project?.project_symbol ?? '',
                  project_symbol_img: project?.project_symbol_img ?? '',
                  total_nft_staked: 0,
                  total_points: 0
                };
              }

              acc[projectId].total_nft_staked += staker.staker_nft_staked ?? 0;
              acc[projectId].total_points += staker.staker_total_points ?? 0;

              return acc;
            },
            {} as Record<
              number,
              {
                project_id: number;
                project_seqn: number;
                project_symbol: string;
                project_symbol_img: string;
                total_nft_staked: number;
                total_points: number;
              }
            >
          )
        )
      );

      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    import('html2pdf.js').then((module) => {
      setHtml2pdf(() => module.default);
    });
  }, []);

  const renderSocmed = (item: any) => {
    if (!item) return;

    switch (item.name) {
      // case "discord":
      //     return (
      //         <Link href={`https://discord.com/channels/${item.value}`} target='_blank'>
      //             <img src="/images/discord.png" className="w-[30px] md:w-[40px]" />
      //         </Link>
      //     );
      case 'twitter':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`https://x.com/${item.value}`} target="_blank">
                  <img
                    src="/images/x.png"
                    className="w-[25px] transition-all duration-300 ease-in-out hover:scale-105 md:w-[35px]"
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent className="border border-[#323237] bg-black text-xs md:!text-base">
                <p>Go to X Account</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
    }
  };

  const doTweet = () => {
    promiseToast(prepareTweet(), {
      loading: {
        title: 'Processing...',
        description: 'Please Wait'
      },
      success: () => {
        const tweetText = `Check out my Odds Wizard collection!\nHow cool is that😎✨\n${config?.base_url}/p/${params.address}\n\nShare yours! 🧙\n\n#oddsgarden #stargaze`;
        const encodedTweetText = encodeURIComponent(tweetText);
        const mobileTweetUrl = `twitter://post?message=${encodedTweetText}`; // Mobile app scheme
        const webTweetUrl = `https://x.com/intent/tweet?text=${encodedTweetText}`;

        // Detect if the user is on mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          window.location.href = mobileTweetUrl;
        } else {
          // Create temporary link element for web
          const link = document.createElement('a');
          link.href = webTweetUrl;
          link.target = '_blank';
          // link.rel = 'noopener noreferrer'; // Security best practice for target="_blank"
          document.body.appendChild(link);

          // Trigger click and remove element
          link.click();
          document.body.removeChild(link);
        }

        return {
          title: 'Success!',
          description: 'Share Success'
        };
      },
      error: (error: AxiosError | any) => ({
        title: 'Ups! Something wrong.',
        description: error?.response?.data?.message || 'Internal server error.'
      })
    });
  };

  const prepareTweet = async () => {
    try {
      // Export image
      const img = await exportToImage();
      if (!img) throw new Error('Failed to generate image');

      // Convert data URI to Blob and create File
      const blob = dataURItoBlob(img);
      const file = new File([blob], params.address + '.png', {
        type: 'image/png'
      });

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload using UploadThing endpoint
      const response = await fetch(`/api/share/${params.address}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Tweet failed:', error);
      throw error;
    }
  };

  // Helper function to convert Data URI to Blob
  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  const exportToImage = async (): Promise<string> => {
    const element = componentRef.current;
    await waitForImages(element);

    const opt = {
      margin: 0,
      filename: params.address,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: true
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    const img = await html2pdf().set(opt).from(element).outputImg();

    return img.src;
  };

  const waitForImages = async (element: any) => {
    const images = element.getElementsByTagName('img');
    const promises = Array.from(images).map((img: any) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });
    await Promise.all(promises);
  };

  return (
    <div className="relative">
      {/* <HeaderV2 /> */}
      <div>
        <div className="h-screen w-full bg-[url('/images/Account.gif')] bg-cover bg-center">
          <div className="relative flex h-screen items-end pb-4">
            <div className="absolute bottom-5 left-0 right-0 z-10">
              <div className="flex items-center gap-x-6 px-4 md:px-24">
                <div className="h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full md:!h-[125px] md:!w-[125px]">
                  <img
                    src={user?.user_image_url ?? DEFAULT_IMAGE_PROFILE}
                    onError={(e: any) => {
                      e.target.src = DEFAULT_IMAGE_PROFILE;
                    }}
                    className="h-[100px] w-[100px] rounded-full hover:scale-105 md:!h-[125px] md:!w-[125px]"
                  />
                </div>
                {loading ? (
                  <Loading />
                ) : (
                  <div className="flex flex-col gap-y-3">
                    {associated?.name ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {/* <Link href={`https://www.stargaze.zone/p/${params.address}/tokens`} target='_blank'> */}
                            <span className="text-xl font-black md:!text-3xl">
                              {associated.name}
                            </span>
                            {/* </Link> */}
                          </TooltipTrigger>
                          <TooltipContent className="border border-[#323237] bg-black text-xs md:!text-base">
                            <p>{formatAddress(params.address)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Link
                        href={`https://www.stargaze.zone/p/${params.address}/tokens`}
                        target="_blank"
                      >
                        <span className="text-sm font-black md:!text-3xl">
                          {formatAddress(params.address)}
                        </span>
                      </Link>
                    )}
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-x-3">
                        {associated?.records?.map((item: any) => {
                          return renderSocmed(item);
                        })}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`https://www.stargaze.zone/p/${params.address}/tokens`}
                                target="_blank"
                              >
                                <img
                                  src="/images/Icon/stargaze-white.png"
                                  className="w-[20px] transition-all duration-300 ease-in-out hover:scale-105 md:w-[30px]"
                                />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent className="border border-[#323237] bg-black text-xs md:!text-base">
                              <p>Go to Stargaze Account</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className="cursor-pointer"
                                onClick={doTweet}
                              >
                                <img
                                  src="/images/Icon/forward-arrow.png"
                                  className="w-[30px] transition-all duration-300 ease-in-out hover:scale-105 md:w-[35px]"
                                />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="border border-[#323237] bg-black text-xs md:!text-base">
                              <p>Share Your Account</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant={'ghost'}>
                                <Bot />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="border border-[#323237] bg-black text-xs md:!text-base">
                              <p>Setup Your Bot</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    {/* <span className="md:!text-md text-gray-400 hover:text-white">Edit Profile</span> */}
                  </div>
                )}
              </div>

              <div className="mt-8 px-6 md:!px-28">
                <span className="text-gray-400">Token</span>
                {loading ? (
                  <Loading />
                ) : (
                  <TokensCard
                    data={tokens}
                    tokenType={tokenType}
                    setTokenType={setTokenType}
                  />
                )}
              </div>
            </div>
            <div className="z-1 absolute bottom-0 left-0 h-[350px] w-full bg-gradient-to-b from-transparent to-black" />
          </div>
        </div>
        <div className="bg-black">
          <NFTGallery address={params.address} types={tokenType} />
        </div>
      </div>
      <div className="bg-[url('/images/bg-line-grid.png')] bg-cover bg-center py-8">
        <Footer className="my-0" />
      </div>

      <div className="hidden">
        <div ref={componentRef}>
          <div className="h-[300px] w-full bg-[url('/images/Account.gif')] bg-cover bg-center">
            <div className="relative flex h-[300px] items-end pb-4">
              <div className="absolute bottom-5 left-0 right-0 z-10">
                <div className="flex items-center gap-x-6 px-4 md:px-24">
                  <div className="shrink-0">
                    <img
                      src={user?.user_image_url ?? DEFAULT_IMAGE_PROFILE}
                      onError={(e: any) => {
                        e.target.src = DEFAULT_IMAGE_PROFILE;
                      }}
                      className="h-[100px] w-[100px] rounded-full md:!h-[125px] md:!w-[125px]"
                    />
                  </div>
                  {loading ? (
                    <Loading />
                  ) : (
                    <div className="flex flex-col gap-y-3">
                      {associated?.name ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {/* <Link href={`https://www.stargaze.zone/p/${params.address}/tokens`} target='_blank'> */}
                              <span className="text-xl font-black md:!text-3xl">
                                {associated.name}
                              </span>
                              {/* </Link> */}
                            </TooltipTrigger>
                            <TooltipContent className="border border-[#323237] bg-black text-xs md:!text-base">
                              <p>{formatAddress(params.address)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <Link
                          href={`https://www.stargaze.zone/p/${params.address}/tokens`}
                          target="_blank"
                        >
                          <span className="text-sm font-black md:!text-3xl">
                            {formatAddress(params.address)}
                          </span>
                        </Link>
                      )}
                      <div
                        style={{ marginTop: '15px' }}
                        className="flex items-center gap-x-3"
                      >
                        {associated?.records?.map((item: any) => {
                          return renderSocmed(item);
                        })}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                href={`https://www.stargaze.zone/p/${params.address}/tokens`}
                                target="_blank"
                              >
                                <img
                                  src="/images/Icon/stargaze-white.png"
                                  className="w-[20px] transition-all duration-300 ease-in-out hover:scale-105 md:w-[30px]"
                                />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent className="border border-[#323237] bg-black text-xs md:!text-base">
                              <p>Go to Stargaze Account</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-pointer">
                                <img
                                  src="/images/Icon/forward-arrow.png"
                                  className="w-[20px] transition-all duration-300 ease-in-out hover:scale-105 md:w-[30px]"
                                />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="border border-[#323237] bg-black text-xs md:!text-base">
                              <p>Share Your Account</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      {/* <span className="md:!text-md text-gray-400 hover:text-white">Edit Profile</span> */}
                    </div>
                  )}
                </div>
                <div className="mt-8 px-6 md:!px-28">
                  <span className="text-gray-400">Token</span>
                  <TokensCard
                    data={tokens}
                    tokenType={tokenType}
                    setTokenType={setTokenType}
                  />
                </div>
              </div>
              <div className="z-1 absolute bottom-0 left-0 h-[350px] w-full bg-gradient-to-b from-transparent to-black" />
            </div>
          </div>
          <div className="bg-black">
            <NFTGallery address={params.address} types={tokenType} />
          </div>
        </div>
      </div>
    </div>
  );
}
