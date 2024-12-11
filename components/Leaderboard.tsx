"use client";

import Image from "next/image";
import React, { useState } from "react";

const Leaderboard = () => {
  const leaderboardData = [
    { rank: 1, name: "Stars123...1234", points: "376.333 $SEALS", staked: 300 },
    { rank: 2, name: "Stars123...1234", points: "176.333 $SEALS", staked: 400 },
    { rank: 3, name: "Stars123...1234", points: "96.333 $SEALS", staked: 90 },
    { rank: 4, name: "Stars123...1234", points: "88.333 $SEALS", staked: 122 },
    { rank: 5, name: "Stars123...1234", points: "76.333 $SEALS", staked: 200 },
    { rank: 6, name: "Stars123...1234", points: "66.333 $SEALS", staked: 300 },
    { rank: 7, name: "Stars123...1234", points: "56.333 $SEALS", staked: 400 },
    { rank: 8, name: "Stars123...1234", points: "46.333 $SEALS", staked: 90 },
    { rank: 9, name: "Stars123...1234", points: "36.333 $SEALS", staked: 122 },
    { rank: 10, name: "Stars123...1234", points: "26.333 $SEALS", staked: 200 },
  ];

  const rankEmojis = ["🥇", "🥈", "🥉"];

  const [visibleItems, setVisibleItems] = useState(4);
  const [isLoadMoreClicked, setIsLoadMoreClicked] = useState(false);

  const loadMore = () => {
    setVisibleItems(leaderboardData.length);
    setIsLoadMoreClicked(true);
  };

  const goBack = () => {
    setVisibleItems(4);
    setIsLoadMoreClicked(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-12 px-4">
      <h1 className="text-lg sm:text-xl lg:text-4xl font-bold mb-2 text-white text-center">
        Leaderboard
      </h1>
      <p className="text-gray-400 text-center mb-2 max-w-lg text-base sm:text-xl">
        Stake your Wizard, rise to the top, and show off your collection of these carefree.
      </p>
      <div className="flex flex-col items-center w-full">
        {leaderboardData.slice(0, visibleItems).map((user, index) => (
          <div
            key={index}
            className="flex gap-4 items-center justify-center w-full mt-4 px-4 sm:px-8 md:px-12 lg:px-16"
          >
            <div className="flex items-center justify-center w-[50px] h-[50px]  md:h-[105px] md:w-[105px] bg-neutral-900 border-2 border-[#323237] shadow-sm shadow-[#323237] rounded-[25px] text-[#A1A1AA] font-bold text-2xl text-center p-4">
              {rankEmojis[index] || user.rank}
            </div>
            <div className="flex flex-grow items-center justify-between p-4 px-8 gap-2 w-full h-[50px]  md:h-[105px] md:w-full bg-neutral-900 border-2 border-[#323237] shadow-sm shadow-[#323237] rounded-[25px] text-[#A1A1AA]">
              <div className="flex items-center gap-4">
                <div className="w-[35px] h-[35px] md:w-[70px] md:h-[70px]  bg-amber-200 rounded-full flex items-center justify-center">
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
                    {user.name}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold">
                  {user.points}
                </p>
              </div>

              <div className="text-center">
                <p className="font-bold">
                  {user.staked} NFT Staked
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        {isLoadMoreClicked ? (
          <button
            onClick={goBack}
            className="text-lg sm:text-xl font-semibold text-gray-400 hover:text-white"
          >
            Back
          </button>
        ) : (
          <button
            onClick={loadMore}
            className="text-lg sm:text-xl font-semibold text-gray-400 hover:text-white"
          >
            Load More ...
          </button>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
