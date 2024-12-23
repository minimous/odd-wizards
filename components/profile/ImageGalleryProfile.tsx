"use client";
import { DEFAULT_IMAGE_PROFILE } from "@/constants";
import { cn } from "@/lib/utils";
import { Token } from "@/types";
import { Dot } from "lucide-react";
import { Button } from "../ui/button";
import ProfilePoper from "./ProfileProper";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";

export interface ImageGalleryProfileProps {
    address: string
    token: Token;
    allToken: Token[];
    size: "lg" | "md" | "sm"
}

export default function ImageGalleryProfile({ address, token, allToken, size }: ImageGalleryProfileProps) {

    const [index, setIndex] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);

    // Function to get image URL from token, fallback to default if not available
    const getImageUrl = (token: Token) => {
        return token?.media.url || DEFAULT_IMAGE_PROFILE;
    }

    const renderImageButton = (size: "lg" | "md" | "sm") => {
        switch (size) {
            case "lg":
                return (
                    <div className="w-full hidden group-hover:flex group-hover:scale-105 p-2 absolute h-[75px] -top-2 right-0 bg-gradient-to-b from-black/70 to-transparent">
                        <div className="w-full flex justify-end text-white">
                            <ProfilePoper address={address} token={token} position="bottom">
                                <Button variant={"ghost"} className="p-2 h-[20px] hover:bg-black/20" >
                                    <Dot size={8} strokeWidth={10} />
                                    <Dot size={8} strokeWidth={10} />
                                    <Dot size={8} strokeWidth={10} />
                                </Button>
                            </ProfilePoper>
                        </div>
                    </div>
                )
            case "md":
                return (
                    <div className="w-full hidden group-hover:flex group-hover:scale-105 p-1 absolute h-[65px] -top-2 right-0 bg-gradient-to-b from-black/70 to-transparent">
                        <div className="w-full flex justify-end text-white">
                            <ProfilePoper address={address} token={token} position="bottom">
                                <Button variant={"ghost"} className="p-2 h-[20px] hover:bg-black/20" >
                                    <Dot size={8} strokeWidth={10} />
                                    <Dot size={8} strokeWidth={10} />
                                    <Dot size={8} strokeWidth={10} />
                                </Button>
                            </ProfilePoper>
                        </div>
                    </div>
                )
            case "sm":
                return (
                    <div className="w-full hidden group-hover:flex group-hover:scale-105 p-1 absolute h-[55px] -top-2 right-0 bg-gradient-to-b from-black/70 to-transparent">
                        <div className="w-full flex justify-end text-white">
                            <ProfilePoper address={address} token={token} position="bottom">
                                <Button variant={"ghost"} className="p-1 h-[20px] hover:bg-black/20" >
                                    <Dot size={8} strokeWidth={10} />
                                    <Dot size={8} strokeWidth={10} />
                                    <Dot size={8} strokeWidth={10} />
                                </Button>
                            </ProfilePoper>
                        </div>

                    </div>
                )
        }
    }

    return (
        <div onClick={() => {setOpen(true)}} className="relative aspect-square group cursor-pointer">
            <img
                src={getImageUrl(token)}
                alt={`Token ${token?.name || 'Character'}`}
                className={cn("rounded-lg object-cover w-full h-full group-hover:scale-105", getImageUrl(token) == DEFAULT_IMAGE_PROFILE && "opacity-10")}
            />
            <Lightbox
                index={index}
                open={open}
                close={() => setOpen(false)}
                slides={allToken.map(item => {
                    return { src: item.media.url, alt: item.name }
                })}
                // render={{
                //     buttonPrev: () => null,
                //     buttonNext: () => null,
                // }}
            />
            {token && renderImageButton(size)}
        </div>
    )
}