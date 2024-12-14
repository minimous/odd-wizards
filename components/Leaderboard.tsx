"use client";

import getConfig from "@/config/config";
import { formatAddress } from "@/lib/utils";
import { LeaderboardItem } from "@/types/leaderboard";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const rankEmojis = ["🥇", "🥈", "🥉"];

  const [visibleItems, setVisibleItems] = useState(4); // Jumlah item yang ditampilkan
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]); // Data leaderboard
  const [page, setPage] = useState(0); // Halaman untuk pagination
  const [hasMore, setHasMore] = useState(true); // Menandakan apakah masih ada data untuk dimuat
  const [loading, setLoading] = useState<boolean>(false);
  const config = getConfig();

  // Fungsi untuk mengambil data leaderboard
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const resp = await axios.get(`/api/soft-staking/leaderboard?collection_address=${config?.collection_address}&page=${page}`);
        const data = resp.data.data ?? [];
        setLeaderboard((prev) => [...prev, ...data]); // Menambahkan data baru ke data yang sudah ada
        setHasMore(data.length > 0); // Jika tidak ada data, set hasMore ke false
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
      setLoading(false);
    }

    fetchData();
  }, [page]); // Efek dijalankan setiap kali halaman berubah

  // Fungsi untuk memuat lebih banyak data
  const loadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Naikkan halaman saat tombol "Load More" diklik
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-12 px-4">
      <h1 className="text-lg sm:text-xl lg:text-3xl font-bold mb-2 text-white text-center">
        Leaderboard
      </h1>
      <p className="text-gray-400 text-center leading-tight">
        Stake your Wizard, rise to the top, and show off your
      </p>
      <p className="text-gray-400 text-center leading-tight">
        collection of these carefree.
      </p>
      <div className="flex flex-col items-center w-full mt-4">
        {leaderboard.slice(0, visibleItems).map((item, index) => (
          <div
            key={index}
            className="flex gap-6 items-center justify-center w-full mt-2 px-4 sm:px-8 md:px-12 lg:px-16"
          >
            <div className="flex items-center justify-center w-[50px] h-[50px] md:w-[105px] md:h-[105px] bg-neutral-900 border-2 border-[#323237] shadow-sm shadow-[#323237] rounded-[25px] text-[#A1A1AA] font-bold text-2xl text-center p-4">
              {rankEmojis[index] || item.ranking}
            </div>
            <div className="flex flex-grow items-center justify-between p-4 px-8 gap-2 w-full h-[50px]  md:h-[105px] md:w-full bg-neutral-900 border-2 border-[#323237] shadow-sm shadow-[#323237] rounded-[25px] text-[#A1A1AA]">
              <div className="flex items-center gap-4">
                <div className="w-[35px] h-[35px] md:w-[70px] md:h-[70px] bg-amber-200 rounded-full flex items-center justify-center">
                  <Image
                    src="/images/seals.png"
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="font-bold text-[#DB2877]">
                    {formatAddress(item.staker_address)}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold">
                  {item.total_points} $WZRD
                </p>
              </div>

              <div className="text-center">
                <p className="font-bold">
                  {item.staker_nft_staked} NFT Staked
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {
        loading && (
          <div className="my-6 text-center">
            <svg
              className="animate-spin h-10 w-10 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="black" /* Menentukan warna hitam */
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="black" /* Memberikan warna hitam */
                d="M4 12a8 8 0 018-8V0C6.373 0 0 6.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )
      }
      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={loadMore}
            className="text-lg sm:text-xl text-gray-400 hover:text-white"
          >
            Load More ...
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
