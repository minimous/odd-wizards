import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Active, DataRef, Over } from '@dnd-kit/core';
import { ColumnDragData } from '@/components/kanban/board-column';
import { TaskDragData } from '@/components/kanban/task-card';
import { AttributesReward } from "@/types/attributes-reward";
import { GRAPHQL_ENDPOINT_STARGAZE, REWARD_PERIODE } from "@/constants";
import axios, { AxiosError } from "axios";
import { FetchAllStargazeTokensOptions, Token } from "@/types";


type DraggableData = ColumnDragData | TaskDragData;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Task') {
    return true;
  }

  return false;
}


export function formatAmount(amount: number | undefined | null) {
  if (!amount) return '0';
  return amount.toLocaleString('en-US'); // Menggunakan lokasi 'en-US' untuk memastikan koma sebagai pemisah ribuan
}


export default function calculatePoint(attrreward: AttributesReward, lastClaimDate?: Date): number {
  // Validate input
  if (!attrreward) return 0;
  
  // Get current time
  const currentTime = new Date();
  
  // If lastClaimDate is undefined, calculate for 1 full period
  if (!lastClaimDate) {
      switch(attrreward.attr_periode){
          case REWARD_PERIODE.MINUTE:
              return attrreward.attr_reward;
          
          case REWARD_PERIODE.HOUR:
              return attrreward.attr_reward;
          
          case REWARD_PERIODE.DAY:
              return attrreward.attr_reward;
          
          default:
              return 0;
      }
  }
  
  // Calculate time difference
  const timeDifferenceMs = currentTime.getTime() - lastClaimDate.getTime();
  
  // Calculate points based on reward period
  switch(attrreward.attr_periode){
      case REWARD_PERIODE.MINUTE:
          // Calculate points for minute-based rewards
          const minutesPassed = Math.floor(timeDifferenceMs / (1000 * 60));
          return Math.floor(minutesPassed * attrreward.attr_reward);
      
      case REWARD_PERIODE.HOUR:
          // Calculate points for hour-based rewards
          const hoursPassed = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
          return Math.floor(hoursPassed * attrreward.attr_reward);
      
      case REWARD_PERIODE.DAY:
          // Calculate points for day-based rewards
          const daysPassed = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
          return Math.floor(daysPassed * attrreward.attr_reward);
      
      default:
          // If an unknown period is provided, return 0
          return 0;
  }
}

export async function fetchAllStargazeTokens(options: FetchAllStargazeTokensOptions) {
  const {
    owner, // Wallet address
    collectionAddress, // Optional collection contract address
    maxTokens = Infinity,
    sortBy = 'ACQUIRED_DESC'
  } = options;

  const query = `
    query OwnedTokens(
      $owner: String, 
      $limit: Int, 
      $offset: Int, 
      $filterByCollectionAddrs: [String!], 
      $sortBy: TokenSort
    ) {
      tokens(
        ownerAddrOrName: $owner
        limit: $limit
        offset: $offset
        filterByCollectionAddrs: $filterByCollectionAddrs
        sortBy: $sortBy
      ) {
        tokens {
          id
          tokenId
          name
          mintedAt
          collection {
            name
            contractAddress
          }
          traits {
            name 
            value
            rarityPercent
            rarity
          }
          media {
            url
            type
          }
        }
        pageInfo {
          total
          limit
          offset
        }
      }
    }
  `;

  let allTokens: Token[] = [];
  let offset = 0;
  const limit = 100; // Recommended batch size

  while (true) {
    try {
      const response = await axios.post(GRAPHQL_ENDPOINT_STARGAZE, {
        query,
        variables: {
          owner,
          limit,
          offset,
          filterByCollectionAddrs: collectionAddress ? [collectionAddress] : null,
          sortBy
        }
      });

      const { tokens, pageInfo } = response.data.data.tokens;

      // Add fetched tokens to the collection
      allTokens = [...allTokens, ...tokens];

      // Check if we've reached the total number of tokens or maxTokens limit
      if (
        tokens.length === 0 || 
        offset + limit >= pageInfo.total || 
        allTokens.length >= maxTokens
      ) {
        break;
      }

      // Increment offset for next iteration
      offset += limit;

    } catch (error: AxiosError | any) {
      console.error('Error fetching Stargaze tokens:', error.response ? error.response.data : error.message);
      throw error;
    }

    // Optional: Add a small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Slice to maxTokens if necessary
  return allTokens.slice(0, maxTokens);
}