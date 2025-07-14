'use client';

// Add this declaration to extend the Window interface
declare global {
  interface Window {
    keplr?: any;
    ethereum?: any;
    leap?: any;
    cosmostation?: any;
    phantom?: {
      solana?: any;
      ethereum?: any;
    };
  }
}

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '../../ui/use-toast';
import { ScrollArea } from '../../ui/scroll-area';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, Download, Network, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import useChainRegistry from '@/hooks/useChainRegistry';
import { WalletConfig } from '@/types/wallet';
import WalletService from '@/lib/walletService';
import { getWalletsForChain, getWalletsByChainType } from '@/config/wallets';
import { ScrollBar } from '@/components/scroll-area';
// import { useInitiaWidget } from '@initia/widget-react';

// Chain configurations
const SUPPORTED_CHAINS = [
  {
    id: 'stargaze-1',
    name: 'Stargaze',
    type: 'stargaze' as const,
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stargaze/images/stars.png',
    description: 'NFT marketplace and launchpad on Cosmos'
  },
  {
    id: 'intergaze-1',
    name: 'Intergaze',
    type: 'initia' as const,
    logo: 'https://registry.initia.xyz/images/intergaze.png',
    description: 'The Launchpad and Marketplace for Interwoven NFTs'
  }
];

// Main Component
interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  onConnectWallet?: (
    walletId: string,
    walletType: 'stargaze' | 'initia' | 'ethereum',
    chainId?: string
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
  const [selectedChain, setSelectedChain] = useState<string>('stargaze-1');
  const [selectedType, setSelectedType] = useState<
    'stargaze' | 'initia' | 'ethereum' | null
  >(null);
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

  // Get current chain configuration
  const getCurrentChain = () => {
    return SUPPORTED_CHAINS.find((chain) => chain.id === selectedChain);
  };

  // Handle chain selection
  const handleChainSelect = (chainId: string) => {
    setSelectedChain(chainId);
    const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId);
    if (chain) {
      setSelectedType(chain.type);
    }
  };

  // Handle wallet selection
  const handleWalletSelect = async (wallet: WalletConfig) => {
    try {
      setConnecting(wallet.id);

      const currentChain = getCurrentChain();
      if (!currentChain) {
        throw new Error('No chain selected');
      }

      if (onConnectWallet) {
        onConnectWallet(wallet.id, currentChain.type, selectedChain);
      }

      toast({
        variant: 'success',
        title: 'Connected!',
        description: `Successfully connected to ${wallet.name} on ${currentChain.name}`
      });

      onClose();
    } catch (error: any) {
      console.error('Wallet connection error:', error);
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

  // Get wallets for current chain
  const getWalletsForCurrentChain = (): WalletConfig[] => {
    const wallets = getWalletsForChain(selectedChain);
    return filterWalletsByPlatform(wallets);
  };

  // Get sorted wallets (installed first)
  const getSortedWallets = (): WalletConfig[] => {
    const wallets = getWalletsForCurrentChain();

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
    setSelectedChain('stargaze-1');
    setSelectedType(null);
    setConnecting(null);
    onClose();
  };

  const handleBackToChains = () => {
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
      <DialogContent
        classNameOverlay="z-[998]"
        className="z-[999] max-w-[95%] rounded-2xl border-gray-800 bg-gradient-to-br from-gray-900 to-black px-0 md:!max-w-lg"
      >
        <div className="w-full text-white">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 pb-4">
            {selectedType && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToChains}
                className="rounded-full p-2 hover:bg-gray-800"
                disabled={!!connecting}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div
                hidden={selectedType != undefined || selectedType != null}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-2"
              >
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold md:text-2xl">
                  Connect Wallet
                </h2>
                <p className="text-xs text-gray-400 md:text-sm">
                  {selectedType
                    ? `Choose your wallet for ${
                        getCurrentChain()?.name || 'selected chain'
                      }`
                    : 'Choose your preferred blockchain'}
                </p>
              </div>
            </div>
          </div>

          <ScrollArea
            className={cn(selectedType && 'max-h-[60vh] overflow-y-auto')}
          >
            <div className="px-6 py-6">
              {!selectedType ? (
                // Chain Selection
                <div className="space-y-4">
                  {SUPPORTED_CHAINS.map((chain) => (
                    <div
                      key={chain.id}
                      onClick={() => !connecting && handleChainSelect(chain.id)}
                      className={cn(
                        'group cursor-pointer rounded-2xl p-2 transition-all duration-300',
                        connecting && 'cursor-not-allowed opacity-50'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl p-3 transition-all duration-300">
                          <img
                            src={chain.logo}
                            alt={chain.name}
                            className="h-8 w-8"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white transition-colors group-hover:text-purple-300">
                            {chain.name}
                          </h3>
                          <p className="mt-1 text-xs text-gray-400">
                            {chain.description}
                          </p>
                        </div>
                        <div className="text-gray-400 transition-all transition-colors duration-300 group-hover:text-white">
                          <ArrowRight />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Wallet Selection for Selected Chain
                <div className="space-y-3">
                  {/* Wallet List */}
                  {getSortedWallets().map((wallet) => {
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
                            onError={(e: any) => {
                              e.target.src =
                                'https://via.placeholder.com/40x40?text=W';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">
                              {wallet.name}
                            </h3>
                            {wallet.id === 'initia-widget' && (
                              <p className="text-xs text-gray-400">
                                Supports Initia & Intergaze networks
                              </p>
                            )}
                          </div>
                          <div className="flex min-w-[80px] items-center justify-end text-right">
                            {installed ? (
                              <div className="relative">
                                <span className="text-gray-400 transition-opacity duration-100 group-hover:opacity-0">
                                  {connecting ? 'Connecting...' : 'Installed'}
                                </span>
                                {!connecting && (
                                  <span className="absolute inset-0 text-white opacity-0 transition-opacity duration-100 group-hover:opacity-100">
                                    Connect
                                  </span>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInstallWallet(wallet);
                                }}
                                className="flex items-center gap-2 bg-transparent text-gray-400 group-hover:text-white"
                              >
                                <Download className="h-4 w-4" />
                                Install
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* No Wallets Available Message */}
                  {getSortedWallets().length === 0 && (
                    <div className="py-8 text-center">
                      <div className="mb-4">
                        <Wallet className="mx-auto mb-2 h-12 w-12 text-gray-500" />
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          No Wallets Available
                        </h3>
                        <p className="text-sm text-gray-400">
                          No wallets are configured for{' '}
                          {getCurrentChain()?.name}.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <ScrollBar />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
