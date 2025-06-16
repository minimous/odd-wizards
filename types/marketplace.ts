// Response types that match your TableRow component expectations
export interface FormattedPriceInfo {
    value: number;
    currency: string;
    usdValue?: number;
}

export interface FormattedCollection {
    contractAddress: string;
    name: string;
    description: string;
    imageUrl: string;
    floorPrice: FormattedPriceInfo;
    bestOffer: FormattedPriceInfo;
    volume: {
        value: number;
        change: number;
    };
    owners: {
        count: number;
        unique: number;
    };
    forSale: {
        percentage: number;
        count: number;
    };
    categories: string[];
    isExplicit: boolean;
}

export interface ApiResponse {
    success: boolean;
    data?: {
        collections: FormattedCollection[];
        pageInfo: {
            total: number;
            offset: number;
            limit: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    };
    error?: string;
}
