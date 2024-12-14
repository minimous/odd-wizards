"use client";

import getConfig from "@/config/config";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { formatAddress } from "@/lib/utils";
import { LeaderboardItem } from "@/types/leaderboard";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useClaim } from "@/hooks/useClaim";

const Leaderboard = () => {
  const rankEmojis = ["🥇", "🥈", "🥉"];

  const [visibleItems, setVisibleItems] = useState(4); // Jumlah item yang ditampilkan
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]); // Data leaderboard
  const [page, setPage] = useState(0); // Halaman untuk pagination
  const [hasMore, setHasMore] = useState(true); // Menandakan apakah masih ada data untuk dimuat
  const [loading, setLoading] = useState<boolean>(false);
  const config = getConfig();
  const { claim } = useClaim();

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
  }, [page]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setPage(0);
      try {
        const resp = await axios.get(`/api/soft-staking/leaderboard?collection_address=${config?.collection_address}&page=0`);
        const data = resp.data.data ?? [];
        setLeaderboard(data);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
      setLoading(false);
    }

    fetchData();
  }, [claim]);

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
      <p className="text-xs md:!text-lg text-gray-400 text-center leading-tight">
        Stake your Wizard, rise to the top, and show off your
      </p>
      <p className="text-xs md:!text-lg text-gray-400 text-center leading-tight">
        collection of these carefree.
      </p>
      <div className="flex flex-col items-center w-full mt-4">
        {leaderboard.slice(0, visibleItems).map((item, index) => (
          <div
            key={index}
            className="flex gap-4 md:!gap-6 items-center justify-center w-full mt-2 px-0 md:px-12 lg:px-16"
          >
            <div className="flex items-center justify-center w-[50px] h-[50px] md:w-[105px] md:h-[105px] bg-neutral-900 border-2 border-[#323237] shadow-sm shadow-[#323237] rounded-[15px] md:rounded-[25px] text-[#A1A1AA] font-bold text-2xl text-center p-4">
              {rankEmojis[index] || item.ranking}
            </div>
            <div className="flex flex-grow items-center justify-between p-4 px-8 gap-2 w-full h-[50px]  md:h-[105px] md:w-full bg-neutral-900 border-2 border-[#323237] shadow-sm shadow-[#323237] rounded-[15px] md:rounded-[25px] text-[#A1A1AA]">
              <div className="flex items-center gap-4">
                <div className="w-[35px] h-[35px] md:w-[70px] md:h-[70px] bg-amber-200 rounded-full flex items-center justify-center">
                <img
                    src={ item?.user_image_url ?? DEFAULT_IMAGE_PROFILE }
                    alt={ item?.staker_address ?? "" }
                    className="rounded-full object-cover w-full h-full"
                    onError={(e: any) => {
                      e.target.src = DEFAULT_IMAGE_PROFILE;
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-[10px] md:text-[20px] font-bold text-[#DB2877]">
                    {formatAddress(item.staker_address)}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] md:text-[20px] font-bold">
                  {item.total_points} $WZRD
                </p>
              </div>

              <div className="text-center">
                <p className="text-[10px] md:text-[20px] font-bold">
                  {item.staker_nft_staked} NFT Staked
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {
        loading && (
          <div className="my-6 text-center flex items-center justify-center">
            <Loading />
          </div>
        )
      }
      {hasMore && !loading && (
        <div className="mt-10 text-center">
          <button
            onClick={loadMore}
            className="md:text-xl text-gray-400 hover:text-white"
          >
            Load More ...
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
