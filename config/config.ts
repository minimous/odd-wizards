import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { env } from 'process';

const getConfig = (network: string) => {
  switch (network) {
    case WalletAdapterNetwork.Devnet:
      return {
        network: WalletAdapterNetwork.Devnet,
        endpoint: env.NEXT_PUBLIC_RPC_DEVNET || 'https://api.devnet.solana.com'
      };
    case WalletAdapterNetwork.Mainnet:
      return {
        network: WalletAdapterNetwork.Mainnet,
        endpoint: 'https://api.mainnet-beta.solana.com'
      };
    case WalletAdapterNetwork.Testnet:
      return {
        network: WalletAdapterNetwork.Testnet,
        endpoint: 'https://api.testnet.solana.com'
      };
    default:
      throw new Error('Invalid network');
  }
};

export default getConfig;
