// components/nft-collections/TableHeader.jsx
import React from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';

interface TableHeaderProps {
  children: React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  sortBy?: string | null;
  sortOrder?: string | null;
  columnKey?: string;
  onSort?: Function;
  className?: string;
}

const TableHeader = ({
  children,
  sortable = false,
  align = 'left',
  sortBy,
  sortOrder,
  columnKey,
  onSort,
  className = ''
}: TableHeaderProps) => {
  const alignClasses = {
    left: 'text-left justify-start',
    center: 'text-center justify-center',
    right: 'text-right justify-end'
  };

  const isActive = ['volume24h', 'volume7d', 'volume30d'].includes(
    columnKey ?? ''
  );
  const alignClass = alignClasses[align];

  const handleClick = () => {
    if (sortable && onSort) {
      onSort(columnKey);
    }
  };

  return (
    <th
      className={`px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-400 ${
        sortable ? 'cursor-pointer hover:text-gray-300' : ''
      } ${className}`}
    >
      <div
        className={`flex items-center gap-1 ${alignClass}`}
        onClick={handleClick}
      >
        {children}
        {sortable && (
          <div className="flex flex-col">
            {isActive &&
              (sortOrder === 'asc' ? (
                <ArrowUp className="h-3 w-3 text-pink-400" />
              ) : (
                <ArrowDown className="h-3 w-3 text-pink-400" />
              ))}
          </div>
        )}
      </div>
    </th>
  );
};

export default TableHeader;
