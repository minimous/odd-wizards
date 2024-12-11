export interface CreateCollectionRequest {
    collection_address?: string
    collection_name?: string
    collection_description?: string
}

export interface CreateStakerRequest {
    staker_address?: string
    staker_collection_id?: string
    staker_lastclaim_date?: Date | string
}

export interface CreatePointRequest {
    point_amount?: number
    point_claim_date?: Date | string
    point_staker_id?: number
}