'use client';
import StakeSection from '@/components/home/StakeSection';
import Carousel from '@/components/Carausel';
import Leaderboard from '@/components/Leaderboard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Footer } from '@/components/layout/footer';
import Snowfall from 'react-snowfall';
import HeaderV2 from '@/components/layout/headerV2';

export default function About() {
  return (
    <div className="relative w-full bg-[url('/images/About.gif')] bg-cover bg-center">
      <div className="h-[calc(100vh-150px)] p-4 md:!p-8 ">
        <div className="absolute bottom-0 left-0 right-0 top-0 z-0 bg-black/40" />
        {/* <HeaderV2 /> */}
        <div className="relative flex h-full items-center justify-center">
          {/* <img src="/images/about.gif" className="absolute top-0 z-0 w-full" /> */}
          <div className="mt-20 w-full px-10 text-center md:!mt-28 md:!px-40">
            <div className="relative my-6 hidden justify-center text-center text-xl font-bold md:!flex md:text-3xl">
              There is no challenge right now, stay tuned!
            </div>
            <div className="relative text-center text-xl font-bold md:hidden">
              There is no challenge
            </div>
            <div className="relative text-center text-xl font-bold md:hidden">
              right now, stay tuned!
            </div>
          </div>
        </div>
      </div>
      <Footer className="my-0 py-8 md:!my-0" />
    </div>
  );
}
