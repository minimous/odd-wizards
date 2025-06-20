// components/nft-collections/PriceDisplay.jsx
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import React from 'react';

interface PriceDisplayProps {
  value: number
  currency: string
  suffix?: string
  align?: string
  showCurrency?: boolean
}

const PriceDisplay = ({
  value,
  currency,
  suffix = "",
  align = "right",
  showCurrency = true
}: PriceDisplayProps) => {
  const alignClass = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';

  return (
    <div className={cn("flex items-center ", alignClass)}>
      <div className='flex items-center gap-2'>
        <div className="text-white font-medium">
          {formatCurrency(value, currency, suffix)}
          {suffix && <span className="text-xs ml-0.5">{suffix}</span>}
        </div>
        {showCurrency && (
          <div className="text-xs text-gray-400 mt-0.5">{currency}</div>
        )}
      </div>
    </div>
  );
};

export default PriceDisplay;