import { MstCollection } from "./collection"
import { TrnPoint } from "./point"

export interface MstStaker {
    staker_id: number
    staker_address: string | null
    staker_collection_id: string | null
    staker_lastclaim_date: Date | null
    created_date: Date | null
    updated_date: Date | null
    collection?: MstCollection
    trn_point?: TrnPoint[]
  }