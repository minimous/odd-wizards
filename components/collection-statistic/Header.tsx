// components/layout/Header.jsx
import React, { MouseEvent } from 'react';
import { Filter } from 'lucide-react';
import TimeFilter from './TimeFilter';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

interface HeaderProps {
  loading: boolean;
  totalCollections: number;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  view: string;
  onViewChange: (view: string) => void;
  onFiltersClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const Header = ({
  loading,
  totalCollections,
  activeFilter,
  onFilterChange,
  view,
  onViewChange,
  onFiltersClick
}: HeaderProps) => {
  return (
    <div className="mb-2 flex items-center justify-between rounded-[10px] px-4 py-2">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <a className="cursor-pointer text-white md:text-xl">Trending</a>
        {/* <a className='text-sm text-[#857F94] cursor-pointer'>Holding</a> */}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* USD Toggle */}
        {/* <div className="flex items-center space-x-2">
                    <Label htmlFor="currency">USD</Label>
                    <Switch id="currency" />
                </div> */}

        {/* Time Filter */}
        <TimeFilter
          loading={loading}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
};

export default Header;
