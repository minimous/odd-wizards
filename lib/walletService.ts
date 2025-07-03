import { ChainConfig, WalletConfig } from '@/types/wallet';
import { STARGAZE_WALLETS, getWalletConfig } from '@/config/wallets';
import { AddressUtils } from './utils';

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
    phantom?: {
      solana?: any;
      ethereum?: any;
    };
    [key: string]: any;
  }
}

export interface WalletConnectionResult {
  address: string;
  publicKey?: string;
  name?: string;
  algo?: string;
  offlineSigner?: any;
  provider?: any;
  widget?: any;
}

// Custom hooks for Initia address management
export function useInitiaAddress(prefix: string = 'init') {
  // Import useAccount here inside the custom hook
  const { useAccount } = require('wagmi');
  const { address } = useAccount();

  if (!address) return '';
  const hexAddress = AddressUtils.toPrefixedHex(address);
  return AddressUtils.toBech32(hexAddress, prefix);
}

export function useHexAddress() {
  // Import useAccount here inside the custom hook
  const { useAccount } = require('wagmi');
  const { address } = useAccount();

  if (!address) return '';
  return AddressUtils.toPrefixedHex(address);
}

// Utility functions that accept address as parameter (no hooks)
export function getInitiaAddressFromHex(
  hexAddress: string,
  prefix: string = 'init'
): string {
  if (!hexAddress) return '';
  return AddressUtils.toBech32(hexAddress, prefix);
}

export function convertToHexAddress(address: string): string {
  if (!address) return '';
  return AddressUtils.toPrefixedHex(address);
}

export default class WalletService {
  private static readonly LEAP_SNAP_ID = 'npm:@leapwallet/metamask-cosmos-snap';

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

    if (chainConfig.chainId === 'stargaze-1') {
      // Route to appropriate connection method for Stargaze
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

        case 'leap-metamask-cosmos-snap':
        case 'metamask':
          return await this.connectLeapSnap(chainConfig);

        default:
          return await this.connectGenericCosmosWallet(walletId, chainConfig);
      }
    } else if (
      chainConfig.chainId === 'initia-1' ||
      chainConfig.chainId.startsWith('intergaze')
    ) {
      // Route to appropriate connection method for Initia using Wagmi
      switch (walletId) {
        case 'metamask':
          return await this.connectMetaMaskForInitia(chainConfig);

        case 'leap-extension':
        case 'leap':
          return await this.connectLeapForInitia(chainConfig);

        case 'phantom':
          return await this.connectPhantomForInitia(chainConfig);

        default:
          throw new Error(
            `Wallet ${walletId} is not supported for Initia chains`
          );
      }
    } else {
      throw new Error(`Unsupported chain: ${chainConfig.chainId}`);
    }
  }

  /**
   * Connect to MetaMask for Initia chains using Wagmi
   */
  static async connectMetaMaskForInitia(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.ethereum?.isMetaMask) {
      throw new Error('MetaMask extension not found');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in MetaMask');
      }

      // Try to add/switch to Initia network if it's a custom network
      await this.addInitiaNetworkToMetaMask(chainConfig);

      // Get the hex address from wagmi
      const hexAddress = accounts[0];

      // Convert to bech32 address for Initia networks
      const prefix = this.getBech32Prefix(chainConfig.chainId);
      const bech32Address = AddressUtils.toBech32(hexAddress, prefix);

      return {
        address: bech32Address, // Return bech32 address for Initia
        name: 'MetaMask Account',
        provider: window.ethereum,
        publicKey: hexAddress // Store hex address as publicKey for reference
      };
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected the connection request');
      }
      throw new Error(`MetaMask connection failed: ${error.message}`);
    }
  }

  /**
   * Connect to Leap wallet for Initia chains
   */
  static async connectLeapForInitia(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.leap) {
      throw new Error('Leap extension not found');
    }

    try {
      // Check if Leap supports EVM mode for Initia
      if (window.leap.ethereum) {
        // Use EVM mode for Initia chains
        const accounts = await window.leap.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found in Leap');
        }

        // Add network to Leap if needed
        await this.addInitiaNetworkToLeap(chainConfig);

        // Get addresses
        const hexAddress = accounts[0];
        const prefix = this.getBech32Prefix(chainConfig.chainId);
        const bech32Address = AddressUtils.toBech32(hexAddress, prefix);

        return {
          address: bech32Address,
          name: 'Leap Account',
          provider: window.leap.ethereum,
          publicKey: hexAddress
        };
      } else {
        // Fallback to Cosmos mode
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
    } catch (error: any) {
      throw new Error(`Leap connection failed: ${error.message}`);
    }
  }

  /**
   * Connect to Phantom wallet for Initia chains
   */
  static async connectPhantomForInitia(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.phantom?.ethereum) {
      throw new Error(
        'Phantom extension not found or Ethereum support not available'
      );
    }

    try {
      // Request account access through Phantom's Ethereum provider
      const accounts = await window.phantom.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in Phantom');
      }

      // Try to add/switch to Initia network
      await this.addInitiaNetworkToPhantom(chainConfig);

      // Get addresses
      const hexAddress = accounts[0];
      const prefix = this.getBech32Prefix(chainConfig.chainId);
      const bech32Address = AddressUtils.toBech32(hexAddress, prefix);

      return {
        address: bech32Address,
        name: 'Phantom Account',
        provider: window.phantom.ethereum,
        publicKey: hexAddress
      };
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected the connection request');
      }
      throw new Error(`Phantom connection failed: ${error.message}`);
    }
  }

  /**
   * Get current address for Initia chains - UTILITY METHOD (no hooks)
   * This method should be called from components that have access to the address
   */
  static getInitiaAddressFromWagmi(
    wagmiAddress: string,
    chainId: string
  ): string {
    if (!wagmiAddress) return '';

    const prefix = this.getBech32Prefix(chainId);
    const hexAddress = AddressUtils.toPrefixedHex(wagmiAddress);
    return AddressUtils.toBech32(hexAddress, prefix);
  }

  /**
   * Get current hex address from wagmi address - UTILITY METHOD (no hooks)
   */
  static getHexAddressFromWagmi(wagmiAddress: string): string {
    if (!wagmiAddress) return '';
    return AddressUtils.toPrefixedHex(wagmiAddress);
  }

  /**
   * Get bech32 prefix based on chain ID
   */
  private static getBech32Prefix(chainId: string): string {
    // if (chainId === 'initia-1') {
    //   return 'init';
    // } else if (chainId.startsWith('intergaze')) {
    //   return 'intergaze';
    // }
    return 'init'; // default
  }

  /**
   * Add Initia network to MetaMask
   */
  private static async addInitiaNetworkToMetaMask(
    chainConfig: ChainConfig
  ): Promise<void> {
    if (!window.ethereum?.isMetaMask) return;

    try {
      // For mainnet Initia, we might not need to add network
      if (chainConfig.chainId === 'initia-1') {
        return;
      }

      // For custom networks like Intergaze, add the network
      const chainIdNumber = this.extractChainIdNumber(chainConfig.chainId);
      const networkParams = {
        chainId: `0x${chainIdNumber.toString(16)}`,
        chainName: chainConfig.chainName,
        rpcUrls: [chainConfig.rpc],
        nativeCurrency: {
          name: chainConfig.currency?.coinDenom || 'INIT',
          symbol: chainConfig.currency?.coinDenom || 'INIT',
          decimals: chainConfig.currency?.coinDecimals || 18
        }
        // blockExplorerUrls: chainConfig.explorers ? [chainConfig.explorers[0]] : []
      };

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams]
      });
    } catch (error) {
      console.warn('Failed to add network to MetaMask:', error);
    }
  }

  /**
   * Add Initia network to Leap
   */
  private static async addInitiaNetworkToLeap(
    chainConfig: ChainConfig
  ): Promise<void> {
    if (!window.leap?.ethereum) return;

    try {
      const chainIdNumber = this.extractChainIdNumber(chainConfig.chainId);
      const networkParams = {
        chainId: `0x${chainIdNumber.toString(16)}`,
        chainName: chainConfig.chainName,
        rpcUrls: [chainConfig.rpc],
        nativeCurrency: {
          name: chainConfig.currency?.coinDenom || 'INIT',
          symbol: chainConfig.currency?.coinDenom || 'INIT',
          decimals: chainConfig.currency?.coinDecimals || 18
        }
        // blockExplorerUrls: chainConfig.explorers ? [chainConfig.explorers[0]] : []
      };

      await window.leap.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams]
      });
    } catch (error) {
      console.warn('Failed to add network to Leap:', error);
    }
  }

  /**
   * Add Initia network to Phantom
   */
  private static async addInitiaNetworkToPhantom(
    chainConfig: ChainConfig
  ): Promise<void> {
    if (!window.phantom?.ethereum) return;

    try {
      const chainIdNumber = this.extractChainIdNumber(chainConfig.chainId);
      const networkParams = {
        chainId: `0x${chainIdNumber.toString(16)}`,
        chainName: chainConfig.chainName,
        rpcUrls: [chainConfig.rpc],
        nativeCurrency: {
          name: chainConfig.currency?.coinDenom || 'INIT',
          symbol: chainConfig.currency?.coinDenom || 'INIT',
          decimals: chainConfig.currency?.coinDecimals || 18
        }
        // blockExplorerUrls: chainConfig.explorers ? [chainConfig.explorers[0]] : []
      };

      await window.phantom.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams]
      });
    } catch (error) {
      console.warn('Failed to add network to Phantom:', error);
    }
  }

  /**
   * Extract numeric chain ID from chain ID string
   */
  private static extractChainIdNumber(chainId: string): number {
    // Extract numbers from chain ID
    const match = chainId.match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
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
   * Connect to Leap wallet (for Stargaze)
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
      if (window.cosmostation.providers?.keplr) {
        await this.suggestChain(
          window.cosmostation.providers.keplr,
          chainConfig
        );
      }

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

    try {
      await this.suggestChain(window.ledger, chainConfig);
    } catch (error) {
      console.warn(
        'Ledger chain suggestion failed, continuing with enable:',
        error
      );
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
        name: 'MetaMask Account',
        provider: window.ethereum
      };
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected the connection request');
      }
      throw error;
    }
  }

  // ... (include all the remaining methods from the previous version: Leap Snap, WalletConnect, etc.)

  /**
   * Check if Leap Cosmos Snap is installed and initialized
   */
  private static async isSnapInstalled(): Promise<boolean> {
    if (!window.ethereum) return false;

    try {
      const snaps = await window.ethereum.request({
        method: 'wallet_getSnaps'
      });
      return Object.keys(snaps).includes(this.LEAP_SNAP_ID);
    } catch (error) {
      console.warn('Error checking snap installation:', error);
      return false;
    }
  }

  /**
   * Install Leap Cosmos Snap if not already installed
   */
  private static async installSnap(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_requestSnaps',
        params: {
          [this.LEAP_SNAP_ID]: {
            version: '^0.1.0'
          }
        }
      });
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected snap installation');
      }
      throw new Error(`Failed to install Leap Cosmos Snap: ${error.message}`);
    }
  }

  /**
   * Setup Leap Cosmos Snap (install and initialize if needed)
   */
  private static async setupLeapSnap(): Promise<void> {
    if (!(await this.isSnapInstalled())) {
      await this.installSnap();
    }
  }

  /**
   * Suggest chain to Leap Cosmos Snap
   */
  private static async suggestChainToSnap(
    chainConfig: ChainConfig
  ): Promise<void> {
    try {
      const chainInfo = {
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
        currencies: chainConfig.currencies || [
          {
            coinDenom: chainConfig.currency?.coinDenom || 'STARS',
            coinMinimalDenom:
              chainConfig.currency?.coinMinimalDenom || 'ustars',
            coinDecimals: chainConfig.currency?.coinDecimals || 6
          }
        ],
        feeCurrencies: chainConfig.feeCurrencies || [
          {
            coinDenom: chainConfig.currency?.coinDenom || 'STARS',
            coinMinimalDenom:
              chainConfig.currency?.coinMinimalDenom || 'ustars',
            coinDecimals: chainConfig.currency?.coinDecimals || 6,
            gasPriceStep: chainConfig.gasPriceStep || {
              low: 0.01,
              average: 0.025,
              high: 0.04
            }
          }
        ],
        stakeCurrency: chainConfig.stakeCurrency || {
          coinDenom: chainConfig.currency?.coinDenom || 'STARS',
          coinMinimalDenom: chainConfig.currency?.coinMinimalDenom || 'ustars',
          coinDecimals: chainConfig.currency?.coinDecimals || 6
        }
      };

      await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: this.LEAP_SNAP_ID,
          request: {
            method: 'suggestChain',
            params: {
              chainInfo
            }
          }
        }
      });
    } catch (error) {
      console.warn('Chain suggestion to snap failed:', error);
    }
  }

  /**
   * Get account from Leap Cosmos Snap
   */
  private static async getSnapAccount(chainId: string): Promise<any> {
    try {
      const response = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: this.LEAP_SNAP_ID,
          request: {
            method: 'getKey',
            params: {
              chainId: chainId
            }
          }
        }
      });

      return response;
    } catch (error: any) {
      if (
        error.code === -32603 &&
        error.message?.includes('Method not found')
      ) {
        throw new Error(
          'Snap method not supported. Please update Leap Cosmos Snap.'
        );
      }
      if (error.code === -32601) {
        throw new Error(
          'Snap method not found. Please ensure you have the latest version.'
        );
      }
      throw new Error(`Failed to get account: ${error.message}`);
    }
  }

  /**
   * Connect to Leap Cosmos Snap for MetaMask
   */
  static async connectLeapSnap(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
    if (!window.ethereum?.isMetaMask) {
      throw new Error('MetaMask extension not found');
    }

    try {
      await this.setupLeapSnap();
      await this.suggestChainToSnap(chainConfig);

      const account = await this.getSnapAccount(chainConfig.chainId);

      if (!account?.address) {
        throw new Error(`No account found for ${chainConfig.chainName}`);
      }

      return {
        address: account.address,
        publicKey: account.pubKey,
        name: account.name || `Leap Snap ${chainConfig.chainName} Account`,
        algo: account.algo || 'secp256k1'
      };
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('User rejected the connection request');
      }

      if (
        error.message.includes('Snap method') ||
        error.message.includes('No account found')
      ) {
        throw error;
      }

      throw new Error(`Leap Cosmos Snap connection failed: ${error.message}`);
    }
  }

  /**
   * Connect to WalletConnect
   */
  static async connectWalletConnect(
    chainConfig: ChainConfig
  ): Promise<WalletConnectionResult> {
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
      await this.suggestChain(wallet, chainConfig);

      if (wallet.enable) {
        await wallet.enable(chainConfig.chainId);
      }

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
      const chainInfo = {
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
        currencies: chainConfig.currencies || [
          {
            coinDenom: chainConfig.currency?.coinDenom || 'INIT',
            coinMinimalDenom: chainConfig.currency?.coinMinimalDenom || 'uinit',
            coinDecimals: chainConfig.currency?.coinDecimals || 6
          }
        ],
        feeCurrencies: chainConfig.feeCurrencies || [
          {
            coinDenom: chainConfig.currency?.coinDenom || 'INIT',
            coinMinimalDenom: chainConfig.currency?.coinMinimalDenom || 'uinit',
            coinDecimals: chainConfig.currency?.coinDecimals || 6,
            gasPriceStep: chainConfig.gasPriceStep || {
              low: 0.01,
              average: 0.025,
              high: 0.04
            }
          }
        ],
        stakeCurrency: chainConfig.stakeCurrency || {
          coinDenom: chainConfig.currency?.coinDenom || 'INIT',
          coinMinimalDenom: chainConfig.currency?.coinMinimalDenom || 'uinit',
          coinDecimals: chainConfig.currency?.coinDecimals || 6
        }
      };

      await wallet.experimentalSuggestChain(chainInfo);
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
      'leap-metamask-cosmos-snap': () => !!window.ethereum?.isMetaMask,
      phantom: () => !!window.phantom?.ethereum,
      walletconnect: () => true
    };

    const checker = walletMap[walletId];
    if (checker) {
      return checker();
    }

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

      // For Initia chains, check EVM wallet status
      if (
        (chainId === 'initia-1' || chainId?.startsWith('intergaze')) &&
        (walletId === 'metamask' || walletId === 'phantom')
      ) {
        const provider =
          walletId === 'metamask' ? window.ethereum : window.phantom?.ethereum;
        if (!provider) return false;

        try {
          const accounts = await provider.request({ method: 'eth_accounts' });
          return accounts.length > 0;
        } catch {
          return false;
        }
      }

      // For Leap on Initia chains, check EVM mode first
      if (
        (chainId === 'initia-1' || chainId?.startsWith('intergaze')) &&
        walletId === 'leap-extension'
      ) {
        if (window.leap?.ethereum) {
          try {
            const accounts = await window.leap.ethereum.request({
              method: 'eth_accounts'
            });
            return accounts.length > 0;
          } catch {
            // Fallback to Cosmos mode
          }
        }
      }

      // Check Cosmos wallets
      if (
        walletConfig.supportedTypes.includes('stargaze') ||
        walletConfig.supportedTypes.includes('intergaze')
      ) {
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

      return false;
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
  }

  /**
   * Get wallet accounts with Wagmi integration for Initia chains
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

      // For Initia chains, return both hex and bech32 addresses
      if (
        (chainId === 'initia-1' || chainId?.startsWith('intergaze')) &&
        (walletId === 'metamask' || walletId === 'phantom')
      ) {
        const provider =
          walletId === 'metamask' ? window.ethereum : window.phantom?.ethereum;
        if (provider) {
          const accounts = await provider.request({ method: 'eth_accounts' });
          const prefix = this.getBech32Prefix(chainId);

          return accounts.map((hexAddress: string) => ({
            address: AddressUtils.toBech32(hexAddress, prefix),
            hexAddress: hexAddress,
            name: `${walletConfig.name} Account`
          }));
        }
      }

      // For Leap on Initia chains
      if (
        (chainId === 'initia-1' || chainId?.startsWith('intergaze')) &&
        walletId === 'leap-extension'
      ) {
        if (window.leap?.ethereum) {
          try {
            const accounts = await window.leap.ethereum.request({
              method: 'eth_accounts'
            });
            const prefix = this.getBech32Prefix(chainId);

            return accounts.map((hexAddress: string) => ({
              address: AddressUtils.toBech32(hexAddress, prefix),
              hexAddress: hexAddress,
              name: 'Leap Account'
            }));
          } catch {
            // Fallback to Cosmos mode
          }
        }
      }

      // For Cosmos wallets
      if (
        walletConfig.supportedTypes.includes('stargaze') ||
        walletConfig.supportedTypes.includes('intergaze')
      ) {
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

  /**
   * Send transaction using specific wallet with Wagmi integration for Initia
   */
  static async sendTransaction(
    walletId: string,
    chainId: string,
    transaction: any
  ): Promise<string> {
    const walletConfig = getWalletConfig(walletId);
    if (!walletConfig) {
      throw new Error(`Unsupported wallet: ${walletId}`);
    }

    // Handle EVM transactions for Initia chains
    if (
      (chainId === 'initia-1' || chainId.startsWith('intergaze')) &&
      (walletId === 'metamask' ||
        walletId === 'phantom' ||
        walletId === 'leap-extension')
    ) {
      let provider;

      if (walletId === 'metamask') {
        provider = window.ethereum;
      } else if (walletId === 'phantom') {
        provider = window.phantom?.ethereum;
      } else if (walletId === 'leap-extension' && window.leap?.ethereum) {
        provider = window.leap.ethereum;
      }

      if (!provider) {
        throw new Error(`${walletConfig.name} provider not found`);
      }

      try {
        const txHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [transaction]
        });
        return txHash;
      } catch (error: any) {
        throw new Error(`Transaction failed: ${error.message}`);
      }
    }

    // Handle Cosmos transactions
    const walletKey = walletId.replace('-extension', '');
    const wallet = window[walletKey];

    if (!wallet) {
      throw new Error(`${walletConfig.name} not found`);
    }

    if (!wallet.sendTx) {
      throw new Error(
        `${walletConfig.name} does not support transaction sending`
      );
    }

    try {
      const result = await wallet.sendTx(chainId, transaction);
      return result.transactionHash || result.txhash || result;
    } catch (error: any) {
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }

  /**
   * Sign message using specific wallet with Wagmi integration for Initia
   */
  static async signMessage(
    walletId: string,
    chainId: string,
    message: string,
    address: string
  ): Promise<any> {
    const walletConfig = getWalletConfig(walletId);
    if (!walletConfig) {
      throw new Error(`Unsupported wallet: ${walletId}`);
    }

    // Handle EVM message signing for Initia chains
    if (
      (chainId === 'initia-1' || chainId.startsWith('intergaze')) &&
      (walletId === 'metamask' ||
        walletId === 'phantom' ||
        walletId === 'leap-extension')
    ) {
      let provider;

      if (walletId === 'metamask') {
        provider = window.ethereum;
      } else if (walletId === 'phantom') {
        provider = window.phantom?.ethereum;
      } else if (walletId === 'leap-extension' && window.leap?.ethereum) {
        provider = window.leap.ethereum;
      }

      if (!provider) {
        throw new Error(`${walletConfig.name} provider not found`);
      }

      try {
        // For Initia chains, use the hex address for signing
        const hexAddress = AddressUtils.toPrefixedHex(address);
        const signature = await provider.request({
          method: 'personal_sign',
          params: [message, hexAddress]
        });
        return signature;
      } catch (error: any) {
        throw new Error(`Message signing failed: ${error.message}`);
      }
    }

    // Handle Cosmos message signing
    const walletKey = walletId.replace('-extension', '');
    const wallet = window[walletKey];

    if (!wallet) {
      throw new Error(`${walletConfig.name} not found`);
    }

    if (!wallet.signArbitrary) {
      throw new Error(`${walletConfig.name} does not support message signing`);
    }

    try {
      const result = await wallet.signArbitrary(chainId, address, message);
      return result;
    } catch (error: any) {
      throw new Error(`Message signing failed: ${error.message}`);
    }
  }

  /**
   * Get wallet balance for specific token
   */
  static async getWalletBalance(
    walletId: string,
    chainId: string,
    address: string,
    tokenAddress?: string
  ): Promise<string> {
    const walletConfig = getWalletConfig(walletId);
    if (!walletConfig) {
      throw new Error(`Unsupported wallet: ${walletId}`);
    }

    throw new Error('Balance checking requires RPC integration');
  }

  /**
   * Add token to wallet (for EVM wallets)
   */
  static async addTokenToWallet(
    walletId: string,
    tokenAddress: string,
    tokenSymbol: string,
    tokenDecimals: number,
    tokenImage?: string
  ): Promise<boolean> {
    if (walletId === 'metamask' && window.ethereum?.isMetaMask) {
      try {
        const wasAdded = await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              image: tokenImage
            }
          }
        });
        return wasAdded;
      } catch (error) {
        console.error('Error adding token to MetaMask:', error);
        return false;
      }
    }

    if (walletId === 'phantom' && window.phantom?.ethereum) {
      try {
        const wasAdded = await window.phantom.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              image: tokenImage
            }
          }
        });
        return wasAdded;
      } catch (error) {
        console.error('Error adding token to Phantom:', error);
        return false;
      }
    }

    if (walletId === 'leap-extension' && window.leap?.ethereum) {
      try {
        const wasAdded = await window.leap.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              image: tokenImage
            }
          }
        });
        return wasAdded;
      } catch (error) {
        console.error('Error adding token to Leap:', error);
        return false;
      }
    }

    throw new Error(`Token addition not supported for ${walletId}`);
  }

  /**
   * Check if Leap Cosmos Snap is installed
   */
  static async isLeapSnapInstalled(): Promise<boolean> {
    return await this.isSnapInstalled();
  }

  /**
   * Debug: Get detailed error information for Leap Snap
   */
  static async debugLeapSnap(): Promise<any> {
    if (!window.ethereum) {
      return { error: 'MetaMask not found' };
    }

    try {
      const snaps = await window.ethereum.request({
        method: 'wallet_getSnaps'
      });

      const isInstalled = this.LEAP_SNAP_ID in snaps;

      if (!isInstalled) {
        return {
          error: 'Leap Cosmos Snap not installed',
          installedSnaps: Object.keys(snaps)
        };
      }

      const snapInfo = snaps[this.LEAP_SNAP_ID];

      return {
        snapInstalled: true,
        snapInfo: snapInfo,
        snapId: this.LEAP_SNAP_ID
      };
    } catch (error: any) {
      return {
        error: error.message,
        code: error.code,
        details: error
      };
    }
  }
}
