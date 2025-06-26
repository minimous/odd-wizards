import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useUser } from '@/hooks/useUser';
import WalletService, { WalletConnectionResult } from '@/lib/walletService';
import { getWalletConfig } from '@/config/wallets';
import { ChainConfig } from '@/types/wallet';

// Types
export interface WalletInfo {
  id: string;
  name: string;
  address: string;
  publicKey?: string;
  algo?: string;
  chainId: string;
  chainName: string;
  balance?: string;
  offlineSigner?: any;
}

export interface UseWalletReturn {
  // State
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  currentWallet: WalletInfo | null;
  address: string | null;
  error: string | null;

  // Actions
  connect: (walletId: string, chainId?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  clearError: () => void;

  // Utils
  getBalance: () => Promise<string | null>;
  isWalletInstalled: (walletId: string) => boolean;
}

// Chain configurations
const STARGAZE_CHAINS: Record<string, ChainConfig> = {
  'stargaze-1': {
    chainId: 'stargaze-1',
    chainName: 'Stargaze',
    rpc: 'https://rpc.stargaze-apis.com',
    rest: 'https://rest.stargaze-apis.com',
    bech32Prefix: 'stars',
    coinType: 118,
    currencies: [
      {
        coinDenom: 'STARS',
        coinMinimalDenom: 'ustars',
        coinDecimals: 6
      }
    ],
    feeCurrencies: [
      {
        coinDenom: 'STARS',
        coinMinimalDenom: 'ustars',
        coinDecimals: 6,
        gasPriceStep: { low: 0.01, average: 0.025, high: 0.04 }
      }
    ],
    gasPriceStep: { low: 0.01, average: 0.025, high: 0.04 }
  }
};

const STORAGE_KEY = 'wallet_connection';
const DEFAULT_CHAIN = 'stargaze-1';

export function useWallet(
  defaultChainId: string = DEFAULT_CHAIN
): UseWalletReturn {
  // Global state
  const {
    wallet: globalWallet,
    setWalletConnected,
    setWalletDisconnected,
    setUser,
    setStaker
  } = useUser();

  // Local state
  const [currentWallet, setCurrentWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent multiple simultaneous operations
  const operationRef = useRef<string | null>(null);

  // Fetch user data
  const fetchUserData = useCallback(
    async (address: string) => {
      try {
        const response = await axios.get(`/api/user/${address}`);
        if (response.data?.data) {
          setUser(response.data.data.user);
          setStaker(response.data.data.staker);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    },
    [setUser, setStaker]
  );

  // Save wallet to storage
  const saveWallet = useCallback((wallet: WalletInfo | null) => {
    try {
      if (wallet) {
        const { offlineSigner, ...serializable } = wallet;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save wallet:', error);
    }
  }, []);

  // Load wallet from storage
  const loadStoredWallet = useCallback(async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const walletData = JSON.parse(stored);
      if (!walletData.id || !walletData.address) return;

      // Check if wallet is still connected
      const isInstalled = WalletService.isWalletInstalled(walletData.id);
      if (!isInstalled) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      const isConnected = await WalletService.getWalletConnectionStatus(
        walletData.id,
        walletData.chainId
      );

      if (isConnected) {
        setCurrentWallet(walletData);
        setWalletConnected(
          walletData.id,
          walletData.address,
          walletData.chainId,
          'custom'
        );
        fetchUserData(walletData.address);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to load stored wallet:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [setWalletConnected, fetchUserData]);

  // Connect wallet
  const connect = useCallback(
    async (walletId: string, chainId: string = defaultChainId) => {
      // Prevent concurrent operations
      if (operationRef.current) {
        throw new Error(`Already ${operationRef.current}`);
      }

      operationRef.current = 'connecting';
      setIsConnecting(true);
      setError(null);

      try {
        // Check if wallet is installed
        if (!WalletService.isWalletInstalled(walletId)) {
          const walletConfig = getWalletConfig(walletId);
          throw new Error(`${walletConfig?.name || walletId} is not installed`);
        }

        // Get chain config
        const chainConfig = STARGAZE_CHAINS[chainId];
        if (!chainConfig) {
          throw new Error(`Unsupported chain: ${chainId}`);
        }

        // Connect to wallet
        const result: WalletConnectionResult = await WalletService.connect(
          walletId,
          chainConfig
        );
        const walletConfig = getWalletConfig(walletId);

        const walletInfo: WalletInfo = {
          id: walletId,
          name: walletConfig?.name || result.name || walletId,
          address: result.address,
          publicKey: result.publicKey,
          algo: result.algo,
          chainId: chainConfig.chainId,
          chainName: chainConfig.chainName,
          offlineSigner: result.offlineSigner
        };

        // Update states
        setCurrentWallet(walletInfo);
        saveWallet(walletInfo);
        setWalletConnected(
          walletId,
          result.address,
          chainConfig.chainId,
          'custom'
        );

        // Fetch user data
        await fetchUserData(result.address);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to connect wallet';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsConnecting(false);
        operationRef.current = null;
      }
    },
    [defaultChainId, setWalletConnected, saveWallet, fetchUserData]
  );

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    if (operationRef.current) return;

    operationRef.current = 'disconnecting';
    setIsDisconnecting(true);
    setError(null);

    try {
      if (currentWallet) {
        await WalletService.disconnectWallet(currentWallet.id);
      }

      setCurrentWallet(null);
      saveWallet(null);
      setWalletDisconnected();
    } catch (err: any) {
      console.error('Disconnect error:', err);
      // Continue with cleanup even if disconnect fails
    } finally {
      // Ensure cleanup happens
      setCurrentWallet(null);
      saveWallet(null);
      setWalletDisconnected();
      setIsDisconnecting(false);
      operationRef.current = null;
    }
  }, [currentWallet, saveWallet, setWalletDisconnected]);

  // Get balance
  const getBalance = useCallback(async (): Promise<string | null> => {
    if (!currentWallet) return null;

    try {
      const chainConfig = STARGAZE_CHAINS[currentWallet.chainId];
      const response = await fetch(
        `${chainConfig.rest}/cosmos/bank/v1beta1/balances/${currentWallet.address}`
      );

      if (!response.ok) throw new Error('Failed to fetch balance');

      const data = await response.json();
      const starsBalance = data.balances?.find(
        (b: any) => b.denom === 'ustars'
      );

      if (starsBalance) {
        return (parseInt(starsBalance.amount) / 1_000_000).toFixed(6);
      }
      return '0';
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }, [currentWallet]);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // Check if wallet is installed
  const isWalletInstalled = useCallback((walletId: string): boolean => {
    return WalletService.isWalletInstalled(walletId);
  }, []);

  // Load stored wallet on mount
  useEffect(() => {
    loadStoredWallet();
  }, [loadStoredWallet]);

  // Sync with global wallet state
  useEffect(() => {
    if (
      globalWallet.isConnected &&
      globalWallet.connectionType === 'cosmos-kit' &&
      !currentWallet
    ) {
      // Another component connected via cosmos-kit, don't interfere
      return;
    }

    if (!globalWallet.isConnected && currentWallet) {
      // Global state was cleared, clear local state
      setCurrentWallet(null);
      saveWallet(null);
    }
  }, [
    globalWallet.isConnected,
    globalWallet.connectionType,
    currentWallet,
    saveWallet
  ]);

  return {
    // State
    isConnected: !!currentWallet,
    isConnecting,
    isDisconnecting,
    currentWallet,
    address: currentWallet?.address || null,
    error,

    // Actions
    connect,
    disconnect,
    clearError,

    // Utils
    getBalance,
    isWalletInstalled
  };
}
