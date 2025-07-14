// components/nft-collections/OwnersDisplay.jsx
import { formatNumber } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import React from 'react';

const OwnersDisplay = ({
  count,
  unique,
  align = 'right'
}: {
  count: number;
  unique: number;
  align?: string;
}) => {
  const alignClass =
    align === 'right'
      ? 'justify-end'
      : align === 'center'
      ? 'justify-center'
      : 'justify-start';

  return (
    <div className={cn('flex items-center ', alignClass)}>
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-white md:text-base">
          {formatNumber(count)}
        </div>
        {/* <div className="text-xs text-gray-400 mt-0.5">
          {unique}% Unique
        </div> */}
      </div>
    </div>
  );
};

export default OwnersDisplay;
