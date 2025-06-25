'use client';

// Add this declaration to extend the Window interface
declare global {
  interface Window {
    keplr?: any;
    ethereum?: any;
    leap?: any;
    cosmostation?: any;
  }
}

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '../../ui/use-toast';
import { ScrollArea } from '../../ui/scroll-area';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import useChainRegistry from '@/hooks/useChainRegistry';
import { WalletConfig } from '@/types/wallet';
import WalletService from '@/lib/walletService';
import { STARGAZE_WALLETS } from '@/config/wallets';
import WalletItem from './wallet-item';

// Main Component
interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  onConnectWallet?: (
    walletId: string,
    walletType: 'stargaze' | 'ethereum'
  ) => void;
  chainName?: string;
}

export default function WalletConnectModal({
  isOpen,
  onClose,
  loading,
  onConnectWallet,
  chainName = 'stargaze'
}: WalletConnectModalProps) {
  const [selectedType, setSelectedType] = useState<
    'stargaze' | 'ethereum' | null
  >('stargaze');
  const [connecting, setConnecting] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  // Use chain registry data
  const chainInfo = useChainRegistry(chainName);

  // Detect if running on mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleStargazeWalletSelect = async (wallet: WalletConfig) => {
    try {
      setConnecting(wallet.id);

      // console.log("chainInfo", chainInfo);

      // if (!chainInfo?.config) {
      //   throw new Error('Chain configuration not found');
      // }

      if (onConnectWallet) {
        onConnectWallet(wallet.id, 'stargaze');
      }

      toast({
        variant: 'success',
        title: 'Connected!',
        description: `Successfully connected to ${wallet.name}`
      });

      onClose();
    } catch (error: any) {
      console.error('Stargaze wallet connection error:', error);
      let errorMessage = error.message;

      if (error.message?.includes('rejected')) {
        errorMessage = 'Connection was rejected by the user';
      } else if (
        error.message?.includes('not installed') ||
        error.message?.includes('not found')
      ) {
        errorMessage = `${wallet.name} is not installed. Please install the extension.`;
      }

      toast({
        title: 'Connection failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setConnecting(null);
    }
  };

  const handleEvmWalletSelect = async (wallet: WalletConfig) => {
    try {
      setConnecting(wallet.id);

      switch (wallet.id) {
        case 'metamask':
          await WalletService.connectMetaMask();
          break;
        default:
          if (onConnectWallet) {
            await onConnectWallet(wallet.id, 'ethereum');
          } else {
            throw new Error(`${wallet.name} connection not implemented`);
          }
      }

      toast({
        variant: 'success',
        title: 'Connected!',
        description: `Successfully connected to ${wallet.name}`
      });

      if (onConnectWallet) {
        onConnectWallet(wallet.id, 'ethereum');
      }

      onClose();
    } catch (error: any) {
      console.error('EVM wallet connection error:', error);
      let errorMessage = error.message;

      if (
        error.message?.includes('not installed') ||
        error.message?.includes('not found')
      ) {
        errorMessage = `${wallet.name} is not installed. Please install the extension.`;
      } else if (error.message?.includes('rejected')) {
        errorMessage = 'Connection was rejected by the user';
      }

      toast({
        title: 'Connection failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setConnecting(null);
    }
  };

  const handleWalletSelect = async (wallet: WalletConfig) => {
    // Only proceed if wallet is installed
    if (!isWalletInstalled(wallet.id)) {
      return;
    }

    if (selectedType === 'stargaze') {
      await handleStargazeWalletSelect(wallet);
    } else if (selectedType === 'ethereum') {
      await handleEvmWalletSelect(wallet);
    }
  };

  // Filter wallets based on platform
  const filterWalletsByPlatform = (wallets: WalletConfig[]): WalletConfig[] => {
    if (isMobile) {
      // On mobile, show all wallets
      return wallets;
    } else {
      // On web, hide wallets with "-mobile" in their id
      return wallets.filter((wallet) => !wallet.id.includes('-mobile'));
    }
  };

  const getWalletsForType = (
    type: 'stargaze' | 'ethereum'
  ): WalletConfig[] | [] => {
    if (type === 'stargaze') {
      return filterWalletsByPlatform(STARGAZE_WALLETS);
    }

    return [];
  };

  // New function to get sorted wallets (installed first)
  const getSortedWalletsForType = (
    type: 'stargaze' | 'ethereum'
  ): WalletConfig[] | [] => {
    const wallets = getWalletsForType(type);

    // Sort wallets: installed first, then non-installed
    return wallets.sort((a, b) => {
      const aInstalled = isWalletInstalled(a.id);
      const bInstalled = isWalletInstalled(b.id);

      // If both are installed or both are not installed, maintain original order
      if (aInstalled === bInstalled) {
        return 0;
      }

      // If a is installed and b is not, a comes first
      if (aInstalled && !bInstalled) {
        return -1;
      }

      // If b is installed and a is not, b comes first
      return 1;
    });
  };

  const resetModal = () => {
    setSelectedType('stargaze');
    setConnecting(null);
    onClose();
  };

  const handleBackToWallets = () => {
    setSelectedType(null);
  };

  const isWalletConnecting = (walletId: string) => {
    return connecting === walletId;
  };

  const isWalletInstalled = (walletId: string) => {
    return WalletService.isWalletInstalled(walletId);
  };

  const handleInstallWallet = (wallet: WalletConfig) => {
    // Open wallet installation page
    if (wallet.downloadUrl) {
      window.open(wallet.downloadUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-[95%] rounded-2xl border-gray-800 bg-gradient-to-br from-gray-900 to-black px-0 md:!max-w-lg">
        <div className="w-full text-white">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 pb-4">
            {/* {selectedType && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToWallets}
                className="rounded-full p-2 hover:bg-gray-800"
                disabled={!!connecting}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )} */}
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-2">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Connect Wallet</h2>
                <p className="text-sm text-gray-400">
                  {selectedType
                    ? `Choose your ${selectedType.toUpperCase()} wallet`
                    : 'Choose your preferred blockchain'}
                </p>
              </div>
            </div>
          </div>

          <ScrollArea className={cn(selectedType && 'h-[60vh]')}>
            <div className="px-6 py-6">
              {!selectedType ? (
                // Chain Type Selection
                <div className="space-y-4">
                  <div
                    onClick={() => !connecting && setSelectedType('stargaze')}
                    className={cn(
                      'group cursor-pointer rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/40',
                      connecting && 'cursor-not-allowed opacity-50'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 p-3 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/25">
                        <svg
                          className="h-8 w-8 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                          <path d="M2 17L12 22L22 17" />
                          <path d="M2 12L12 17L22 12" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-purple-300">
                          Stargaze Network
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                          NFT marketplace and launchpad on Cosmos
                        </p>
                        {chainInfo && (
                          <p className="mt-1 text-xs text-purple-300">
                            {chainInfo.chain?.pretty_name} (
                            {chainInfo.nativeAsset?.symbol})
                          </p>
                        )}
                      </div>
                      <div className="text-gray-400 transition-colors group-hover:text-white">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // All Wallets List (Sorted: Installed first, then Not Installed)
                <div className="space-y-3">
                  {getSortedWalletsForType(selectedType!).map((wallet) => {
                    const installed = isWalletInstalled(wallet.id);
                    const connecting = isWalletConnecting(wallet.id);

                    return (
                      <div
                        key={wallet.id}
                        className={cn(
                          'group rounded-xl p-2 transition-all duration-200',
                          !connecting && 'cursor-pointer'
                        )}
                        onClick={() =>
                          installed && !connecting && handleWalletSelect(wallet)
                        }
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={wallet.logo}
                            alt={wallet.name}
                            className="h-10 w-10 rounded-[10px]"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">
                              {wallet.name}
                            </h3>
                          </div>
                          <div className="flex min-w-[80px] items-center justify-end text-right">
                            {installed ? (
                              <div className="relative">
                                <span className="text-gray-400 transition-opacity duration-100 group-hover:opacity-0">
                                  Installed
                                </span>
                                <span className="absolute inset-0 text-white opacity-0 transition-opacity duration-100 group-hover:opacity-100">
                                  Connect
                                </span>
                              </div>
                            ) : (
                              <a
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInstallWallet(wallet);
                                }}
                                className="flex items-center gap-2 bg-transparent text-gray-400 group-hover:text-white"
                              >
                                <Download className="h-4 w-4" />
                                Install
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* No Wallets Available Message */}
                  {getSortedWalletsForType(selectedType!).length === 0 && (
                    <div className="py-8 text-center">
                      <div className="mb-4">
                        <Wallet className="mx-auto mb-2 h-12 w-12 text-gray-500" />
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          No Wallets Available
                        </h3>
                        <p className="text-sm text-gray-400">
                          No {selectedType} wallets are configured.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
