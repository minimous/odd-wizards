'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { UserWithWinner, useUser } from '@/hooks/useUser';
import { useChain } from '@cosmos-kit/react';
import { WalletStatus } from '@cosmos-kit/core';
import axios from 'axios';

// Simple context for wallet state
interface WalletContextType {
  isReady: boolean;
  error: string | null;
  address: string | null;
  user: UserWithWinner | null;
  isConnected: boolean;
  connectionType: 'custom' | 'cosmos-kit' | null;
}

const WalletContext = createContext<WalletContextType>({
  isReady: false,
  error: null,
  address: null,
  user: null,
  isConnected: false,
  connectionType: null
});

export const useSyncedWallet = () => useContext(WalletContext);

// Main wallet provider that handles all synchronization
export function WalletProviderWrapper({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Global state
  const {
    wallet,
    user,
    setUser,
    setStaker,
    setWalletConnected,
    setWalletDisconnected
  } = useUser();

  // Cosmos Kit integration
  const { address: cosmosAddress, status: cosmosStatus } = useChain('stargaze');

  // Fetch user data utility
  const fetchUserData = React.useCallback(
    async (address: string) => {
      try {
        const response = await axios.get(`/api/user/${address}`);
        if (response.data?.data) {
          setUser(response.data.data.user);
          setStaker(response.data.data.staker);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    [setUser, setStaker]
  );

  // Handle Cosmos Kit connection
  useEffect(() => {
    if (cosmosStatus === WalletStatus.Connected && cosmosAddress) {
      // Only sync if not already connected with custom wallet
      if (!wallet.isConnected || wallet.connectionType !== 'custom') {
        setWalletConnected(
          'keplr-extension',
          cosmosAddress,
          'stargaze-1',
          'cosmos-kit'
        );

        // Fetch user data if needed
        if (!user || user.user_address !== cosmosAddress) {
          fetchUserData(cosmosAddress);
        }
      }
    } else if (
      cosmosStatus === WalletStatus.Disconnected &&
      wallet.connectionType === 'cosmos-kit'
    ) {
      setWalletDisconnected();
    }
  }, [
    cosmosStatus,
    cosmosAddress,
    wallet.isConnected,
    wallet.connectionType,
    setWalletConnected,
    setWalletDisconnected,
    user,
    fetchUserData
  ]);

  // Set ready state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Create context value
  const contextValue: WalletContextType = React.useMemo(
    () => ({
      isReady,
      error,
      address: wallet.address,
      user: user,
      isConnected: wallet.isConnected,
      connectionType: wallet.connectionType
    }),
    [isReady, error, wallet.address, wallet.isConnected, wallet.connectionType]
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// Optional debug component for development
export function WalletDebugInfo() {
  const { wallet, user } = useUser();
  const syncedWallet = useSyncedWallet();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-black/80 p-4 text-xs text-white">
      <h3 className="mb-2 font-bold">Wallet Debug</h3>
      <div className="space-y-1">
        <div>
          Status:{' '}
          {syncedWallet.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
        <div>
          Address:{' '}
          {syncedWallet.address
            ? `${syncedWallet.address.slice(0, 10)}...`
            : 'None'}
        </div>
        <div>Type: {syncedWallet.connectionType || 'None'}</div>
        <div>Ready: {syncedWallet.isReady ? '✅' : '⏳'}</div>
        <div>User: {user ? '👤 Loaded' : '❌ None'}</div>
        {syncedWallet.error && (
          <div className="text-red-400">Error: {syncedWallet.error}</div>
        )}
      </div>
    </div>
  );
}
