import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="relative w-full text-white flex items-center justify-center gap-x-10 text-center p-10 my-20">
      <Link href="#" target="_blank">
        <div className="bg-[#3A3A3A] rounded-xl flex items-center">
          <div className="flex gap-4 items-center py-4 pl-8">
            <img src="/images/discord.png" className="w-[50px]" />
            <span className="text-3xl font-bold">Discord</span>
          </div>
          <img src="/images/discord-wizard.png" className="h-[100px]" />
        </div>
      </Link>
      <Link href="#" target="_blank">
        <div className="bg-[#3A3A3A] rounded-xl flex items-center">
          <div className="flex gap-4 items-center py-4 pl-8">
            <img src="/images/x.png" className="w-[50px]" />
            <span className="text-3xl font-bold">Twitter</span>
          </div>
          <img src="/images/x-wizard.png" className="h-[100px]" />
        </div>
      </Link>
    </footer>
  );
};
