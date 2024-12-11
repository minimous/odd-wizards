"use client";

import Image from "next/image";
import { FC } from "react";

const StakeCard: FC = () => {
  return (
    <div className="flex gap-4 w-full mt-4  px-4 md:px-12 lg:px-20">
      <div className="flex items-center w-full h-[200px] md:w-[1221px] md:h-[286px] p-[36px] gap-3 bg-[#18181B] border-2 border-[#323237] shadow-sm shadow-[#323237] rounded-[60px] md:rounded-[100px] ">
        <Image
          src="/images/Prize/Celothiraptop 5th.jpg"
          alt="Celothiraptop Prize"
          width={225}
          height={225}
          className="object-cover w-[100px] h-[100px] md:w-[225px] md:h-[225px] rounded-[40px] md:rounded-[70px]"
        />

        <div className="flex flex-col gap-5 w-full ">
          <div className="flex justify-between gap-3 ">
            <div className="flex flex-col   ">
              <h1 className=" text-[10px] md:text-4xl font-bold text-start text-white flex items-center gap-2  ">
                Seals 🦭
              </h1>
              <span className="text-[10px] md:text-lg text-start text-gray-400 mt-2  ">
                Stake your Seals, rise to the top, and show off
              </span>
              <span className="text-[10px] md:text-lg text-start text-gray-400  ">
                your collection of these carefree, quirky Seals.
              </span>
            </div>
            <div className="flex flex-col gap-5 justify-center items-center text-center">
              <button className="text-[5px] md:text-lg text-start text-gray-400  gap-12 ">
                Trade collection 👉⭐
              </button>
              <button className="text-[5px] md:text-lg text-start text-gray-400 gap-12 ">
                Unstake 👉 🔒
              </button>
            </div>
          </div>
          <button className="flex justify-start text-center items-center gap-3 px-3 w-[150px] md:w-full h-[40px]  md:h-[76px] rounded-2xl  bg-black">
            <Image
              src="/images/right.png"
              alt="Celothiraptop Prize"
              width={75}
              height={75}
              className="object-cover  w-[40px] h-[40px]  md:w-[75px] md:h-[75px] "
            />
            <h1 className=" text-sm md:text-4xl font-bold ">Stake Now</h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StakeCard;
