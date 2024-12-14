interface Price {
    amount: string;
    amountUsd: number;
    denom: string;
    symbol: string;
    rate: number;
    nativeConversion: null;
}

interface HighestOffer {
    offerPrice: Price;
}

interface TokenCounts {
    listed: number;
    active: number;
}

interface Stats {
    bestOffer: string;
    bestOfferUsd: number;
    collectionAddr: string;
    change24HourPercent: number;
    change7DayPercent: number;
    volume24Hour: null | string;
    volume7Day: string;
    volumeUsd24hour: number;
    volumeUsd7day: number;
    numOwners: number;
    uniqueOwnerPercent: number;
}

interface Provenance {
    chainId: string;
}

export interface CollectionStat {
    creationTime: string;
    contractAddress: string;
    floor: Price;
    highestOffer: HighestOffer;
    startTradingTime: string;
    tokenCounts: TokenCounts;
    stats: Stats;
    provenance: Provenance[];
}
