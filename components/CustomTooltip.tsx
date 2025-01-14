import React from "react";

export interface CustomTooltipProps {
    message: string
}

const CustomTooltip = ({ message }: CustomTooltipProps) => {
  return (
    <div className="relative flex items-center">
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-[10px] shadow-lg">
        {message}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-t-[8px] border-t-red-600 border-x-[8px] border-x-transparent"></div>
      </div>
      
      {/* Trigger Icon */}
      <div className="flex items-center gap-2">
        <span className="text-white">1 NFT Staked</span>
        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default CustomTooltip;
