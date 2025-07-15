// components/nft-collections/TableRow.jsx
import React from 'react';
import CollectionImage from './CollectionImage';
import PriceDisplay from './PriceDisplay';
import VolumeDisplay from './VolumeDisplay';
import OwnersDisplay from './OwnersDisplay';
import ForSaleDisplay from './ForSaleDisplay';
import { FormattedCollection } from '@/types/marketplace';

interface TableRow {
  collection: FormattedCollection;
  index: number;
  onClick: Function;
  className?: string;
}

const TableRow = ({ collection, index, onClick, className = '' }: TableRow) => {
  const handleRowClick = () => {
    if (onClick) {
      onClick(collection);
    }
  };

  return (
    <tr
      className={`transition-colors hover:bg-gray-800/30 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={handleRowClick}
    >
      {/* Collection Info */}
      <td className="sticky left-0 z-0 w-[150px] bg-black px-4 py-2 md:w-full">
        <div className="flex w-[135px] items-center gap-2 md:w-full">
          {/* <span className="text-gray-400 font-medium w-4 text-sm">
            {index + 1}
          </span> */}
          <CollectionImage
            src={collection.imageUrl}
            className="!h-8 !w-8 rounded-[6px] md:!h-10 md:!w-10 md:rounded-[10px]"
            alt={collection.name}
          />
          <span className="md:font-base truncate text-sm font-medium text-white">
            {collection.name}
          </span>
        </div>
      </td>

      {/* Floor Price */}
      <td className="w-[150px] px-4 py-2">
        <PriceDisplay
          value={collection.floorPrice.value}
          currency={collection.floorPrice.currency}
          align="right"
          // usdValue={collection.floorPrice.usdValue}
        />
      </td>

      {/* Best Offer */}
      <td className="px-4 py-2">
        <PriceDisplay
          value={collection.bestOffer.value}
          currency={collection.bestOffer.currency}
          align="right"
          // usdValue={collection.bestOffer.usdValue}
        />
      </td>

      {/* Owners */}
      <td className="px-4 py-2">
        <OwnersDisplay
          count={collection.owners.count}
          unique={collection.owners.unique}
        />
      </td>

      {/* For Sale */}
      <td className="px-4 py-2">
        <ForSaleDisplay
          percentage={collection.forSale.percentage}
          count={collection.forSale.count}
        />
      </td>

      {/* Volume */}
      <td className="px-4 py-2">
        <VolumeDisplay
          value={collection.volume.value}
          // change={collection.volume.change}
          align="right"
        />
      </td>
      <td className="px-4 py-2">
        <VolumeDisplay
          // value={collection.volume.value}
          change={collection.volume.change}
          align="right"
        />
      </td>
    </tr>
  );
};

export default TableRow;
