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
    <div className="relative flex justify-center items-center py-4">
      <div className="relative flex gap-x-8">
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
              className="h-24 w-24" // Ukuran ikon
            />
          </div>
        ))}
        {/* Garis indikator */}
        <div
          className="absolute left-3 -bottom-5 h-1 w-20 bg-white transition-transform duration-300"
          style={{
            transform: `translateX(${activeIndex * 8.25}rem)`,
          }}
        />
      </div>
    </div>
  );
};

export default TabsGallery;
