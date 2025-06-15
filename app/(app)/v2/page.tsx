'use client';

import Banner from "@/components/home/Banner";
import FooterV2 from "@/components/layout/footerV2";
import HeaderV2 from "@/components/layout/headerV2";
import { Globe } from "@/components/magicui/globe";
import { AvatarCircles } from "@/components/ui/avatas-circle";
import { formatAmount } from "@/lib/utils";
import axios from "axios";
import { MoveRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {

    const [banners, setBanners] = useState<any[] | []>([{
        "banner_image": "https://s9oawqeuub.ufs.sh/f/Ae0rhpcXcgiTFCiheDZdliOCodsxKvZgQHNrSD7Lp0hTekVj",
        "banner_type": "I"
    }]);
    const [avatars, setAvatars] = useState<any[] | []>([]);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        async function fetchData() {
            const resp = await axios.get("/api/user/list");
            const { users, total } = resp.data.data;
            setTotal(total);
            setAvatars(users.map((user: any) => {
                return {
                    imageUrl: user.user_image_url,
                    profileUrl: "/p/" + user.user_address
                }
            }));

            const timestamp = new Date().getTime();
            const respBanners = await axios.get(`/api/banners?t=${timestamp}`);
            setBanners(respBanners.data.data);
        }

        fetchData();
    }, []);

    return (<div className="w-full h-full">
        <HeaderV2 />
        <Banner items={banners} />
        <div className="mt-32 px-8">
            <div className="bg-[#18181B] w-full h-full rounded-[10px]">
                <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg px-40 pb-40 pt-8 md:pb-60">
                    {/* Content div that stays static */}
                    <div className="relative z-10 max-w-max max-h-max w-full">
                        <h1 className="text-center text-3xl font-black md:text-5xl">
                            {formatAmount(total)} <span className="block md:!contents">Odds People!</span>
                        </h1>
                        <span className="text-lg text-white text-center block">
                            Stay Connected, from <span className="block md:!contents">all over the world</span>
                        </span>
                        <div className="mx-auto mt-4">
                            <AvatarCircles
                                className="justify-center mx-auto p-4 max-w-max rounded-full"
                                numPeople={99}
                                avatarUrls={avatars}
                            />
                        </div>
                    </div>
                    <div className="absolute top-[350px] top-[400px] transorm left-1/2 -translate-x-1/2 z-[999]">
                        <a href="" className="flex items-center gap-2">Go To Leaderboard <MoveRight /> 🏆</a>
                    </div>
                    <Globe className="top-[175px]" />
                    <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
                </div>
            </div>
        </div>
        <FooterV2 />
    </div>);
}