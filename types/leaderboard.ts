export interface LeaderboardItem {
    collection_address: string;
    staker_address: string;
    staker_nft_staked: number;
    staker_red_flag: string;
    user_image_url: string | null;
    total_points: number;
    ranking: number;
};