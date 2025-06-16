// components/nft-collections/VolumeDisplay.jsx
import { formatPercentageChange, formatVolume } from '@/lib/formatters';
import React from 'react';

const VolumeDisplay = ({ 
  value, 
  change,
  align = "right" 
}: {value: number, change: number, align?: string}) => {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  const changeFormatted = formatPercentageChange(change);

  return (
    <div className={alignClass}>
      <div className="text-white font-medium">
        {formatVolume(value)}
      </div>
      {change !== null && (
        <div className={`text-xs mt-0.5 ${changeFormatted.colorClass}`}>
          {changeFormatted.text}
        </div>
      )}
    </div>
  );
};

export default VolumeDisplay;