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
  widget?: any; // For Initia widget
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
  sendTransaction: (
    walletId: string,
    chainId: string,
    messages: any[]
  ) => Promise<string | null>; // New method for Initia transactions
}

// Chain configurations - Updated to include Intergaze
const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
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
  },
  'initia-1': {
    chainId: 'initia-1',
    chainName: 'Initia',
    rpc: 'https://rpc.initia.tech',
    rest: 'https://lcd.initia.tech',
    bech32Prefix: 'init',
    coinType: 118,
    currencies: [
      {
        coinDenom: 'INIT',
        coinMinimalDenom: 'uinit',
        coinDecimals: 6
      }
    ],
    feeCurrencies: [
      {
        coinDenom: 'INIT',
        coinMinimalDenom: 'uinit',
        coinDecimals: 6,
        gasPriceStep: { low: 0.15, average: 0.25, high: 0.4 }
      }
    ],
    gasPriceStep: { low: 0.15, average: 0.25, high: 0.4 }
  },
  'intergaze-1': {
    chainId: 'intergaze-1',
    chainName: 'Intergaze',
    rpc: 'https://rpc.intergaze-apis.com',
    rest: 'https://rest.intergaze-apis.com',
    bech32Prefix: 'init',
    coinType: 60, // From slip44 in the config
    currencies: [
      {
        coinDenom: 'IGZ', // Display name for the fee token
        coinMinimalDenom:
          'l2/fb936ffef4eb4019d82941992cc09ae2788ce7197fcb08cb00c4fe6f5e79184e',
        coinDecimals: 6 // Assuming 6 decimals
      }
    ],
    feeCurrencies: [
      {
        coinDenom: 'IGZ',
        coinMinimalDenom:
          'l2/fb936ffef4eb4019d82941992cc09ae2788ce7197fcb08cb00c4fe6f5e79184e',
        coinDecimals: 6,
        gasPriceStep: { low: 0.03, average: 0.03, high: 0.03 }
      }
    ],
    gasPriceStep: { low: 0.03, average: 0.03, high: 0.03 }
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
        const { offlineSigner, widget, ...serializable } = wallet;
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
        // Check if wallet is installed (except for Initia widget)
        if (
          walletId !== 'initia-widget' &&
          !WalletService.isWalletInstalled(walletId)
        ) {
          const walletConfig = getWalletConfig(walletId);
          throw new Error(`${walletConfig?.name || walletId} is not installed`);
        }

        // Get chain config
        const chainConfig = SUPPORTED_CHAINS[chainId];
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
          offlineSigner: result.offlineSigner,
          widget: result.widget // Store Initia widget if available
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

        // Fetch user data (only for supported APIs)
        if (chainId === 'stargaze-1') {
          await fetchUserData(result.address);
        }

        // Set up address subscription for Initia widget
        if (result.widget && result.widget.address$) {
          result.widget.address$.subscribe((newAddress: string) => {
            if (newAddress && newAddress !== walletInfo.address) {
              // Address changed, update wallet info
              const updatedWallet = { ...walletInfo, address: newAddress };
              setCurrentWallet(updatedWallet);
              saveWallet(updatedWallet);
              setWalletConnected(
                walletId,
                newAddress,
                chainConfig.chainId,
                'custom'
              );
            }
          });
        }
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
      const chainConfig = SUPPORTED_CHAINS[currentWallet.chainId];
      if (!chainConfig) return null;

      const response = await fetch(
        `${chainConfig.rest}/cosmos/bank/v1beta1/balances/${currentWallet.address}`
      );

      if (!response.ok) throw new Error('Failed to fetch balance');

      const data = await response.json();
      const currency = chainConfig.currencies?.[0];
      if (!currency) return null;

      const balance = data.balances?.find(
        (b: any) => b.denom === currency.coinMinimalDenom
      );

      if (balance) {
        const amount =
          parseInt(balance.amount) / Math.pow(10, currency.coinDecimals);
        return amount.toFixed(6);
      }
      return '0';
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }, [currentWallet]);

  // Send transaction (for Initia-based chains)
  const sendTransaction = useCallback(
    async (
      walletId: string,
      chainId: string,
      messages: any[]
    ): Promise<string | null> => {
      if (!currentWallet) {
        throw new Error('No wallet connected');
      }

      // Check if this is an Initia-based chain
      const isInitiaBased =
        currentWallet.chainId === 'initia-1' ||
        currentWallet.chainId.startsWith('intergaze');

      if (isInitiaBased && currentWallet.widget) {
        try {
          const txHash = await WalletService.sendTransaction(
            walletId,
            chainId,
            messages
          );
          return txHash;
        } catch (error: any) {
          throw new Error(`Transaction failed: ${error.message}`);
        }
      } else {
        throw new Error(
          'Transaction sending not supported for this wallet/chain combination'
        );
      }
    },
    [currentWallet]
  );

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
    isWalletInstalled,
    sendTransaction
  };
}
