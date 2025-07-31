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
      apiUrl: env.INTERGAZE_API_URL || 'https://api.intergaze-apis.com',
      prefix: 'init',
      denom:
        'l2/fb936ffef4eb4019d82941992cc09ae2788ce7197fcb08cb00c4fe6f5e79184e',
      gasPrice:
        '0.03l2/fb936ffef4eb4019d82941992cc09ae2788ce7197fcb08cb00c4fe6f5e79184e',
      explorerUrl: 'https://scan.initia.xyz/intergaze-1',
      rewardWalletMnemonic:
        env.INTERGAZE_REWARD_WALLET_MNEMONIC || env.REWARD_WALLET_MNEMONIC || ''
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
