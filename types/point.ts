import { MstStaker } from "./staker"

export interface TrnPoint {
    point_id: number
    point_amount: number | null
    point_claim_date: Date | null
    point_staker_id: number | null
    staker?: MstStaker
}