import { env } from 'process';
require('dotenv').config();

export interface ChainConfig {
  chainId: string;
  chainName: string;
  rpcUrl: string;
  graphqlUrl?: string;
  prefix: string;
  denom: string;
  gasPrice: string;
  apiUrl?: string;
  explorerUrl?: string;
  rewardWalletMnemonic: string;
  coinType?: number;
  hdPath?: string;
  bech32Prefix?: string;
  rpc?: string;
  rest?: string;
  currency?: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
  };
  currencies?: Array<{
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
  }>;
  feeCurrencies?: Array<{
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    gasPriceStep?: {
      low: number;
      average: number;
      high: number;
    };
  }>;
  stakeCurrency?: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
  };
}

export interface ChainConfigs {
  [key: string]: ChainConfig;
}

const getChainConfigs = (): ChainConfigs => {
  const network = env.NEXT_PUBLIC_NETWORK || 'mainnet';

  const configs: ChainConfigs = {
    stargaze: {
      chainId: network === 'mainnet' ? 'stargaze-1' : 'elgafar-1',
      chainName: 'Stargaze',
      rpcUrl: env.RPC_URL || 'https://rpc.stargaze-apis.com',
      graphqlUrl:
        network === 'mainnet'
          ? env.NEXT_PUBLIC_GRAPHQL_URL_MAINNET ||
            'https://graphql.mainnet.stargaze-apis.com/graphql'
          : env.NEXT_PUBLIC_GRAPHQL_URL_TESTNET ||
            'https://galaxy-graphql-testnet.lab.stargaze-apis.com/graphql',
      prefix: 'stars',
      denom: 'ustars',
      gasPrice: '0.025ustars',
      explorerUrl: 'https://www.mintscan.io/stargaze',
      rewardWalletMnemonic: env.REWARD_WALLET_MNEMONIC || ''
    },
    intergaze: {
      chainId: 'intergaze-1',
      chainName: 'Intergaze',
      rpcUrl: env.INTERGAZE_RPC_URL || 'https://rpc.intergaze-apis.com',
      rpc: env.INTERGAZE_RPC_URL || 'https://rpc.intergaze-apis.com',
      rest: env.INTERGAZE_REST_URL || 'https://rest.intergaze-apis.com',
      apiUrl: env.INTERGAZE_API_URL || 'https://api.intergaze-apis.com',
      prefix: 'init',
      bech32Prefix: 'init',
      denom:
        'l2/fb936ffef4eb4019d82941992cc09ae2788ce7197fcb08cb00c4fe6f5e79184e',
      gasPrice:
        '0.03l2/fb936ffef4eb4019d82941992cc09ae2788ce7197fcb08cb00c4fe6f5e79184e',
      explorerUrl: 'https://scan.initia.xyz/intergaze-1',
      rewardWalletMnemonic:
        env.INTERGAZE_REWARD_WALLET_MNEMONIC ||
        env.REWARD_WALLET_MNEMONIC ||
        '',
      coinType: 60, // Use Ethereum coinType for Initia/Intergaze (same as Keplr)
      hdPath: "m/44'/60'/0'/0/0",
      currency: {
        coinDenom: 'INIT',
        coinMinimalDenom:
          'l2/fb936ffef4eb4019d82941992cc09ae2788ce7197fcb08cb00c4fe6f5e79184e',
        coinDecimals: 6
      },
      currencies: [
        {
          coinDenom: 'INIT',
          coinMinimalDenom:
            'l2/fb936ffef4eb4019d82941992cc09ae2788ce7197fcb08cb00c4fe6f5e79184e',
          coinDecimals: 6
        }
      ],
      feeCurrencies: [
        {
          coinDenom: 'INIT',
          coinMinimalDenom:
            'l2/fb936ffef4eb4019d82941992cc09ae2788ce7197fcb08cb00c4fe6f5e79184e',
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.01,
            average: 0.03,
            high: 0.05
          }
        }
      ],
      stakeCurrency: {
        coinDenom: 'INIT',
        coinMinimalDenom:
          'l2/fb936ffef4eb4019d82941992cc09ae2788ce7197fcb08cb00c4fe6f5e79184e',
        coinDecimals: 6
      }
    },
    megaeth: {
      chainId: network === 'mainnet' ? 'megaeth-1' : 'megaeth-testnet',
      chainName: 'MegaETH',
      rpcUrl: env.MEGAETH_RPC_URL || 'https://rpc.megaeth.org',
      apiUrl: env.MEGAETH_API_URL || 'https://bff.rarible.fun/api',
      prefix: '0x',
      denom: 'ETH',
      gasPrice: '20000000000', // 20 gwei
      explorerUrl: 'https://explorer.megaeth.org',
      rewardWalletMnemonic:
        env.MEGAETH_REWARD_WALLET_MNEMONIC || env.REWARD_WALLET_MNEMONIC || ''
    },
    hyperevm: {
      chainId: network === 'mainnet' ? 'hyperevm-1' : 'hyperevm-testnet',
      chainName: 'HyperEVM',
      rpcUrl: env.HYPEREVM_RPC_URL || 'https://rpc.hyperliquid.xyz',
      apiUrl: env.HYPEREVM_API_URL || 'https://api558.liquidfi.app/api/v1',
      prefix: '0x',
      denom: 'HYPE',
      gasPrice: '20000000000', // 20 gwei
      explorerUrl: 'https://hyperliquid-testnet.explorer.caldera.xyz',
      rewardWalletMnemonic:
        env.HYPEREVM_REWARD_WALLET_MNEMONIC || env.REWARD_WALLET_MNEMONIC || '',
      coinType: 60, // Use Ethereum coinType for EVM chains
      hdPath: "m/44'/60'/0'/0/0"
    }
  };

  return configs;
};

export const getChainConfig = (chain: string): ChainConfig => {
  const configs = getChainConfigs();
  const config = configs[chain.toLowerCase()];

  if (!config) {
    throw new Error(`Chain configuration not found for: ${chain}`);
  }

  return config;
};

export const getAllChainConfigs = (): ChainConfigs => {
  return getChainConfigs();
};

export const getSupportedChains = (): string[] => {
  return Object.keys(getChainConfigs());
};

export default getChainConfigs;
