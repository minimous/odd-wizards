import { ChainConfig, WalletConfig } from '@/types/wallet';
import { STARGAZE_WALLETS, getWalletConfig } from '@/config/wallets';

// Extend Window interface for all wallet objects
declare global {
  interface Window {
    keplr?: any;
    leap?: any;
    cosmostation?: any;
    station?: any;
    compass?: any;
    owallet?: any;
    coin98?: any;
    xdefi?: any;
    trustWallet?: any;
    ledger?: any;
    ethereum?: any;
    [key: string]: any; // For dynamic wallet access
  }
}

export interface WalletConnectionResult {
  address: string;
  publicKey?: string;
  name?: string;
  algo?: string;
  offlineSigner?: any;
}

export default class WalletService {
  /**
   * Connect to any supported wallet by ID
   */
  static async connect(
    walletId: string,
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    const walletConfig = getWalletConfig(walletId);
    if (!walletConfig) {
      throw new Error(`Unsupported wallet: ${walletId}`);
    }

    // Check if wallet is installed
    if (!this.isWalletInstalled(walletId)) {
      throw new Error(
        `${walletConfig.name} is not installed. Please install the extension first.`
      );
    }

    // Route to appropriate connection method based on wallet type
    switch (walletId) {
      case 'keplr-extension':
      case 'keplr':
        return await this.connectKeplr(chainConfig);

      case 'leap-extension':
      case 'leap':
        return await this.connectLeap(chainConfig);

      case 'cosmostation-extension':
      case 'cosmostation':
        return await this.connectCosmostation(chainConfig);

      case 'station-extension':
      case 'station':
        return await this.connectStation(chainConfig);

      case 'compass-extension':
      case 'compass':
        return await this.connectCompass(chainConfig);

      case 'owallet-extension':
      case 'owallet':
        return await this.connectOWallet(chainConfig);

      case 'coin98-extension':
      case 'coin98':
        return await this.connectCoin98(chainConfig);

      case 'xdefi-extension':
      case 'xdefi':
        return await this.connectXDEFI(chainConfig);

      case 'trust-extension':
      case 'trust':
        return await this.connectTrustWallet(chainConfig);

      case 'ledger-extension':
      case 'ledger':
        return await this.connectLedger(chainConfig);

      case 'walletconnect':
        return await this.connectWalletConnect(chainConfig);

      case 'metamask':
        return await this.connectMetaMask();

      default:
        // Try generic cosmos wallet connection for unlisted wallets
        return await this.connectGenericCosmosWallet(walletId, chainConfig);
    }
  }

  /**
   * Connect to Keplr wallet
   */
  static async connectKeplr(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.keplr) {
      throw new Error('Keplr extension not found');
    }

    await this.suggestChain(window.keplr, chainConfig);
    await window.keplr.enable(chainConfig.chainId);

    const key = await window.keplr.getKey(chainConfig.chainId);
    const offlineSigner = window.keplr.getOfflineSigner(chainConfig.chainId);

    return {
      address: key.bech32Address,
      publicKey: key.pubKey,
      name: key.name,
      algo: key.algo,
      offlineSigner
    };
  }

  /**
   * Connect to Leap wallet
   */
  static async connectLeap(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.leap) {
      throw new Error('Leap extension not found');
    }

    await this.suggestChain(window.leap, chainConfig);
    await window.leap.enable(chainConfig.chainId);

    const key = await window.leap.getKey(chainConfig.chainId);
    const offlineSigner = window.leap.getOfflineSigner(chainConfig.chainId);

    return {
      address: key.bech32Address,
      publicKey: key.pubKey,
      name: key.name,
      algo: key.algo,
      offlineSigner
    };
  }

  /**
   * Connect to Cosmostation wallet
   */
  static async connectCosmostation(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.cosmostation) {
      throw new Error('Cosmostation extension not found');
    }

    try {
      const account = await window.cosmostation.cosmos.request({
        method: 'cos_requestAccount',
        params: {
          chainName: chainConfig.chainName
        }
      });

      return {
        address: account.address,
        publicKey: account.publicKey,
        name: account.name
      };
    } catch (error) {
      console.error('Cosmostation connection error:', error);
      throw error;
    }
  }

  /**
   * Connect to Station wallet
   */
  static async connectStation(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.station) {
      throw new Error('Station extension not found');
    }

    await this.suggestChain(window.station, chainConfig);
    await window.station.enable(chainConfig.chainId);

    const key = await window.station.getKey(chainConfig.chainId);
    const offlineSigner = window.station.getOfflineSigner(chainConfig.chainId);

    return {
      address: key.bech32Address,
      publicKey: key.pubKey,
      name: key.name,
      algo: key.algo,
      offlineSigner
    };
  }

  /**
   * Connect to Compass wallet
   */
  static async connectCompass(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.compass) {
      throw new Error('Compass extension not found');
    }

    await this.suggestChain(window.compass, chainConfig);
    await window.compass.enable(chainConfig.chainId);

    const key = await window.compass.getKey(chainConfig.chainId);
    const offlineSigner = window.compass.getOfflineSigner(chainConfig.chainId);

    return {
      address: key.bech32Address,
      publicKey: key.pubKey,
      name: key.name,
      algo: key.algo,
      offlineSigner
    };
  }

  /**
   * Connect to OWallet
   */
  static async connectOWallet(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.owallet) {
      throw new Error('OWallet extension not found');
    }

    await this.suggestChain(window.owallet, chainConfig);
    await window.owallet.enable(chainConfig.chainId);

    const key = await window.owallet.getKey(chainConfig.chainId);
    const offlineSigner = window.owallet.getOfflineSigner(chainConfig.chainId);

    return {
      address: key.bech32Address,
      publicKey: key.pubKey,
      name: key.name,
      algo: key.algo,
      offlineSigner
    };
  }

  /**
   * Connect to Coin98 wallet
   */
  static async connectCoin98(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.coin98) {
      throw new Error('Coin98 extension not found');
    }

    await this.suggestChain(window.coin98, chainConfig);
    await window.coin98.enable(chainConfig.chainId);

    const key = await window.coin98.getKey(chainConfig.chainId);
    const offlineSigner = window.coin98.getOfflineSigner(chainConfig.chainId);

    return {
      address: key.bech32Address,
      publicKey: key.pubKey,
      name: key.name,
      algo: key.algo,
      offlineSigner
    };
  }

  /**
   * Connect to XDEFI wallet
   */
  static async connectXDEFI(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.xdefi?.keplr) {
      throw new Error('XDEFI extension not found');
    }

    const xdefiKeplr = window.xdefi.keplr;
    await this.suggestChain(xdefiKeplr, chainConfig);
    await xdefiKeplr.enable(chainConfig.chainId);

    const key = await xdefiKeplr.getKey(chainConfig.chainId);
    const offlineSigner = xdefiKeplr.getOfflineSigner(chainConfig.chainId);

    return {
      address: key.bech32Address,
      publicKey: key.pubKey,
      name: key.name,
      algo: key.algo,
      offlineSigner
    };
  }

  /**
   * Connect to Trust Wallet
   */
  static async connectTrustWallet(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.trustWallet) {
      throw new Error('Trust Wallet extension not found');
    }

    await this.suggestChain(window.trustWallet, chainConfig);
    await window.trustWallet.enable(chainConfig.chainId);

    const key = await window.trustWallet.getKey(chainConfig.chainId);
    const offlineSigner = window.trustWallet.getOfflineSigner(
      chainConfig.chainId
    );

    return {
      address: key.bech32Address,
      publicKey: key.pubKey,
      name: key.name,
      algo: key.algo,
      offlineSigner
    };
  }

  /**
   * Connect to Ledger wallet
   */
  static async connectLedger(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.ledger) {
      throw new Error('Ledger extension not found');
    }

    await window.ledger.enable(chainConfig.chainId);

    const key = await window.ledger.getKey(chainConfig.chainId);
    const offlineSigner = window.ledger.getOfflineSigner(chainConfig.chainId);

    return {
      address: key.bech32Address,
      publicKey: key.pubKey,
      name: key.name,
      algo: key.algo,
      offlineSigner
    };
  }

  /**
   * Connect to MetaMask wallet (for EVM chains)
   */
  static async connectMetaMask(): Promise<WalletConnectionResult> {
    if (!window.ethereum) {
      throw new Error('MetaMask extension not found');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      return {
        address: accounts[0],
        name: 'MetaMask Account'
      };
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected the connection request');
      }
      throw error;
    }
  }

  /**
   * Connect to WalletConnect
   */
  static async connectWalletConnect(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    // WalletConnect implementation would require WalletConnect SDK
    throw new Error('WalletConnect integration requires additional setup');
  }

  /**
   * Generic cosmos wallet connection for unlisted wallets
   */
  static async connectGenericCosmosWallet(
    walletId: string,
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    const walletKey = walletId.replace('-extension', '');
    const wallet = window[walletKey];

    if (!wallet) {
      throw new Error(`${walletId} extension not found`);
    }

    try {
      // Try to suggest chain if the method exists
      if (wallet.experimentalSuggestChain) {
        await this.suggestChain(wallet, chainConfig);
      }

      // Enable the chain
      if (wallet.enable) {
        await wallet.enable(chainConfig.chainId);
      }

      // Get key information
      const key = await wallet.getKey(chainConfig.chainId);
      const offlineSigner = wallet.getOfflineSigner?.(chainConfig.chainId);

      return {
        address: key.bech32Address,
        publicKey: key.pubKey,
        name: key.name,
        algo: key.algo,
        offlineSigner
      };
    } catch (error) {
      console.error(`Error connecting to ${walletId}:`, error);
      throw error;
    }
  }

  /**
   * Helper method to suggest chain to cosmos wallets
   */
  private static async suggestChain(
    wallet: any,
    chainConfig: ChainConfig
  ): Promise<void> {
    if (!wallet.experimentalSuggestChain) return;

    try {
      await wallet.experimentalSuggestChain({
        chainId: chainConfig.chainId,
        chainName: chainConfig.chainName,
        rpc: chainConfig.rpc,
        rest: chainConfig.rest,
        bip44: {
          coinType: chainConfig.coinType
        },
        bech32Config: {
          bech32PrefixAccAddr: chainConfig.bech32Prefix,
          bech32PrefixAccPub: `${chainConfig.bech32Prefix}pub`,
          bech32PrefixValAddr: `${chainConfig.bech32Prefix}valoper`,
          bech32PrefixValPub: `${chainConfig.bech32Prefix}valoperpub`,
          bech32PrefixConsAddr: `${chainConfig.bech32Prefix}valcons`,
          bech32PrefixConsPub: `${chainConfig.bech32Prefix}valconspub`
        },
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
            gasPriceStep: chainConfig.gasPriceStep || {
              low: 0.01,
              average: 0.025,
              high: 0.04
            }
          }
        ],
        stakeCurrency: {
          coinDenom: 'STARS',
          coinMinimalDenom: 'ustars',
          coinDecimals: 6
        }
      });
    } catch (error) {
      console.warn('Failed to suggest chain:', error);
    }
  }

  /**
   * Check if a wallet is installed
   */
  static isWalletInstalled(walletId: string): boolean {
    const walletMap: Record<string, () => boolean> = {
      'keplr-extension': () => !!window.keplr,
      keplr: () => !!window.keplr,
      'leap-extension': () => !!window.leap,
      leap: () => !!window.leap,
      'cosmostation-extension': () => !!window.cosmostation,
      cosmostation: () => !!window.cosmostation,
      'station-extension': () => !!window.station,
      station: () => !!window.station,
      'compass-extension': () => !!window.compass,
      compass: () => !!window.compass,
      'owallet-extension': () => !!window.owallet,
      owallet: () => !!window.owallet,
      'coin98-extension': () => !!window.coin98,
      coin98: () => !!window.coin98,
      'xdefi-extension': () => !!window.xdefi?.keplr,
      xdefi: () => !!window.xdefi?.keplr,
      'trust-extension': () => !!window.trustWallet,
      trust: () => !!window.trustWallet,
      'ledger-extension': () => !!window.ledger,
      ledger: () => !!window.ledger,
      metamask: () => !!window.ethereum?.isMetaMask,
      walletconnect: () => true // WalletConnect doesn't require installation
    };

    const checker = walletMap[walletId];
    if (checker) {
      return checker();
    }

    // Try generic check for unlisted wallets
    const walletKey = walletId.replace('-extension', '');
    return !!window[walletKey];
  }

  /**
   * Get wallet connection status
   */
  static async getWalletConnectionStatus(
    walletId: string,
    chainId?: string
  ): Promise<boolean> {
    try {
      const walletConfig = getWalletConfig(walletId);
      if (!walletConfig || !this.isWalletInstalled(walletId)) {
        return false;
      }

      if (walletConfig.supportedTypes.includes('evm')) {
        // EVM wallet check
        if (walletId === 'metamask' && window.ethereum?.isMetaMask) {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts'
          });
          return accounts.length > 0;
        }
        return false;
      } else {
        // Cosmos wallet check
        const walletKey = walletId.replace('-extension', '');
        const wallet = window[walletKey];

        if (!wallet || !chainId) return false;

        try {
          const key = await wallet.getKey(chainId);
          return !!key?.bech32Address;
        } catch {
          return false;
        }
      }
    } catch (error) {
      console.error(
        `Error checking wallet connection status for ${walletId}:`,
        error
      );
      return false;
    }
  }

  /**
   * Get all available wallets
   */
  static getAvailableWallets(): WalletConfig[] {
    return STARGAZE_WALLETS.filter((wallet) =>
      this.isWalletInstalled(wallet.id)
    );
  }

  /**
   * Get all supported wallets (regardless of installation status)
   */
  static getSupportedWallets(): WalletConfig[] {
    return STARGAZE_WALLETS;
  }

  /**
   * Disconnect wallet (limited support as most wallets handle this internally)
   */
  static async disconnectWallet(walletId: string): Promise<void> {
    console.log(`${walletId} disconnection is handled by the wallet extension`);
    // Most wallets don't support programmatic disconnect
    // The user needs to disconnect from the extension directly
  }

  /**
   * Get wallet accounts
   */
  static async getWalletAccounts(
    walletId: string,
    chainId?: string
  ): Promise<any[]> {
    try {
      const connection = await this.getWalletConnectionStatus(
        walletId,
        chainId
      );
      if (!connection) return [];

      const walletConfig = getWalletConfig(walletId);
      if (!walletConfig) return [];

      if (walletConfig.supportedTypes.includes('evm')) {
        if (walletId === 'metamask' && window.ethereum?.isMetaMask) {
          return await window.ethereum.request({ method: 'eth_accounts' });
        }
      } else {
        const walletKey = walletId.replace('-extension', '');
        const wallet = window[walletKey];

        if (wallet && chainId) {
          const key = await wallet.getKey(chainId);
          return [key];
        }
      }

      return [];
    } catch (error) {
      console.error(`Error getting accounts for ${walletId}:`, error);
      return [];
    }
  }

  /**
   * Switch or add network (for EVM wallets)
   */
  static async switchNetwork(chainId: string): Promise<void> {
    if (!window.ethereum) {
      throw new Error('No ethereum provider found');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }]
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        throw new Error(
          'Chain not added to wallet. Please add the chain manually.'
        );
      }
      throw switchError;
    }
  }
}
