import { mst_staker, mst_users } from '@prisma/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletConnection {
  address: string | null;
  isConnected: boolean;
  walletId: string | null;
  chainId: string | null;
  connectionType: 'custom' | 'cosmos-kit' | null;
}

export type UserWithWinner = mst_users & { is_winner: 'Y' | 'N' };

interface UserStore {
  // State
  user: UserWithWinner | null;
  staker: mst_staker | null;
  wallet: WalletConnection;
  isLoading: boolean;

  // Actions
  setUser: (user: UserWithWinner | null) => void;
  setStaker: (staker: mst_staker | null) => void;
  setWallet: (wallet: Partial<WalletConnection>) => void;
  setLoading: (loading: boolean) => void;

  // Combined actions
  setWalletConnected: (
    walletId: string,
    address: string,
    chainId: string,
    connectionType: 'custom' | 'cosmos-kit'
  ) => void;
  setWalletDisconnected: () => void;

  // Utility
  reset: () => void;
}

const initialWalletState: WalletConnection = {
  address: null,
  isConnected: false,
  walletId: null,
  chainId: null,
  connectionType: null
};

export const useUser = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      staker: null,
      wallet: initialWalletState,
      isLoading: false,

      // Basic setters
      setUser: (user) => set({ user }),
      setStaker: (staker) => set({ staker }),
      setLoading: (isLoading) => set({ isLoading }),

      // Wallet setter with merge
      setWallet: (walletUpdate) =>
        set((state) => ({
          wallet: { ...state.wallet, ...walletUpdate }
        })),

      // Combined wallet connection
      setWalletConnected: (walletId, address, chainId, connectionType) =>
        set({
          wallet: {
            address,
            isConnected: true,
            walletId,
            chainId,
            connectionType
          }
        }),

      // Wallet disconnection
      setWalletDisconnected: () =>
        set({
          wallet: initialWalletState,
          user: null,
          staker: null
        }),

      // Reset everything
      reset: () =>
        set({
          user: null,
          staker: null,
          wallet: initialWalletState,
          isLoading: false
        })
    }),
    {
      name: 'user-wallet-storage',
      partialize: (state) => ({
        wallet: state.wallet
      })
    }
  )
);
