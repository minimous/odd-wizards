import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface FooterProps {
  className?: string
}

export const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={cn("relative w-full text-white flex items-center justify-center gap-x-4 md:gap-x-10 text-center p-4 md:p-10 my-10 md:my-20", className ?? "")}>
      <Link href="#" target="_blank">
        <div className="bg-[#3A3A3A] rounded-xl flex items-center shadow-md">
          <div className="flex gap-1 md:gap-4 items-center py-4 pl-2 md:pl-8">
            <img src="/images/discord.png" className="w-[25px] md:w-[50px]" />
            <span className="text-lg md:text-3xl font-bold">Discord</span>
          </div>
          <img src="/images/discord-wizard.png" className="h-[40px] md:h-[100px]" />
        </div>
      </Link>
      <Link href="#" target="_blank">
        <div className="bg-[#3A3A3A] rounded-xl flex items-center shadow-md">
          <div className="flex gap-1 md:gap-4 items-center py-4 pl-2 md:pl-8">
            <img src="/images/x.png" className="w-[25px] md:w-[50px]" />
            <span className="text-lg md:text-3xl font-bold">Twitter</span>
          </div>
          <img src="/images/x-wizard.png" className="h-[40px] md:h-[100px]" />
        </div>
      </Link>
    </footer>
  );
};
