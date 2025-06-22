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
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, ExternalLink, Download } from 'lucide-react';
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
  >(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showMoreWallets, setShowMoreWallets] = useState(false);
  const { toast } = useToast();

  // Use chain registry data
  const chainInfo = useChainRegistry(chainName);

  const handleStargazeWalletSelect = async (wallet: WalletConfig) => {
    try {
      setConnecting(wallet.id);

      if (!chainInfo?.config) {
        throw new Error('Chain configuration not found');
      }

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
    if (selectedType === 'stargaze') {
      await handleStargazeWalletSelect(wallet);
    } else if (selectedType === 'ethereum') {
      await handleEvmWalletSelect(wallet);
    }
  };

  const getWalletsForType = (
    type: 'stargaze' | 'ethereum'
  ): WalletConfig[] | [] => {
    if (type === 'stargaze') {
      return STARGAZE_WALLETS;
    }

    return [];
  };

  // Separate installed and not installed wallets
  const getInstalledWallets = (
    type: 'stargaze' | 'ethereum'
  ): WalletConfig[] => {
    return getWalletsForType(type).filter((wallet) =>
      isWalletInstalled(wallet.id)
    );
  };

  const getNotInstalledWallets = (
    type: 'stargaze' | 'ethereum'
  ): WalletConfig[] => {
    return getWalletsForType(type).filter(
      (wallet) => !isWalletInstalled(wallet.id)
    );
  };

  const resetModal = () => {
    setSelectedType(null);
    setConnecting(null);
    setShowMoreWallets(false);
    onClose();
  };

  const handleBackToWallets = () => {
    if (showMoreWallets) {
      setShowMoreWallets(false);
    } else {
      setSelectedType(null);
    }
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
          <div className="flex items-center gap-4 px-6 pb-4 pt-6">
            {(selectedType || showMoreWallets) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToWallets}
                className="rounded-full p-2 hover:bg-gray-800"
                disabled={!!connecting}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-2">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Connect Wallet</h2>
                <p className="text-sm text-gray-400">
                  {showMoreWallets
                    ? 'Install additional wallets'
                    : selectedType
                    ? `Choose your ${selectedType.toUpperCase()} wallet`
                    : 'Choose your preferred blockchain'}
                </p>
              </div>
            </div>
          </div>

          <ScrollArea
            className={cn((selectedType || showMoreWallets) && 'h-[60vh]')}
          >
            <div className="px-6 py-6">
              {!selectedType && !showMoreWallets ? (
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
              ) : showMoreWallets ? (
                // More Wallets (Not Installed)
                <div className="space-y-3">
                  {getNotInstalledWallets(selectedType!).map((wallet) => (
                    <div
                      key={wallet.id}
                      className="rounded-xl border border-gray-700 bg-gray-800/50 p-4 transition-all duration-200 hover:border-gray-600"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={wallet.logo}
                          alt={wallet.name}
                          className="h-10 w-10 rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">
                            {wallet.name}
                          </h3>
                          <p className="text-sm text-gray-400">Not installed</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleInstallWallet(wallet)}
                          className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Download className="h-4 w-4" />
                          Install
                        </Button>
                      </div>
                    </div>
                  ))}
                  {getNotInstalledWallets(selectedType!).length === 0 && (
                    <div className="py-8 text-center text-gray-400">
                      <p>All wallets are already installed!</p>
                    </div>
                  )}
                </div>
              ) : (
                // Installed Wallet Selection
                <div className="space-y-3">
                  {getInstalledWallets(selectedType!).map((wallet) => (
                    <WalletItem
                      key={wallet.id}
                      wallet={wallet}
                      isConnecting={isWalletConnecting(wallet.id)}
                      isInstalled={true}
                      onConnect={handleWalletSelect}
                      chainInfo={
                        selectedType === 'stargaze' ? chainInfo : undefined
                      }
                    />
                  ))}

                  {/* Show More Wallets Button */}
                  {getNotInstalledWallets(selectedType!).length > 0 && (
                    <div className="border-t border-gray-700 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowMoreWallets(true)}
                        className="w-full gap-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        disabled={!!connecting}
                      >
                        <ExternalLink className="h-4 w-4" />
                        More Wallets (
                        {getNotInstalledWallets(selectedType!).length})
                      </Button>
                    </div>
                  )}

                  {/* No Wallets Installed Message */}
                  {getInstalledWallets(selectedType!).length === 0 && (
                    <div className="py-8 text-center">
                      <div className="mb-4">
                        <Wallet className="mx-auto mb-2 h-12 w-12 text-gray-500" />
                        <h3 className="mb-2 text-lg font-semibold text-white">
                          No Wallets Found
                        </h3>
                        <p className="mb-4 text-sm text-gray-400">
                          You don&apos;t have any {selectedType} wallets
                          installed.
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowMoreWallets(true)}
                        className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4" />
                        Install Wallets
                      </Button>
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
