"use client";
import { useState } from "react";

const StakeSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const maxValue = 100; // Posisi maksimum slider
  const sliderWidth = 256; // Lebar slider dalam piksel

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left; // Posisi kursor relatif terhadap slider
    const clampedValue = Math.min(Math.max(offsetX, 0), sliderWidth); // Membatasi nilai agar tetap dalam lebar slider
    setSliderPosition((clampedValue / sliderWidth) * maxValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    if (sliderPosition === maxValue) {
      handleAction();
    } else {
      setSliderPosition(0); // Reset posisi jika tidak mencapai paling kanan
    }
  };

  const handleAction = () => {
    alert("Stake action triggered! 🎉");
  };

  return (
    <div
      className="relative w-64 h-12 bg-black rounded-full flex items-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsDragging(false);
        if (sliderPosition < maxValue) setSliderPosition(0);
      }}
    >
      {/* Background Bar */}
      <div className="absolute top-0 left-0 h-full w-full bg-gray-800 rounded-full" />

      {/* Chevron (arrow right) */}
      <div
        className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 bg-black rounded-full border-2 border-green-500 cursor-pointer z-10"
        style={{
          transform: `translate(${(sliderPosition / maxValue) * sliderWidth}px, -50%)`,
          transition: !isDragging && sliderPosition < maxValue ? "transform 0.3s ease" : "none",
        }}
        onMouseDown={handleMouseDown}
      >
        <span className="text-green-500 text-xl">&raquo;</span>
      </div>

      {/* Text */}
      <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-medium">
        {sliderPosition === maxValue ? "Staked!" : "Slide to Stake"}
      </span>
    </div>
  );
};

export default StakeSlider;
