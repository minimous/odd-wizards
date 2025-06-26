// General launchpad types that work for both Stargaze and Intergaze
export interface GeneralPriceInfo {
  amount: string;
  denom: string;
  symbol: string;
  exponent: number;
  amountUsd?: number;
}

export interface GeneralMintStage {
  id: string | number;
  name: string;
  type: string;
  presaleType?: string;
  status: string;
  startTime: number;
  endTime?: number;
  salePrice?: GeneralPriceInfo;
  discountPrice?: GeneralPriceInfo;
  addressTokenCounts?: {
    limit: number;
    mintable: number;
    minted: number;
  };
  stageCounts?: {
    limit: number;
    mintable: number;
    minted: number;
  };
  numMembers?: number;
  isMember?: boolean;
  proofs?: any[];
  burnConditions?: any;
}

export interface GeneralMinter {
  minterType?: string;
  minterAddress: string;
  mintableTokens: number;
  mintedTokens: number;
  airdroppedTokens?: number;
  numTokens?: number;
  existingTokens?: number;
  currentStage?: GeneralMintStage;
  mintStages?: GeneralMintStage[];
}

export interface GeneralCreator {
  address: string;
  name?: {
    name: string;
    records?: any[];
  };
}

export interface GeneralMedia {
  type: string;
  url: string;
  originalUrl?: string;
  height: number;
  width: number;
  visualAssets?: any;
  fallbackUrl?: string;
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
  floor?: GeneralPriceInfo;
  creator: GeneralCreator;
  royaltyInfo?: {
    sharePercent: number;
  };
  // Use union type to support both Stargaze (minterV2) and Intergaze (minter)
  minterV2?: GeneralMinter;
  minter?: GeneralMinter;
  startTradingTime: string;
  media: GeneralMedia;
}

export interface BannerWithLaunchpad {
  id: string;
  banner_id: number;
  banner_title: string;
  banner_creator: string;
  banner_network: 'stargaze' | 'intergaze';
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
  launchpad?: GeneralLaunchpad;
}
