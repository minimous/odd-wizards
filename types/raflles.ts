// Base types without relations
export type RaffleBase = {
    raffle_id: number;
    raffle_start: Date | null;
    raffle_end: Date | null;
    raffle_price: number | null;
    raffle_price_type: string | null;
    raffle_max_ticket: number | null;
    raffle_created_by: string | null;
    raffle_created_date: Date | null;
  };
  
  export type RaffleRewardBase = {
    reward_id: number;
    reward_type: string | null;
    reward_amount: number | null;
    reward_name: string | null;
    reward_collection: string | null;
    reward_token_id: number | null;
    reward_token_img: string | null;
    reward_win_address: string | null;
    reward_raffle_id: number | null;
  };
  
  export type ParticipantBase = {
    participant_id: number;
    participant_address: string | null;
    participant_amount: number | null;
    participant_raffle_id: number | null;
    participant_created_date: Date | null;
  };
  
  // Types with relations
  export type Raffle = RaffleBase & {
    rewards: RaffleReward[];
    participants: Participant[];
  };
  
  export type RaffleReward = RaffleRewardBase & {
    raffle?: Raffle | null;
  };
  
  export type Participant = ParticipantBase & {
    raffle?: Raffle | null;
  };
  
  // Input types for creating new records
  export type CreateRaffleInput = Omit<RaffleBase, 'raffle_id'>;
  
  export type CreateRaffleRewardInput = Omit<RaffleRewardBase, 'reward_id'>;
  
  export type CreateParticipantInput = Omit<ParticipantBase, 'participant_id'>;
  
  // Update types
  export type UpdateRaffleInput = Partial<CreateRaffleInput>;
  
  export type UpdateRaffleRewardInput = Partial<CreateRaffleRewardInput>;
  
  export type UpdateParticipantInput = Partial<CreateParticipantInput>;