"use client";
import { useState, useRef, useEffect } from "react";

const StakeSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const maxValue = 100; // Maximum slider position

  useEffect(() => {
    // Update slider width when component mounts or resizes
    const updateWidth = () => {
      if (sliderRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth - 100);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left; // Cursor position relative to slider
    const clampedValue = Math.min(Math.max(offsetX, 0), sliderWidth); // Constrain value within slider width
    setSliderPosition((clampedValue / sliderWidth) * maxValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    if (sliderPosition === maxValue) {
      handleAction();
    } else {
      setSliderPosition(0); // Reset position if not reaching far right
    }
  };

  const handleAction = () => {
    alert("Stake action triggered! 🎉");
  };

  return (
    <div
      ref={sliderRef}
      className="relative w-full h-16 bg-black rounded-2xl flex items-center overflow-hidden mt-2"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsDragging(false);
        if (sliderPosition < maxValue) setSliderPosition(0);
      }}
    >
      {/* Background Bar */}
      <div className="absolute top-0 left-0 h-full w-full bg-black rounded-2xl" />

      {/* Chevron (arrow right) */}
      <div
        className="absolute left-1 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-14 h-14 overflow-hidden rounded-2xl cursor-pointer z-10"
        style={{
          transform: `translate(${(sliderPosition / maxValue) * sliderWidth}px, -50%)`,
          transition: !isDragging && sliderPosition < maxValue ? "transform 0.3s ease" : "none",
        }}
        onMouseDown={handleMouseDown}
      >
        <img src="/images/icon/Swipe.png" alt="Swipe" className="h-16 max-w-max rounded-2xl" />
      </div>

      {/* Text */}
      <span className="absolute inset-0 flex items-center ml-24 text-white text-lg font-medium">
        {sliderPosition === maxValue ? "Staked!" : "Stake Now"}
      </span>
    </div>
  );
};

export default StakeSlider;