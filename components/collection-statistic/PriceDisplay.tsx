// components/nft-collections/PriceDisplay.jsx
import { formatCurrency } from '@/lib/formatters';
import { cn, formatDecimal } from '@/lib/utils';
import React from 'react';

interface PriceDisplayProps {
  value: number;
  currency: string;
  suffix?: string;
  align?: string;
  showCurrency?: boolean;
}

const PriceDisplay = ({
  value,
  currency,
  suffix = '',
  align = 'right',
  showCurrency = true
}: PriceDisplayProps) => {
  const alignClass =
    align === 'right'
      ? 'justify-end'
      : align === 'center'
      ? 'justify-center'
      : 'justify-start';

  return (
    <div className={cn('flex items-center ', alignClass)}>
      <div className="flex items-center gap-2">
        <div className="font-medium text-white">
          {formatDecimal(value)}
          {suffix && <span className="ml-0.5 text-xs">{suffix}</span>}
        </div>
        {showCurrency && (
          <div className="mt-0.5 text-xs text-gray-400">{currency}</div>
        )}
      </div>
    </div>
  );
};

export default PriceDisplay;
