// hooks/useMarketplaceCollections.ts
import { CollectionMinMaxFilters } from '@/lib/stargaze/stargaze-service';
import { ApiResponse, FormattedCollection } from '@/types/marketplace';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseMarketplaceCollectionsState {
  collections: FormattedCollection[];
  loading: boolean;
  loadingMore: boolean; // New state for loading more
  error: string | null;
  pageInfo: {
    total: number;
    offset: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
}

interface UseMarketplaceCollectionsFilters {
  activeFilter: string;
  view: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc' | null;
  searchQuery: string;
  categories: string[];
  minMaxFilters: CollectionMinMaxFilters;
  filterByDenoms: string[];
  filterByVerified: boolean;
  offset: number;
  limit: number;
}

interface UseMarketplaceCollectionsReturn
  extends UseMarketplaceCollectionsState {
  // Filter states
  activeFilter: string;
  view: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc' | null;
  searchQuery: string;
  categories: string[];
  minMaxFilters: CollectionMinMaxFilters;
  filterByDenoms: string[];
  filterByVerified: boolean;
  offset: number;
  limit: number;

  // Actions
  setSortby: (sortBy: string) => void;
  setActiveFilter: (filter: string) => void;
  setView: (view: string) => void;
  handleSort: (column: string) => void;
  setSearchQuery: (query: string) => void;
  setCategories: (categories: string[]) => void;
  setMinMaxFilters: (filters: CollectionMinMaxFilters) => void;
  setFilterByDenoms: (denoms: string[]) => void;
  setFilterByVerified: (verified: boolean) => void;
  setOffset: (offset: number) => void;
  setLimit: (limit: number) => void;

  // Utility functions
  fetchCollections: (append?: boolean) => Promise<void>;
  refreshCollections: () => Promise<void>;
  loadMoreCollections: () => Promise<void>; // New function
  resetFilters: () => void;

  // Computed values
  totalCollections: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  filteredCollections: FormattedCollection[];
}

const SORT_MAPPING: Record<string, string> = {
  volume24h: 'VOLUME_USD_24_HOUR_DESC',
  volume7d: 'VOLUME_USD_7_DAY_DESC',
  volume30d: 'VOLUME_USD_30_DAY_DESC',
  floor: 'FLOOR_PRICE_DESC',
  floorPrice: 'FLOOR_PRICE_DESC',
  name: 'NAME_ASC',
  owners: 'NUM_OWNERS_DESC',
  listed: 'LISTED_TOKENS_DESC',
  forSale: 'LISTED_TOKENS_DESC',
  bestOffer: 'BEST_OFFER_DESC',
  volume: 'VOLUME_USD_7_DAY_DESC'
};

const DEFAULT_FILTERS: UseMarketplaceCollectionsFilters = {
  activeFilter: '7D',
  view: 'list',
  sortBy: 'volume24h',
  sortOrder: 'desc',
  searchQuery: '',
  categories: [],
  minMaxFilters: {},
  filterByDenoms: [],
  filterByVerified: false,
  offset: 0,
  limit: 50
};

// API service class
class CollectionsApiService {
  private readonly baseUrl = '/api/marketplace/collections/stargaze';

  async getCollections(params: Record<string, any> = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v.toString()));
        } else if (typeof value === 'object') {
          queryParams.append(key, JSON.stringify(value));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const url = `${this.baseUrl}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }

    return result;
  }
}

export const useMarketplaceCollections = (
  initialParams?: Partial<UseMarketplaceCollectionsFilters>
): UseMarketplaceCollectionsReturn => {
  // State management
  const [state, setState] = useState<UseMarketplaceCollectionsState>({
    collections: [],
    loading: false,
    loadingMore: false,
    error: null,
    pageInfo: null
  });

  // Filter states
  const [filters, setFilters] = useState<UseMarketplaceCollectionsFilters>({
    ...DEFAULT_FILTERS,
    ...initialParams
  });

  // API service instance
  const apiService = useMemo(() => new CollectionsApiService(), []);

  // Build GraphQL sort parameter
  const getGraphQLSortBy = useCallback(() => {
    if (!filters.sortBy) {
      return 'VOLUME_USD_7_DAY_DESC'; // default
    }

    const baseSort = SORT_MAPPING[filters.sortBy] || 'VOLUME_USD_7_DAY_DESC';

    // Handle ascending order by replacing DESC with ASC
    if (filters.sortOrder === 'asc' && baseSort.includes('DESC')) {
      return baseSort.replace('DESC', 'ASC');
    }

    return baseSort;
  }, [filters.sortBy, filters.sortOrder]);

  // Fetch collections function with append option
  const fetchCollections = useCallback(
    async (append: boolean = false) => {
      // Set appropriate loading state
      if (append) {
        setState((prev) => ({ ...prev, loadingMore: true, error: null }));
      } else {
        setState((prev) => ({ ...prev, loading: true, error: null }));
      }

      try {
        const params = {
          offset: filters.offset,
          limit: filters.limit,
          sortBy: getGraphQLSortBy(),
          searchQuery: filters.searchQuery || undefined,
          filterByCategories:
            filters.categories.length > 0 ? filters.categories : undefined,
          minMaxFilters:
            Object.keys(filters.minMaxFilters).length > 0
              ? filters.minMaxFilters
              : undefined,
          filterByDenoms:
            filters.filterByDenoms.length > 0
              ? filters.filterByDenoms
              : undefined,
          filterByVerified: filters.filterByVerified
        };

        const response = await apiService.getCollections(params);

        if (response.data) {
          setState((prev) => ({
            ...prev,
            collections: append
              ? [...prev.collections, ...response.data!.collections] // Append new collections
              : response.data!.collections, // Replace collections
            pageInfo: response.data!.pageInfo,
            loading: false,
            loadingMore: false
          }));
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch collections';
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
          loadingMore: false
        }));
      }
    },
    [apiService, filters, getGraphQLSortBy]
  );

  // New function specifically for loading more collections
  const loadMoreCollections = useCallback(async () => {
    if (state.loadingMore || !state.pageInfo?.hasNextPage) return;

    // Calculate next offset
    const nextOffset = filters.offset + filters.limit;

    // Temporarily update offset for this request
    const tempFilters = { ...filters, offset: nextOffset };

    try {
      setState((prev) => ({ ...prev, loadingMore: true, error: null }));

      const params = {
        offset: nextOffset,
        limit: filters.limit,
        sortBy: getGraphQLSortBy(),
        searchQuery: filters.searchQuery || undefined,
        filterByCategories:
          filters.categories.length > 0 ? filters.categories : undefined,
        minMaxFilters:
          Object.keys(filters.minMaxFilters).length > 0
            ? filters.minMaxFilters
            : undefined,
        filterByDenoms:
          filters.filterByDenoms.length > 0
            ? filters.filterByDenoms
            : undefined,
        filterByVerified: filters.filterByVerified
      };

      const response = await apiService.getCollections(params);

      if (response.data) {
        setState((prev) => ({
          ...prev,
          collections: [...prev.collections, ...response.data!.collections],
          pageInfo: response.data!.pageInfo,
          loadingMore: false
        }));

        // Update the offset in filters
        setFilters((prev) => ({ ...prev, offset: nextOffset }));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load more collections';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loadingMore: false
      }));
    }
  }, [
    apiService,
    filters,
    getGraphQLSortBy,
    state.loadingMore,
    state.pageInfo
  ]);

  // Auto-fetch when filters change (but not offset changes from loadMore)
  const [previousFiltersRef, setPreviousFiltersRef] = useState(filters);

  useEffect(() => {
    // Check if filters other than offset have changed
    const filtersChanged =
      previousFiltersRef.activeFilter !== filters.activeFilter ||
      previousFiltersRef.view !== filters.view ||
      previousFiltersRef.sortBy !== filters.sortBy ||
      previousFiltersRef.sortOrder !== filters.sortOrder ||
      previousFiltersRef.searchQuery !== filters.searchQuery ||
      JSON.stringify(previousFiltersRef.categories) !==
        JSON.stringify(filters.categories) ||
      JSON.stringify(previousFiltersRef.minMaxFilters) !==
        JSON.stringify(filters.minMaxFilters) ||
      JSON.stringify(previousFiltersRef.filterByDenoms) !==
        JSON.stringify(filters.filterByDenoms) ||
      previousFiltersRef.filterByVerified !== filters.filterByVerified ||
      previousFiltersRef.limit !== filters.limit;

    // If filters changed or offset is 0 (reset), fetch from beginning
    if (filtersChanged || filters.offset === 0) {
      fetchCollections(false);
    }

    setPreviousFiltersRef(filters);
  }, [filters, fetchCollections]);

  // Filter actions - modified to reset collections when filters change
  const setActiveFilter = useCallback((filter: string) => {
    setFilters((prev) => ({ ...prev, activeFilter: filter, offset: 0 }));
    setState((prev) => ({ ...prev, collections: [] })); // Clear collections
  }, []);

  const setView = useCallback((view: string) => {
    setFilters((prev) => ({ ...prev, view }));
  }, []);

  const setSortby = useCallback((sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortOrder: 'desc' }));
    setFilters((prev) => ({ ...prev, sortBy }));
    setState((prev) => ({ ...prev, collections: [] })); // Clear collections
  }, []);

  const handleSort = useCallback((column: string) => {
    setFilters((prev) => {
      let newSortBy = prev.sortBy;
      let newSortOrder = prev.sortOrder;

      if (prev.sortBy === column) {
        // Jika kolom yang sama diklik, siklus: asc -> desc -> null
        if (prev.sortOrder === 'asc') {
          newSortOrder = 'desc';
        } else if (prev.sortOrder === 'desc') {
          newSortBy = getGraphQLSortBy(); // Hapus sort
          newSortOrder = null;
        }
      } else {
        // Jika kolom berbeda, mulai dengan asc
        newSortBy = column;
        newSortOrder = 'asc';
      }

      return {
        ...prev,
        sortBy: newSortBy,
        sortOrder: newSortOrder,
        offset: 0
      };
    });
    setState((prev) => ({ ...prev, collections: [] })); // Clear collections
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query, offset: 0 }));
    setState((prev) => ({ ...prev, collections: [] })); // Clear collections
  }, []);

  const setCategories = useCallback((categories: string[]) => {
    setFilters((prev) => ({ ...prev, categories, offset: 0 }));
    setState((prev) => ({ ...prev, collections: [] })); // Clear collections
  }, []);

  const setMinMaxFilters = useCallback(
    (minMaxFilters: CollectionMinMaxFilters) => {
      setFilters((prev) => ({ ...prev, minMaxFilters, offset: 0 }));
      setState((prev) => ({ ...prev, collections: [] })); // Clear collections
    },
    []
  );

  const setFilterByDenoms = useCallback((denoms: string[]) => {
    setFilters((prev) => ({ ...prev, filterByDenoms: denoms, offset: 0 }));
    setState((prev) => ({ ...prev, collections: [] })); // Clear collections
  }, []);

  const setFilterByVerified = useCallback((verified: boolean) => {
    setFilters((prev) => ({ ...prev, filterByVerified: verified, offset: 0 }));
    setState((prev) => ({ ...prev, collections: [] })); // Clear collections
  }, []);

  const setOffset = useCallback((offset: number) => {
    setFilters((prev) => ({ ...prev, offset }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, offset: 0 }));
    setState((prev) => ({ ...prev, collections: [] })); // Clear collections
  }, []);

  // Utility functions
  const refreshCollections = useCallback(async () => {
    setState((prev) => ({ ...prev, collections: [] })); // Clear collections
    setFilters((prev) => ({ ...prev, offset: 0 })); // Reset offset
    await fetchCollections(false);
  }, [fetchCollections]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setState((prev) => ({ ...prev, collections: [] })); // Clear collections
  }, []);

  // Computed values
  const totalCollections = useMemo(
    () => state.pageInfo?.total || 0,
    [state.pageInfo]
  );

  const hasNextPage = useMemo(() => {
    return state.pageInfo?.hasNextPage || false;
  }, [state.pageInfo]);

  const hasPreviousPage = useMemo(() => {
    return state.pageInfo?.hasPreviousPage || false;
  }, [state.pageInfo]);

  // Client-side filtered collections (for additional filtering if needed)
  const filteredCollections = useMemo(() => {
    let filtered = [...state.collections];

    // Add any additional client-side filtering logic here if needed
    // For example, additional filters not supported by the API

    return filtered;
  }, [state.collections]);

  return {
    // State
    collections: state.collections,
    loading: state.loading,
    loadingMore: state.loadingMore,
    error: state.error,
    pageInfo: state.pageInfo,

    // Filter states
    activeFilter: filters.activeFilter,
    view: filters.view,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    searchQuery: filters.searchQuery,
    categories: filters.categories,
    minMaxFilters: filters.minMaxFilters,
    filterByDenoms: filters.filterByDenoms,
    filterByVerified: filters.filterByVerified,
    offset: filters.offset,
    limit: filters.limit,

    // Actions
    setSortby,
    setActiveFilter,
    setView,
    handleSort,
    setSearchQuery,
    setCategories,
    setMinMaxFilters,
    setFilterByDenoms,
    setFilterByVerified,
    setOffset,
    setLimit,

    // Utility functions
    fetchCollections,
    refreshCollections,
    loadMoreCollections,
    resetFilters,

    // Computed values
    totalCollections,
    hasNextPage,
    hasPreviousPage,
    filteredCollections
  };
};

// Updated pagination hook
export const useMarketplacePagination = (
  collections: UseMarketplaceCollectionsReturn
) => {
  const goToNextPage = useCallback(() => {
    if (collections.hasNextPage) {
      collections.setOffset(collections.offset + collections.limit);
    }
  }, [collections]);

  const goToPreviousPage = useCallback(() => {
    if (collections.hasPreviousPage) {
      const newOffset = Math.max(0, collections.offset - collections.limit);
      collections.setOffset(newOffset);
    }
  }, [collections]);

  const goToPage = useCallback(
    (page: number) => {
      const newOffset = (page - 1) * collections.limit;
      collections.setOffset(newOffset);
    },
    [collections]
  );

  // Load more function for infinite scroll
  const loadMore = useCallback(() => {
    collections.loadMoreCollections();
  }, [collections]);

  const currentPage = useMemo(() => {
    return Math.floor(collections.offset / collections.limit) + 1;
  }, [collections.offset, collections.limit]);

  const totalPages = useMemo(() => {
    return Math.ceil(collections.totalCollections / collections.limit);
  }, [collections.totalCollections, collections.limit]);

  return {
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    loadMore, // New function for infinite scroll
    hasNextPage: collections.hasNextPage,
    hasPreviousPage: collections.hasPreviousPage,
    loadingMore: collections.loadingMore
  };
};
