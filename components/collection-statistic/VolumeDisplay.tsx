// components/nft-collections/VolumeDisplay.jsx
import { formatPercentageChange, formatVolume } from '@/lib/formatters';
import React from 'react';

const VolumeDisplay = ({
  value,
  change,
  align = "right"
}: { value?: number, change?: number, align?: string }) => {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  const changeFormatted = change ? formatPercentageChange(change) : {colorClass: "", text: ""};

  return (
    <div className={alignClass}>
      {value && <div className="text-white font-medium">
        {formatVolume(value)}
      </div>
      }
      {change && (
        <div className={`font-medium ${changeFormatted.colorClass}`}>
          {changeFormatted.text}
        </div>
      )}
    </div>
  );
};

export default VolumeDisplay;