import { MstStaker } from "./staker"

export interface MstCollection {
    collection_id: number
    collection_address: string | null
    collection_name: string | null
    collection_description: string | null
    mst_staker?: MstStaker[]
}