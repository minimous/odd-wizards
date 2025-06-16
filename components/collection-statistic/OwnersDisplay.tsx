// components/nft-collections/OwnersDisplay.jsx
import { formatNumber } from '@/lib/formatters';
import React from 'react';

const OwnersDisplay = ({ 
  count, 
  unique,
  align = "right" 
}: { count: number, unique: number, align?: string }) => {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={alignClass}>
      <div className="text-white font-medium">
        {formatNumber(count)}
      </div>
      <div className="text-xs text-gray-400 mt-0.5">
        {unique}% Unique
      </div>
    </div>
  );
};

export default OwnersDisplay;