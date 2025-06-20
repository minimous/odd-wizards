// components/nft-collections/ForSaleDisplay.jsx
import React from 'react';

const ForSaleDisplay = ({ 
  percentage, 
  count,
  align = "right" 
}: { percentage: number, count: number, align?: string }) => {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={alignClass}>
      <div className="text-white font-medium">
        {count}
      </div>
      {/* <div className="text-xs text-gray-400 mt-0.5">
        {percentage}%
      </div> */}
    </div>
  );
};

export default ForSaleDisplay;