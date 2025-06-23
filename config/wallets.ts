import { wallets } from 'cosmos-kit';
import { WalletConfig } from '@/types/wallet';

const stargazeWallets = [
  'keplr-extension',
  'keplr-mobile',
  'leap-extension',
  'leap-cosmos-mobile',
  'leap-metamask-cosmos-snap',
  'xdefi-extension',
  'station-extension',
  'cosmostation-extension'
];

// Helper function to get wallet logo
const getWalletLogo = (walletName: string, logo?: string): string => {
  if (logo) return logo;

  // Fallback logos based on wallet name
  const logoMap: Record<string, string> = {
    keplr: 'https://wallet.keplr.app/assets/favicon-32x32.png',
    leap: 'https://assets.leapwallet.io/logo.svg',
    cosmostation: 'https://wallet.cosmostation.io/favicon.ico',
    station: 'https://assets.terra.money/img/wallet-providers/station.svg',
    walletconnect:
      'https://registry.walletconnect.com/v2/logo/lg/walletconnect-logo.png',
    compass: 'https://compasswallet.io/favicon.ico',
    owallet: 'https://owallet.dev/favicon.ico',
    coin98: 'https://coin98.com/favicon.ico',
    xdefi: 'https://xdefi.io/favicon.ico',
    trust:
      'https://trustwallet.com/assets/images/media/assets/trust_platform.svg',
    metamask: 'https://metamask.io/img/favicon.ico',
    ledger: 'https://www.ledger.com/favicon.ico'
  };

  const key = Object.keys(logoMap).find((k) =>
    walletName.toLowerCase().includes(k)
  );
  return logoMap[key!] || 'https://via.placeholder.com/32x32?text=W';
};

// Helper function to get wallet color scheme
const getWalletColor = (walletName: string): string => {
  const colorMap: Record<string, string> = {
    keplr: 'from-blue-500 to-purple-600',
    leap: 'from-orange-500 to-red-600',
    cosmostation: 'from-purple-500 to-indigo-600',
    station: 'from-green-500 to-blue-600',
    walletconnect: 'from-blue-400 to-cyan-500',
    compass: 'from-indigo-500 to-purple-600',
    owallet: 'from-pink-500 to-rose-600',
    coin98: 'from-yellow-500 to-orange-600',
    xdefi: 'from-cyan-500 to-blue-600',
    trust: 'from-blue-600 to-indigo-700',
    metamask: 'from-orange-400 to-yellow-500',
    ledger: 'from-gray-600 to-gray-800'
  };

  const key = Object.keys(colorMap).find((k) =>
    walletName.toLowerCase().includes(k)
  );
  return colorMap[key!] || 'from-gray-500 to-gray-700';
};
// Generate STARGAZE_WALLETS from cosmos-kit wallets
export const STARGAZE_WALLETS: WalletConfig[] = wallets
  .filter((wallet) => {
    // Most cosmos-kit wallets support multiple chains including Stargaze
    // We'll include all wallets and let the user choose
    return stargazeWallets.includes(wallet.walletName);
  })
  .map((wallet) => ({
    id: wallet.walletName,
    name: wallet.walletInfo.prettyName || wallet.walletName,
    logo: getWalletLogo(wallet.walletName, wallet.walletInfo.logo as string),
    description:
      wallet.walletInfo.description ||
      `${
        wallet.walletInfo.prettyName || wallet.walletName
      } wallet for Stargaze network`,
    color: getWalletColor(wallet.walletName),
    supportedTypes: ['stargaze'] as ('stargaze' | 'evm')[],
    downloadUrl: wallet.appUrl ? String(wallet.appUrl) : undefined
  }))
  .filter(
    (wallet, index, self) =>
      // Remove duplicates based on wallet name
      index === self.findIndex((w) => w.name === wallet.name)
  );

// Export wallet names for cosmos-kit integration
export const STARGAZE_WALLET_NAMES = STARGAZE_WALLETS.map(
  (wallet) => wallet.id
);

// Helper function to get specific wallet config
export const getWalletConfig = (walletId: string): WalletConfig | undefined => {
  return STARGAZE_WALLETS.find((wallet) => wallet.id === walletId);
};

// Helper function to check if wallet is available
export const isWalletAvailable = (walletId: string): boolean => {
  return wallets.some((wallet) => wallet.walletName === walletId);
};

// Helper function to check if wallet supports Stargaze (runtime check)
export const checkStargazeSupport = async (
  walletName: string
): Promise<boolean> => {
  try {
    // This would need to be implemented based on your specific wallet connection logic
    // For now, we assume most cosmos wallets support Stargaze
    return true;
  } catch (error) {
    console.warn(`Could not check Stargaze support for ${walletName}:`, error);
    return false;
  }
};
