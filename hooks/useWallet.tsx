import { useState, useEffect, useCallback } from 'react';
import WalletService, { WalletConnectionResult } from '@/lib/walletService';
import { STARGAZE_WALLETS, getWalletConfig } from '@/config/wallets';
import { ChainConfig, WalletConfig } from '@/types/wallet';

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
  isConnected: boolean;
  offlineSigner?: any;
}

export interface UseWalletReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;

  // Wallet info
  currentWallet: WalletInfo | null;
  address: string | null;
  walletId: string | null;
  chainId: string | null;
  chainName: string | null;
  offlineSigner: any | null;

  // Connection methods
  connectWallet: (walletId: string, chainId?: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;

  // Utility methods
  getBalance: () => Promise<string | null>;
  refreshWalletInfo: () => Promise<void>;
  isWalletInstalled: (walletId: string) => boolean;
  getAvailableWallets: () => WalletConfig[];
  getSupportedWallets: () => WalletConfig[];

  // Error state
  error: string | null;
  clearError: () => void;
}

// Stargaze chain configurations
const STARGAZE_CHAINS: Record<string, ChainConfig> = {
  stargaze: {
    chainId: 'stargaze',
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
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.04
        }
      }
    ],
    gasPriceStep: {
      low: 0.01,
      average: 0.025,
      high: 0.04
    }
  },
  'elgafar-1': {
    chainId: 'elgafar-1',
    chainName: 'Stargaze Testnet',
    rpc: 'https://rpc.elgafar-1.stargaze-apis.com',
    rest: 'https://rest.elgafar-1.stargaze-apis.com',
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
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.04
        }
      }
    ],
    gasPriceStep: {
      low: 0.01,
      average: 0.025,
      high: 0.04
    }
  }
};

const WALLET_STORAGE_KEY = 'stargaze_wallet_info';
const DEFAULT_CHAIN_ID = 'stargaze-1';

export function useWallet(
  defaultChainId: string = DEFAULT_CHAIN_ID
): UseWalletReturn {
  // States
  const [currentWallet, setCurrentWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get chain config
  const getChainConfig = useCallback((chainId: string): ChainConfig => {
    const chainConfig = STARGAZE_CHAINS[chainId];
    if (!chainConfig) {
      throw new Error(`Unsupported chain: ${chainId}`);
    }
    return chainConfig;
  }, []);

  // Load wallet info from storage on mount
  useEffect(() => {
    const loadStoredWallet = async () => {
      try {
        let stored;
        try {
          stored = JSON.parse(localStorage.getItem(WALLET_STORAGE_KEY) || '{}');
        } catch {
          return; // Invalid JSON, skip loading
        }

        if (stored && stored.id && stored.chainId) {
          const walletInfo: WalletInfo = stored;

          // Verify wallet is still installed and connected
          const isInstalled = WalletService.isWalletInstalled(walletInfo.id);
          const isStillConnected = isInstalled
            ? await WalletService.getWalletConnectionStatus(
                walletInfo.id,
                walletInfo.chainId
              )
            : false;

          if (isStillConnected) {
            setCurrentWallet(walletInfo);
            await refreshWalletInfo();
          } else {
            // Clear stored info if no longer connected
            localStorage.removeItem(WALLET_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading stored wallet:', error);
        localStorage.removeItem(WALLET_STORAGE_KEY);
      }
    };

    loadStoredWallet();
  }, []); // Empty dependency array for mount only

  // Save wallet info to storage
  const saveWalletInfo = useCallback((walletInfo: WalletInfo | null) => {
    try {
      if (walletInfo) {
        localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(walletInfo));
      } else {
        localStorage.removeItem(WALLET_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving wallet info:', error);
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(
    async (walletId: string, chainId: string = defaultChainId) => {
      setIsConnecting(true);
      setError(null);

      try {
        // Check if wallet is installed
        if (!WalletService.isWalletInstalled(walletId)) {
          const walletConfig = getWalletConfig(walletId);
          throw new Error(
            `${
              walletConfig?.name || walletId
            } is not installed. Please install the extension first.`
          );
        }

        // Get chain configuration
        const chainConfig = getChainConfig(chainId);

        // Connect using the enhanced WalletService
        const connectionResult: WalletConnectionResult =
          await WalletService.connect(walletId, chainConfig);

        // Get wallet configuration for display name
        const walletConfig = getWalletConfig(walletId);

        const walletInfo: WalletInfo = {
          id: walletId,
          name: walletConfig?.name || connectionResult.name || walletId,
          address: connectionResult.address,
          publicKey: connectionResult.publicKey,
          algo: connectionResult.algo,
          chainId: chainConfig.chainId,
          chainName: chainConfig.chainName,
          isConnected: true,
          offlineSigner: connectionResult.offlineSigner
        };

        setCurrentWallet(walletInfo);
        saveWalletInfo(walletInfo);

        // Get initial balance
        await getBalance();
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to connect wallet';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsConnecting(false);
      }
    },
    [defaultChainId, getChainConfig, saveWalletInfo]
  );

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    if (!currentWallet) return;

    setIsDisconnecting(true);
    setError(null);

    try {
      // Use WalletService to disconnect (though most wallets handle this internally)
      await WalletService.disconnectWallet(currentWallet.id);

      setCurrentWallet(null);
      saveWalletInfo(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to disconnect wallet';
      setError(errorMessage);
      console.warn(errorMessage);
    } finally {
      setIsDisconnecting(false);
      // Always clear the wallet state even if disconnect fails
      setCurrentWallet(null);
      saveWalletInfo(null);
    }
  }, [currentWallet, saveWalletInfo]);

  // Switch chain
  const switchChain = useCallback(
    async (chainId: string) => {
      if (!currentWallet) {
        throw new Error('No wallet connected');
      }

      setError(null);

      try {
        // Get new chain configuration
        const chainConfig = getChainConfig(chainId);

        // Reconnect to the new chain
        const connectionResult: WalletConnectionResult =
          await WalletService.connect(currentWallet.id, chainConfig);

        // Update wallet info with new chain
        const updatedWallet: WalletInfo = {
          ...currentWallet,
          address: connectionResult.address,
          publicKey: connectionResult.publicKey,
          chainId: chainConfig.chainId,
          chainName: chainConfig.chainName,
          offlineSigner: connectionResult.offlineSigner
        };

        setCurrentWallet(updatedWallet);
        saveWalletInfo(updatedWallet);

        // Refresh balance for new chain
        await getBalance();
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to switch chain';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [currentWallet, getChainConfig, saveWalletInfo]
  );

  // Get wallet balance using RPC
  const getBalance = useCallback(async (): Promise<string | null> => {
    if (!currentWallet) return null;

    try {
      const chainConfig = getChainConfig(currentWallet.chainId);

      // Query balance using REST API
      const response = await fetch(
        `${chainConfig.rest}/cosmos/bank/v1beta1/balances/${currentWallet.address}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }

      const data = await response.json();
      const balances = data.balances || [];

      // Find STARS balance
      const starsBalance = balances.find(
        (balance: any) => balance.denom === 'ustars'
      );

      if (starsBalance) {
        // Convert from ustars to STARS (6 decimal places)
        const balanceInStars = parseInt(starsBalance.amount) / Math.pow(10, 6);
        return balanceInStars.toFixed(6);
      }

      return '0';
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }, [currentWallet, getChainConfig]);

  // Refresh wallet info
  const refreshWalletInfo = useCallback(async () => {
    if (!currentWallet) return;

    try {
      // Check if wallet is still connected
      const isStillConnected = await WalletService.getWalletConnectionStatus(
        currentWallet.id,
        currentWallet.chainId
      );

      if (!isStillConnected) {
        setCurrentWallet(null);
        saveWalletInfo(null);
        return;
      }

      // Get updated balance
      const balance = await getBalance();

      const updatedWallet = {
        ...currentWallet,
        balance: balance || undefined
      };

      setCurrentWallet(updatedWallet);
      saveWalletInfo(updatedWallet);
    } catch (error) {
      console.error('Error refreshing wallet info:', error);
    }
  }, [currentWallet, getBalance, saveWalletInfo]);

  // Check if wallet is installed
  const isWalletInstalled = useCallback((walletId: string): boolean => {
    return WalletService.isWalletInstalled(walletId);
  }, []);

  // Get available wallets (installed)
  const getAvailableWallets = useCallback((): WalletConfig[] => {
    return WalletService.getAvailableWallets();
  }, []);

  // Get all supported wallets
  const getSupportedWallets = useCallback((): WalletConfig[] => {
    return WalletService.getSupportedWallets();
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Listen to wallet events (if supported by wallet)
  useEffect(() => {
    if (!currentWallet) return;

    // Set up wallet event listeners for account/chain changes
    // This is wallet-specific and may not be supported by all wallets
    const setupWalletListeners = async () => {
      try {
        // Example for Keplr
        if (currentWallet.id === 'keplr-extension' && window.keplr) {
          const handleKeyStoreChange = () => {
            refreshWalletInfo();
          };

          window.addEventListener('keplr_keystorechange', handleKeyStoreChange);

          return () => {
            window.removeEventListener(
              'keplr_keystorechange',
              handleKeyStoreChange
            );
          };
        }
      } catch (error) {
        console.error('Error setting up wallet listeners:', error);
      }
    };

    let cleanup: (() => void) | undefined;
    setupWalletListeners().then((fn) => {
      cleanup = fn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [currentWallet, refreshWalletInfo]);

  // Auto-refresh wallet info periodically
  useEffect(() => {
    if (!currentWallet) return;

    const intervalId = setInterval(() => {
      refreshWalletInfo();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [currentWallet, refreshWalletInfo]);

  return {
    // Connection state
    isConnected: !!currentWallet?.isConnected,
    isConnecting,
    isDisconnecting,

    // Wallet info
    currentWallet,
    address: currentWallet?.address || null,
    walletId: currentWallet?.id || null,
    chainId: currentWallet?.chainId || null,
    chainName: currentWallet?.chainName || null,
    offlineSigner: currentWallet?.offlineSigner || null,

    // Methods
    connectWallet,
    disconnectWallet,
    switchChain,
    getBalance,
    refreshWalletInfo,
    isWalletInstalled,
    getAvailableWallets,
    getSupportedWallets,

    // Error state
    error,
    clearError
  };
}
