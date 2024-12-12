"use client"
import { useState } from 'react';

export interface TabsGalleryProps {
    tabs: {id: string, icon: string, label: string}[]
    activeTab: string
    setActiveTab: (id: string) => void
}

const TabsGallery = ({ tabs, activeTab, setActiveTab }: TabsGalleryProps) => {

    const [activeIndex, setActiveIndex]= useState<number>(0);

  return (
    <div className="relative flex justify-center items-center">
      <div className="relative flex space-x-14">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`cursor-pointer flex flex-col items-center`}
            onClick={() => {
                setActiveIndex(index);
                setActiveTab(tab.id)
            }}
          >
            <img
              src={tab.icon}
              alt={tab.label}
              className="h-20 w-20" // Ukuran ikon
            />
          </div>
        ))}
        {/* Garis indikator */}
        <div
          className="absolute -left-14 -bottom-5 h-1 w-20 bg-white transition-transform duration-300"
          style={{
            transform: `translateX(${activeIndex * 8.5}rem)`,
          }}
        />
      </div>
    </div>
  );
};

export default TabsGallery;
