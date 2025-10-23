// File: @/types/launchpad.ts

export interface Creator {
  address: string;
  name?: string;
}

export interface SalePrice {
  amount: string;
  denom: string;
  symbol: string;
  exponent: number;
}

export interface AddressTokenCounts {
  limit: number;
  mintable: number;
  minted: number;
}

export interface StageCounts {
  limit: number;
  mintable: number;
  minted: number;
}

export interface BurnConditions {
  // Define specific burn condition fields if needed
}

export interface MintStage {
  id: number;
  name: string;
  type: 'PRESALE' | 'PUBLIC';
  presaleType: 'REGULAR' | 'NONE';
  status: 'ACTIVE' | 'UPCOMING' | 'ENDED';
  startTime: string | number;
  endTime?: string | number;
  salePrice: SalePrice;
  discountPrice?: SalePrice;
  addressTokenCounts: AddressTokenCounts;
  stageCounts?: StageCounts;
  numMembers?: number;
  isMember: boolean;
  proofs: any[] | null;
  burnConditions?: BurnConditions | null;
}

export interface MinterV2 {
  minterType: string;
  minterAddress: string;
  mintableTokens: number;
  mintedTokens: number;
  airdroppedTokens: number;
  numTokens: number;
  currentStage?: MintStage;
  mintStages: MintStage[];
}

export interface Minter {
  minterType: string;
  minterAddress: string;
  mintableTokens: number;
  mintedTokens: number;
  airdroppedTokens: number;
  numTokens: number;
  existingTokens: number;
  currentStage?: MintStage;
  mintStages: MintStage[];
}

export interface VisualAsset {
  type: 'image';
  height: number;
  width: number;
  url: string;
  staticUrl: string;
}

export interface VisualAssets {
  lg: VisualAsset;
  md: VisualAsset;
  sm: VisualAsset;
  xl: VisualAsset;
  xs: VisualAsset;
}

export interface Media {
  type: 'image' | 'video';
  url: string;
  height: number;
  width: number;
  fallbackUrl: string;
  visualAssets: VisualAssets;
}

export interface RoyaltyInfo {
  // Define royalty info fields if needed
}

// Rarible-specific types
export interface RaribleCurrency {
  id: string;
  abbreviation: string;
  usdExchangeRate: string;
  icon?: string;
}

export interface RariblePrice {
  amount: string;
  currency: RaribleCurrency;
}

export interface RariblePhase {
  price: RariblePrice;
  startDate: string;
  endDate: string;
  maxMintPerWallet: number;
  type: 'allowlist' | 'public';
}

export interface RaribleFee {
  type: 'PERCENTAGE' | 'FIXED';
  amount: number;
}

export interface RaribleMedia {
  type: 'image' | 'video';
  url: string;
}

export interface GeneralLaunchpad {
  id: string;
  contractAddress: string;
  contractUri?: string;
  name: string;
  description: string;
  website?: string;
  isExplicit?: boolean;
  minterAddress?: string;
  featured?: boolean;
  floor?: any;
  creator: Creator;
  royaltyInfo?: RoyaltyInfo;

  // Different minter types for different networks
  minterV2?: MinterV2; // For Stargaze
  minter?: Minter; // For Intergaze and Rarible

  startTradingTime: string | number;
  media?: Media | RaribleMedia;

  // Rarible-specific fields
  tokenStandard?: string;
  totalSupply?: number;
  isVerified?: boolean;
  phases?: RariblePhase[];
  fees?: RaribleFee[];
  blockchain?: string;
}

export interface BannerWithLaunchpad {
  id: string;
  banner_id: number;
  banner_title: string;
  banner_creator: string;
  banner_network: 'stargaze' | 'intergaze' | 'hyperevm' | 'MegaETH Testnet';
  banner_image: string;
  banner_thumbnail?: string;
  banner_type: 'I' | 'V';
  banner_twiter?: string;
  banner_discord?: string;
  banner_collection_address?: string;
  banner_minted_date?: string;
  banner_minted_link?: string;
  banner_status: string;
  banner_seqn: number;
  banner_telegram: string;
  launchpad?: GeneralLaunchpad;
}
