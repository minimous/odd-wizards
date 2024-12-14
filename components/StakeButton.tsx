"use client";
import getConfig from "@/config/config";
import { useChain, useWallet } from "@cosmos-kit/react";
import axios, { AxiosResponse } from "axios";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useClaim } from "@/hooks/useClaim";
import confetti from "canvas-confetti";

const StakeSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const maxValue = 100; // Maximum slider position
  const config = getConfig();
  const { address } = useChain("stargaze");
  const { toast, promiseToast } = useToast();
  const { setClaim } = useClaim();

  useEffect(() => {
    // Responsive width calculation
    const calculateSliderWidth = () => {
      if (sliderRef.current) {
        // Calculate based on percentage of total width
        const totalWidth = sliderRef.current.offsetWidth;
        const chevronWidth = chevronRef.current ? chevronRef.current.offsetWidth : 56; // Default to 56px if not available

        // Calculate width dynamically, leaving space for chevron and some padding
        const availableWidth = totalWidth - (chevronWidth * 1.5);

        setSliderWidth(availableWidth + 15);
      }
    };

    // Initial calculation
    calculateSliderWidth();

    // Recalculate on window resize
    window.addEventListener('resize', calculateSliderWidth);

    return () => {
      window.removeEventListener('resize', calculateSliderWidth);
    };
  }, []);

  useEffect(() => {
    if (sliderPosition === maxValue) {
      handleAction();
    }

  }, [sliderPosition])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    // Prevent text selection and default drag behavior
    e.preventDefault();
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
    } else {
      setSliderPosition(0); // Reset position if not reaching far right
    }
  };

  const handleAction = async () => {
    try {
      setClaim(false);
      promiseToast(axios.post("/api/soft-staking/create", {
        staker_address: address,
        collection_address: config?.collection_address
      }), {
        loading: {
          title: "Processing...",
          description: "Please Wait"
        },
        success: (result) => {
          setClaim(true);
          showConfeti();
          return {
            title: "Success!",
            // description: `Operation completed: ${result}`
            description: `Stake Successfuly`
          }
        },
        error: (error) => ({
          title: "Error",
          description: error.message
        })
      });

    } catch (error: AxiosResponse | any) {
      toast({
        variant: 'destructive',
        title: 'Ups! Something wrong.',
        description: error?.response?.data?.message || 'Internal server error.'
      });
    }

  };

  const showConfeti = () => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
      });
    }
  }

  return (
    <div>
      <div
        ref={sliderRef}
        className={`
        relative w-full h-16 bg-black rounded-2xl flex items-center overflow-hidden
        ${isDragging ? 'cursor-grabbing' : 'cursor-default'}
      `}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          if (sliderPosition < maxValue) setSliderPosition(0);
        }}
      >
        {/* Background Bar with Gradient */}
        <div
          className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-black via-gray-900 to-black opacity-80 rounded-2xl"
          style={{
            backgroundSize: `${(sliderPosition / maxValue) * 100}% 100%`,
            transition: 'background-size 0.3s ease-out'
          }}
        />

        {/* Chevron (arrow right) */}
        <div
          ref={chevronRef}
          className={`
          absolute left-1 top-1/2 transform -translate-y-1/2 
          flex items-center justify-center w-14 h-14 
          overflow-hidden rounded-2xl z-10
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        `}
          style={{
            transform: `translate(${(sliderPosition / maxValue) * sliderWidth}px, -50%)`,
            transition: !isDragging && sliderPosition < maxValue
              ? "transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)"
              : "none",
            boxShadow: isDragging
              ? "0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)"
              : "0 2px 4px rgba(0,0,0,0.2)"
          }}
          onMouseDown={handleMouseDown}
        >
          <img
            src="/images/Icon/Swipe.png"
            alt="Swipe"
            className={`
            h-16 max-w-max rounded-2xl 
            transition-transform duration-200
            ${isDragging ? 'scale-95' : 'scale-100'}
          `}
          />
        </div>

        {/* Text */}
        <span
          className={`
          absolute inset-0 flex items-center ml-24 
          text-white text-lg font-medium
          transition-all duration-300
          ${sliderPosition === maxValue
              ? 'text-green-400 opacity-100'
              : 'opacity-80'}
        `}
        >
          {sliderPosition === maxValue ? "Staked!" : "Stake Now"}
        </span>
      </div>
    </div>
  );
};

export default StakeSlider;