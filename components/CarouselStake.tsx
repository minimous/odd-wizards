"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Carousel Component
interface ImageData {
  src: string;
  alt: string;
}

interface CarouselStakeProps {
  images: ImageData[];
  interval?: number; // Optional interval for auto-slide (default: 3000ms)
}

const CarouselStake: React.FC<CarouselStakeProps> = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(autoSlide);
  }, [images.length, interval]);

  const getPositionStyle = (index: number) => {
    const relativeIndex =
      (index - currentIndex + images.length) % images.length;

    if (relativeIndex === 0) {
      return "z-30 transform scale-110 translate-x-0 opacity-100";
    } else if (relativeIndex === 1) {
      return "z-20 transform scale-100 translate-x-[50px] opacity-80";
    } else if (relativeIndex === 2) {
      return "z-10 transform scale-95 translate-x-[120px] opacity-60";
    } else if (relativeIndex === images.length - 1) {
      return "z-20 transform scale-100 -translate-x-[50px] opacity-80";
    } else if (relativeIndex === images.length - 2) {
      return "z-10 transform scale-95 -translate-x-[120px] opacity-60";
    } else {
      return "hidden";
    }
  };

  return (
    <div className="relative w-full h-[190px] overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`absolute transition-all duration-700 ease-in-out ${getPositionStyle(
              index
            )}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={150} // Lebar gambar lebih kecil
              height={150} // Tinggi gambar lebih kecil
              className="rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselStake;
