// components/nft-collections/TimeFilter.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { TIME_FILTER } from '@/constants/filterConstant';
import { cn } from '@/lib/utils';

const TimeFilter = ({
  loading,
  activeFilter,
  onFilterChange,
  className = ''
}: {
  loading: boolean;
  activeFilter: string;
  onFilterChange: Function;
  className?: string;
}) => {
  return (
    <div className={`flex gap-4 ${className}`}>
      {TIME_FILTER.map((filter) => (
        <a
          key={filter.key}
          onClick={() => {
            if (loading) return;
            onFilterChange(filter.key);
          }}
          className={cn(
            'cursor-pointer text-sm font-bold md:text-lg md:font-normal',
            activeFilter === filter.key ? 'text-white' : 'text-[#857F94]'
          )}
        >
          {filter.label}
        </a>
      ))}
    </div>
  );
};

export default TimeFilter;
