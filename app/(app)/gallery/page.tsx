"use client"
import Header from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import CollectionCard, { CollectionCardType } from "@/components/CollectionCard";
import TabsGallery from "@/components/TabsGallery";
import { useState } from "react";
import GenerateImage from "@/components/gallery/GenerateImage";

const collections: CollectionCardType[] = [
    {
        address: "stars1j9rk6fte8j2qlwx6qewxh6ezu83r0a290j4wemn0h0hjw37fn3wqvzan3s",
        image: "/images/Rebbits.png",
        imageGif: "/images/Rebbits.gif",
        name: "Rebbits"
    },
    {
        // address: "stars1j9rk6fte8j2qlwx6qewxh6ezu83r0a290j4wemn0h0hjw37fn3wqvzan3s",
        image: "/images/wizard-crown.png",
        imageGif: "/images/Odds-Wizard.gif",
        name: "Odds Wizard"
    },
    {
        address: "stars1jf25kwveccgyp0cz5ae5wyvve8m8j8qpyr0mvul2t09e84yrplvscef9xa",
        image: "/images/Steamland.png",
        imageGif: "/images/Steamland.gif",
        name: "Steamland"
    }
]

const tabs = [
    { id: "rebbits", icon: '/images/Rebbits.png', label: "Rebbits"},
    { id: "odds-wizard", icon: '/images/wizard-crown.png', label: "Odds Wizard" }, 
];


export default function Gallery() {

    const [activeTab, setActiveTab] = useState<string>("rebbits");

    return (
        <div className="relative bg-black w-full">
            <Header />
            <div className="min-h-screen flex items-center justify-center pt-28">
                <div className="grid grid-cols-1 md:!grid-cols-3 w-full px-10 md:!px-28">
                    {collections.map((item, index) => (
                        <CollectionCard
                            key={index}
                            data={item}
                        />
                    ))}
                </div>
            </div>
            <div className="my-20 text-center">
                <h1 className="text-2xl md:!text-6xl text-white font-black">Create something fun!</h1>
                <div className="mt-6">
                    <p className="text-sm md:!text-3xl text-gray-400 leading-tight">click “random” for unilimited possibilities</p>
                </div>
            </div>
            <div className="w-full">
                <TabsGallery tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                <GenerateImage collection={activeTab} />
            </div>
            <div className="bg-[url('/images/bg-line-grid.png')] bg-cover bg-center h-full py-16">
                <Footer className="my-0" />
            </div>
        </div>
    );
}
