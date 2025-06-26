import React from 'react';
import TableHeader from './TableHeader';
import Header from './Header';
import {
  useMarketplaceCollections,
  useMarketplacePagination
} from '@/hooks/useFilterCollection';
import { FormattedCollection } from '@/types/marketplace';
import TableRow from './TableRow';
import SkeletonTableRow from './SkeletonTableRow';

const NFTCollectionsTable = () => {
  const collectionsHook = useMarketplaceCollections({
    limit: 10,
    sortBy: 'volume24h'
  });

  const {
    collections,
    loading,
    loadingMore,
    error,
    activeFilter,
    setActiveFilter,
    view,
    setView,
    sortBy,
    setSortby,
    sortOrder,
    handleSort,
    totalCollections,
    hasNextPage,
    filteredCollections
  } = collectionsHook;

  const pagination = useMarketplacePagination(collectionsHook);
  const { loadMore, currentPage, totalPages } = pagination;

  const handleFiltersClick = () => {
    console.log('Filters clicked');
  };

  const handleCollectionClick = (collection: FormattedCollection) => {
    const url = `https://www.stargaze.zone/m/${collection.contractAddress}/tokens`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSortClick = (columnKey: string) => {
    if (loadingMore) return;

    const sortMapping: Record<string, string> = {
      floorPrice: 'floor',
      bestOffer: 'bestOffer',
      volume: 'volume7d',
      owners: 'owners',
      forSale: 'listed'
    };

    const mappedKey = sortMapping[columnKey] || columnKey;
    handleSort(mappedKey);
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black p-6 text-white">
        <div className="flex h-64 items-center justify-center">
          <div className="text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      {/* Header */}
      <Header
        loading={loadingMore}
        totalCollections={totalCollections}
        activeFilter={sortBy}
        onFilterChange={setSortby}
        view={view}
        onViewChange={setView}
        onFiltersClick={handleFiltersClick}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-black">
        <table className="w-full">
          <thead className="border-b-2 border-[#15111D]">
            <tr>
              <TableHeader>Collection</TableHeader>
              <TableHeader
                align="right"
                sortable
                sortBy={sortBy}
                sortOrder={sortOrder}
                columnKey="floorPrice"
                onSort={handleSortClick}
              >
                Floor
              </TableHeader>
              <TableHeader
                align="right"
                sortable
                sortBy={sortBy}
                sortOrder={sortOrder}
                columnKey="bestOffer"
                onSort={handleSortClick}
              >
                Top Offer
              </TableHeader>
              <TableHeader
                align="right"
                sortable
                sortBy={sortBy}
                sortOrder={sortOrder}
                columnKey="owners"
                onSort={handleSortClick}
              >
                Owners
              </TableHeader>
              <TableHeader
                align="right"
                sortable
                sortBy={sortBy}
                sortOrder={sortOrder}
                columnKey="forSale"
                onSort={handleSortClick}
              >
                Listed
              </TableHeader>
              <TableHeader
                align="right"
                sortable
                sortBy={sortBy}
                sortOrder={sortOrder}
                columnKey="volume"
                onSort={handleSortClick}
              >
                Volume
              </TableHeader>
              <TableHeader
                align="right"
                // sortable
                // sortBy={sortBy}
                // sortOrder={sortOrder}
                // columnKey="volume"
                // onSort={handleSortClick}
              >
                %
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {/* Initial loading state - show skeleton rows */}
            {loading && collections.length === 0 && (
              <>
                {Array.from({ length: 10 }).map((_, index) => (
                  <SkeletonTableRow key={`skeleton-${index}`} />
                ))}
              </>
            )}

            {/* Show actual collections */}
            {collections.length > 0 && (
              <>
                {collections.map(
                  (collection: FormattedCollection, index: number) => (
                    <TableRow
                      key={collection.contractAddress || index}
                      collection={collection}
                      index={index}
                      onClick={handleCollectionClick}
                    />
                  )
                )}
              </>
            )}

            {/* Loading more state - show additional skeleton rows */}
            {loadingMore && (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonTableRow key={`loading-more-skeleton-${index}`} />
                ))}
              </>
            )}

            {/* No collections found */}
            {!loading && collections.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#857F94]">
                  No collections found
                </td>
              </tr>
            )}
          </tbody>
          {hasNextPage && (
            <tfoot>
              <tr>
                <td colSpan={7} className="py-4 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="cursor-pointer text-sm text-[#857F94] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading...' : 'See More...'}
                  </button>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default NFTCollectionsTable;
