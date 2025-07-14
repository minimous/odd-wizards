'use client';

import GlobalLeadearboard from '@/components/GlobalLeaderboard';
import FooterV2 from '@/components/layout/footerV2';
import { LeaderboardItem } from '@/types/leaderboard';
import { useSyncedWallet } from '@/providers/wallet-provider-wrapper';
import { formatOddsPoints } from '@/lib/utils';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function LeaderboardPage() {
  const { address, isConnected } = useSyncedWallet();

  // const [visibleItems, setVisibleItems] = useState(4); // Jumlah item yang ditampilkan
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]); // Data leaderboard
  const [currentUser, setCurrentUser] = useState<LeaderboardItem | null>(null); // Data user saat ini
  const [page, setPage] = useState(0); // Halaman untuk pagination
  const [hasMore, setHasMore] = useState(true); // Menandakan apakah masih ada data untuk dimuat
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData() {
      setLoading(true);
      try {
        // Fetch general leaderboard
        const resp = await axios.get(
          `/api/soft-staking/leaderboard?page=${page}`,
          {
            signal
          }
        );
        const data = resp.data.data ?? [];

        // Fetch current user data if address exists and it's first page
        if (address && page === 0) {
          try {
            const userResp = await axios.get(
              `/api/soft-staking/leaderboard?wallet_address=${address}&page=0&limit=1`,
              { signal }
            );
            const userData = userResp.data.data ?? [];
            if (userData.length > 0) {
              setCurrentUser(userData[0]);
            }
          } catch (userError) {
            console.error('Error fetching current user data:', userError);
            setCurrentUser(null);
          }
        }

        if (page == 0) {
          setLeaderboard(data);
        } else {
          setLeaderboard((prev) => [...prev, ...data]); // Menambahkan data baru ke data yang sudah ada
        }

        setHasMore(data.length > 0); // Jika tidak ada data, set hasMore ke false
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled:', error.message);
        } else {
          console.error('Error fetching leaderboard data:', error);
        }
      }
      setLoading(false);
    }

    fetchData();

    return () => {
      controller.abort(); // Membatalkan request saat komponen dibersihkan
    };
  }, [page, address, isConnected]);

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    setPage((prev) => prev + 1);
    setLoadingMore(false);
  };

  return (
    <div className="h-full w-full">
      <div className="relative h-full w-full bg-black px-4 py-4 md:px-8">
        <div className="relative h-[40vh] rounded-[15px] bg-[url('https://s9oawqeuub.ufs.sh/f/Ae0rhpcXcgiTFCiheDZdliOCodsxKvZgQHNrSD7Lp0hTekVj')] bg-cover bg-center md:h-[60vh] md:rounded-[25px]">
          <div className="absolute bottom-0 left-0 h-full w-full bg-gradient-to-b from-black/50 via-black/90 to-black" />

          {/* Mobile Layout - Top 3 in row */}
          <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 transform items-end justify-center gap-8 px-4 md:!hidden">
            {loading && leaderboard.length === 0 ? (
              // Mobile Skeleton Loading
              <>
                {/* 2nd Place Skeleton */}
                <div className="flex animate-pulse flex-col items-center gap-1">
                  <div className="h-4 w-4 rounded bg-gray-600"></div>
                  <div className="h-[60px] w-[60px] rounded-[20px] bg-gray-600"></div>
                  <div className="h-3 w-16 rounded bg-gray-600"></div>
                  <div className="h-2 w-12 rounded bg-gray-600"></div>
                  <div className="h-6 w-[60px] rounded-[8px] bg-gray-600"></div>
                </div>

                {/* 1st Place Skeleton */}
                <div className="flex animate-pulse flex-col items-center gap-2">
                  <div className="h-6 w-6 rounded bg-gray-600"></div>
                  <div className="h-[80px] w-[80px] rounded-[25px] bg-gray-600"></div>
                  <div className="w-18 h-3 rounded bg-gray-600"></div>
                  <div className="h-2 w-14 rounded bg-gray-600"></div>
                  <div className="h-7 w-[80px] rounded-[10px] bg-gray-600"></div>
                </div>

                {/* 3rd Place Skeleton */}
                <div className="flex animate-pulse flex-col items-center gap-1">
                  <div className="h-4 w-4 rounded bg-gray-600"></div>
                  <div className="h-[60px] w-[60px] rounded-[20px] bg-gray-600"></div>
                  <div className="h-3 w-16 rounded bg-gray-600"></div>
                  <div className="h-2 w-12 rounded bg-gray-600"></div>
                  <div className="h-6 w-[60px] rounded-[8px] bg-gray-600"></div>
                </div>
              </>
            ) : (
              <>
                {/* 2nd Place */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">👑</span>
                  <div className="h-[60px] w-[60px] overflow-hidden rounded-[20px]">
                    <img
                      src={
                        leaderboard[1]?.user_image_url ||
                        'https://i.stargaze-apis.com/cwGA7Dh454BStHn2Kcxw9vWAdTqm7afwGywZBwuwHyc/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeifvehzyss3txegvulspvqzxxjmuu3546j7qeiclk4ebrjxri4vi4y/PandaStar%20T7S%20and%20Hood.png'
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="max-w-[80px] truncate text-xs font-medium text-white">
                    {leaderboard[1]?.staker_address
                      ? `${leaderboard[1].staker_address.slice(
                          0,
                          6
                        )}...${leaderboard[1].staker_address.slice(-4)}`
                      : '0x23...123'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatOddsPoints(leaderboard[1]?.total_points) ||
                      '✧ 200,000 Odds'}
                  </span>
                  <div className="w-[60px] rounded-[8px] bg-gray-500 py-1 text-center">
                    <span className="text-xs font-bold text-white">2nd</span>
                  </div>
                </div>

                {/* 1st Place - Center and taller */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">👑</span>
                  <div className="h-[80px] w-[80px] overflow-hidden rounded-[25px]">
                    <img
                      src={
                        leaderboard[0]?.user_image_url ||
                        'https://i.stargaze-apis.com/cwGA7Dh454BStHn2Kcxw9vWAdTqm7afwGywZBwuwHyc/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeifvehzyss3txegvulspvqzxxjmuu3546j7qeiclk4ebrjxri4vi4y/PandaStar%20T7S%20and%20Hood.png'
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="max-w-[90px] truncate text-sm font-medium text-white">
                    {leaderboard[0]?.staker_address
                      ? `${leaderboard[0].staker_address.slice(
                          0,
                          6
                        )}...${leaderboard[0].staker_address.slice(-4)}`
                      : '0x23...123'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatOddsPoints(leaderboard[0]?.total_points) ||
                      '✧ 273,382 Odds'}
                  </span>
                  <div className="w-[80px] rounded-[10px] bg-yellow-500 py-1 text-center">
                    <span className="text-sm font-black text-black">1st</span>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">👑</span>
                  <div className="h-[60px] w-[60px] overflow-hidden rounded-[20px]">
                    <img
                      src={
                        leaderboard[2]?.user_image_url ||
                        'https://i.stargaze-apis.com/cwGA7Dh454BStHn2Kcxw9vWAdTqm7afwGywZBwuwHyc/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeifvehzyss3txegvulspvqzxxjmuu3546j7qeiclk4ebrjxri4vi4y/PandaStar%20T7S%20and%20Hood.png'
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="max-w-[80px] truncate text-xs font-medium text-white">
                    {leaderboard[2]?.staker_address
                      ? `${leaderboard[2].staker_address.slice(
                          0,
                          6
                        )}...${leaderboard[2].staker_address.slice(-4)}`
                      : '0x23...123'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatOddsPoints(leaderboard[2]?.total_points) ||
                      '✧ 150,000 Odds'}
                  </span>
                  <div className="w-[60px] rounded-[8px] bg-orange-500 py-1 text-center">
                    <span className="text-xs font-bold text-white">3rd</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Desktop Layout - Original positioning */}
          <div className="hidden md:!block">
            {loading && leaderboard.length === 0 ? (
              // Desktop Skeleton Loading
              <>
                {/* 1st Place Skeleton - Center */}
                <div className="absolute left-1/2 top-1/2 -mt-6 flex -translate-x-1/2 -translate-y-1/2 transform animate-pulse flex-col items-center justify-center gap-2">
                  <div className="h-8 w-8 rounded bg-gray-600"></div>
                  <div className="h-[110px] w-[110px] rounded-[30px] bg-gray-600"></div>
                  <div className="h-5 w-24 rounded bg-gray-600"></div>
                  <div className="h-4 w-20 rounded bg-gray-600"></div>
                  <div className="h-8 w-[120px] rounded-[10px] bg-gray-600"></div>
                </div>

                {/* 2nd Place Skeleton - Left */}
                <div className="absolute left-[25%] top-1/2 flex -translate-y-1/2 transform animate-pulse flex-col items-center justify-center gap-2">
                  <div className="h-7 w-7 rounded bg-gray-600"></div>
                  <div className="h-[100px] w-[100px] rounded-[30px] bg-gray-600"></div>
                  <div className="h-4 w-20 rounded bg-gray-600"></div>
                  <div className="h-3 w-16 rounded bg-gray-600"></div>
                  <div className="h-8 w-[120px] rounded-[10px] bg-gray-600"></div>
                </div>

                {/* 3rd Place Skeleton - Right */}
                <div className="absolute right-[25%] top-1/2 flex -translate-y-1/2 transform animate-pulse flex-col items-center justify-center gap-2">
                  <div className="h-7 w-7 rounded bg-gray-600"></div>
                  <div className="h-[100px] w-[100px] rounded-[30px] bg-gray-600"></div>
                  <div className="h-4 w-20 rounded bg-gray-600"></div>
                  <div className="h-3 w-16 rounded bg-gray-600"></div>
                  <div className="h-8 w-[120px] rounded-[10px] bg-gray-600"></div>
                </div>
              </>
            ) : (
              <>
                {/* 1st Place - Center */}
                <div className="absolute left-1/2 top-1/2 -mt-6 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center gap-2">
                  <span className="text-4xl">👑</span>
                  <div className="h-[110px] w-[110px] overflow-hidden rounded-[30px]">
                    <img
                      src={
                        leaderboard[0]?.user_image_url ||
                        'https://i.stargaze-apis.com/cwGA7Dh454BStHn2Kcxw9vWAdTqm7afwGywZBwuwHyc/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeifvehzyss3txegvulspvqzxxjmuu3546j7qeiclk4ebrjxri4vi4y/PandaStar%20T7S%20and%20Hood.png'
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-xl font-medium text-white">
                    {leaderboard[0]?.staker_address
                      ? `${leaderboard[0].staker_address.slice(
                          0,
                          6
                        )}...${leaderboard[0].staker_address.slice(-4)}`
                      : '0x23...123'}
                  </span>
                  <span className="text-sm text-gray-400">
                    {formatOddsPoints(leaderboard[0]?.total_points) ||
                      '✧ 273,382 Odds'}
                  </span>
                  <div className="w-[120px] rounded-[10px] bg-yellow-500 py-1 text-center">
                    <span className="text-xl font-black text-black">1st</span>
                  </div>
                </div>

                {/* 2nd Place - Left */}
                <div className="absolute left-[25%] top-1/2 flex -translate-y-1/2 transform flex-col items-center justify-center gap-2">
                  <span className="text-3xl">👑</span>
                  <div className="h-[100px] w-[100px] overflow-hidden rounded-[30px]">
                    <img
                      src={
                        leaderboard[1]?.user_image_url ||
                        'https://i.stargaze-apis.com/cwGA7Dh454BStHn2Kcxw9vWAdTqm7afwGywZBwuwHyc/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeifvehzyss3txegvulspvqzxxjmuu3546j7qeiclk4ebrjxri4vi4y/PandaStar%20T7S%20and%20Hood.png'
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-lg font-medium text-white">
                    {leaderboard[1]?.staker_address
                      ? `${leaderboard[1].staker_address.slice(
                          0,
                          6
                        )}...${leaderboard[1].staker_address.slice(-4)}`
                      : '0x23...123'}
                  </span>
                  <span className="text-sm text-gray-400">
                    {formatOddsPoints(leaderboard[1]?.total_points) ||
                      '✧ 200,000 Odds'}
                  </span>
                  <div className="w-[120px] rounded-[10px] bg-gray-500 py-1 text-center">
                    <span className="text-xl font-black text-white">2nd</span>
                  </div>
                </div>

                {/* 3rd Place - Right */}
                <div className="absolute right-[25%] top-1/2 flex -translate-y-1/2 transform flex-col items-center justify-center gap-2">
                  <span className="text-3xl">👑</span>
                  <div className="h-[100px] w-[100px] overflow-hidden rounded-[30px]">
                    <img
                      src={
                        leaderboard[2]?.user_image_url ||
                        'https://i.stargaze-apis.com/cwGA7Dh454BStHn2Kcxw9vWAdTqm7afwGywZBwuwHyc/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeifvehzyss3txegvulspvqzxxjmuu3546j7qeiclk4ebrjxri4vi4y/PandaStar%20T7S%20and%20Hood.png'
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-lg font-medium text-white">
                    {leaderboard[2]?.staker_address
                      ? `${leaderboard[2].staker_address.slice(
                          0,
                          6
                        )}...${leaderboard[2].staker_address.slice(-4)}`
                      : '0x23...123'}
                  </span>
                  <span className="text-sm text-gray-400">
                    {formatOddsPoints(leaderboard[2]?.total_points) ||
                      '✧ 150,000 Odds'}
                  </span>
                  <div className="w-[120px] rounded-[10px] bg-orange-500 py-1 text-center">
                    <span className="text-xl font-black text-white">3rd</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="my-2 px-4 text-center md:my-6">
        <span className="text-xl font-bold text-white md:text-2xl">
          Odds Global Leaderboard
        </span>
      </div>
      <div className="mx-auto max-w-[500px] max-w-full px-4 md:px-0">
        {loading && leaderboard.length === 0 ? (
          <div className="w-full bg-black px-2 py-4 text-center text-white md:px-4 md:py-6">
            <div className="animate-pulse">
              <div className="mb-4 h-8 rounded bg-gray-700"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 rounded bg-gray-700"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <GlobalLeadearboard
            hasNextPage={hasMore}
            loadMore={loadMore}
            loadingMore={loading}
            leaderboard={leaderboard}
            userAddress={address}
            isConnected={isConnected}
            currentUser={currentUser}
          />
        )}
      </div>
      <FooterV2 />
    </div>
  );
}
