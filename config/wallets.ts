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

  // Fallback logos based on wallet name - using exact keys from stargazeWallets
  const logoMap: Record<string, string> = {
    'keplr-extension': 'https://wallet.keplr.app/assets/favicon-32x32.png',
    'keplr-mobile': 'https://wallet.keplr.app/assets/favicon-32x32.png',
    'leap-extension': 'https://assets.leapwallet.io/logo.svg',
    'leap-cosmos-mobile': 'https://assets.leapwallet.io/logo.svg',
    'leap-metamask-cosmos-snap': 'https://metamask.io/img/favicon.ico',
    'xdefi-extension': 'https://xdefi.io/favicon.ico',
    'station-extension':
      'https://assets.terra.money/img/wallet-providers/station.svg',
    'cosmostation-extension': 'https://wallet.cosmostation.io/favicon.ico'
  };

  return logoMap[walletName] || 'https://via.placeholder.com/32x32?text=W';
};

// Helper function to get wallet color scheme
const getWalletColor = (walletName: string): string => {
  const colorMap: Record<string, string> = {
    'keplr-extension': 'from-blue-500 to-purple-600',
    'keplr-mobile': 'from-blue-500 to-purple-600',
    'leap-extension': 'from-orange-500 to-red-600',
    'leap-cosmos-mobile': 'from-orange-500 to-red-600',
    'leap-metamask-cosmos-snap': 'from-orange-400 to-yellow-500',
    'xdefi-extension': 'from-cyan-500 to-blue-600',
    'station-extension': 'from-green-500 to-blue-600',
    'cosmostation-extension': 'from-purple-500 to-indigo-600'
  };

  return colorMap[walletName] || 'from-gray-500 to-gray-700';
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
    logo:
      typeof wallet.walletInfo.logo === 'string'
        ? (wallet.walletInfo.logo as string)
        : wallet.walletInfo.logo?.major ?? '',
    description:
      wallet.walletInfo.description ||
      `${
        wallet.walletInfo.prettyName || wallet.walletName
      } wallet for Stargaze network`,
    color: getWalletColor(wallet.walletName),
    supportedTypes: ['stargaze'] as ('stargaze' | 'evm')[],
    downloadUrl:
      wallet.walletInfo?.downloads?.[0]?.link ??
      (typeof wallet.appUrl === 'string' ? wallet.appUrl : undefined)
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
