import { Icons } from '@/components/icons';
import { MstCollection } from "./collection"
import { TrnPoint } from "./point"
import { PaginationParams } from "./query"

import { FilterParams } from "./query"
import { CreateCollectionRequest } from "./request"
import { MstStaker } from "./staker"

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

// Contoh kombinasi filter dan pagination
export interface CollectionQueryParams extends PaginationParams, FilterParams {
  minStakers?: number
}

// Utility type untuk operasi update
export type UpdateCollectionData = Partial<Omit<MstCollection, 'collection_id'>>
export type UpdateStakerData = Partial<Omit<MstStaker, 'staker_id'>>
export type UpdatePointData = Partial<Omit<TrnPoint, 'point_id'>>

// Schema validation (optional, bisa digunakan dengan zod)
export const collectionSchema = {
  collection_address: {
    type: 'string',
    optional: true,
    max: 255
  },
  collection_name: {
    type: 'string',
    optional: true,
    max: 100
  }
}

// Fungsi utility untuk validasi
export function validateCollection(data: CreateCollectionRequest): string[] {
  const errors: string[] = []

  if (data.collection_name && data.collection_name.length > 100) {
    errors.push('Collection name max 100 characters')
  }

  if (data.collection_address && data.collection_address.length > 255) {
    errors.push('Collection address max 255 characters')
  }

  return errors
}

// Helper type untuk aggregate query
export interface StakerPointAggregate {
  staker_id: number
  staker_address: string | null
  total_points: number
}

// Fungsi mapper untuk transformasi data
export function mapStakerWithPoints(
  staker: MstStaker,
  totalPoints: number
): StakerPointAggregate {
  return {
    staker_id: staker.staker_id,
    staker_address: staker.staker_address,
    total_points: totalPoints
  }
}


//stargaze interface
export interface FetchAllStargazeTokensOptions {
  owner: string; // Wallet address
  collectionAddress?: string; // Optional collection contract address
  maxTokens?: number; // Maximum number of tokens to fetch
  sortBy?: 'ACQUIRED_DESC' | 'ACQUIRED_ASC' | 'MINTED_DESC' | 'MINTED_ASC'; // Sorting options
}

export interface Token {
  id: string;
  tokenId: string;
  name: string;
  mintedAt: string;
  collection: {
    name: string;
    contractAddress: string;
  };
  traits: Array<{
    name: string;
    value: string;
    rarityPercent: number;
    rarity: string;
  }>;
  media: Array<{
    url: string;
    type: string;
  }>;
}

interface PageInfo {
  total: number;
  limit: number;
  offset: number;
}

export interface OwnedTokensResponse {
  tokens: Token[];
  pageInfo: PageInfo;
}