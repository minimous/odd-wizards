'use client';

import Banner from "@/components/home/Banner";
import HeaderV2 from "@/components/layout/headerV2";
import axios from "axios";
import { useEffect, useState } from "react";

export default function HomePage() {

    const [banners, setBanners] = useState<any[] | []>([{
        "banner_image": "https://s9oawqeuub.ufs.sh/f/Ae0rhpcXcgiTFCiheDZdliOCodsxKvZgQHNrSD7Lp0hTekVj",
        "banner_type": "I"
    }]);
    // const [avatars, setAvatars] = useState<any[] | []>([]);
    // const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        async function fetchData() {
            // const resp = await axios.get("/api/user/list");
            // const { users, total } = resp.data.data;
            // setTotal(total);
            // setAvatars(users.map((user: any) => {
            //     return {
            //         imageUrl: user.user_image_url,
            //         profileUrl: "/p/" + user.user_address
            //     }
            // }));

            const timestamp = new Date().getTime();
            const respBanners = await axios.get(`/api/banners?t=${timestamp}`);
            setBanners(respBanners.data.data);
        }

        fetchData();
    }, []);

    return (<div>
        <HeaderV2 />
        <Banner items={banners} />
    </div>);
}