'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { useWallet } from '@/hooks/useWallet';
import { DEFAULT_IMAGE_PROFILE } from '@/constants';
import { cn, formatAddress } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import WalletConnectModal from './modal/wallet/wallet-connect-modal';

export interface ConnectButtonProps {
  showProfile?: boolean;
  className?: string;
  defaultChain?: string;
}

export default function ConnectButtonV2({
  showProfile = true,
  className,
  defaultChain = 'stargaze'
}: ConnectButtonProps) {
  const { user: dataUser } = useUser();
  const [user, setUser] = useState(dataUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Use the new wallet hook
  const {
    isConnected,
    isConnecting,
    isDisconnecting,
    address,
    walletId,
    chainName,
    currentWallet,
    connectWallet,
    disconnectWallet,
    error,
    clearError,
    refreshWalletInfo
  } = useWallet(defaultChain);

  useEffect(() => {
    setUser(dataUser);
  }, [dataUser]);

  // Handle wallet connection success from modal
  const handleConnectWallet = async (
    selectedWalletId: string,
    selectedWalletType: 'stargaze' | 'ethereum'
  ) => {
    try {
      clearError();

      // Map modal wallet types to hook wallet types
      const walletTypeMap = {
        stargaze: 'stargaze' as const,
        ethereum: 'evm' as const
      };

      const mappedWalletType = walletTypeMap[selectedWalletType];

      await connectWallet(selectedWalletId, mappedWalletType);

      toast({
        variant: 'success',
        title: 'Connected!',
        description: `Successfully connected to ${selectedWalletId}`
      });

      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection failed',
        description: error.message || 'Failed to connect wallet',
        variant: 'destructive'
      });
    }
  };

  // Handle disconnecting the wallet
  const handleDisconnectWallet = async () => {
    try {
      clearError();
      await disconnectWallet();

      toast({
        variant: 'success',
        title: 'Disconnected',
        description: 'Wallet disconnected successfully'
      });
    } catch (error: any) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to disconnect wallet',
        variant: 'destructive'
      });
    }
  };

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast({
        title: 'Wallet Error',
        description: error,
        variant: 'destructive'
      });
    }
  }, [error, toast]);

  // Refresh wallet info periodically
  useEffect(() => {
    if (isConnected && currentWallet) {
      const interval = setInterval(() => {
        refreshWalletInfo();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isConnected, currentWallet, refreshWalletInfo]);

  const isLoading = isConnecting || isDisconnecting;

  return (
    <>
      <div className="">
        {!isConnected ? (
          <Button
            variant="ghost"
            className={cn(
              'h-max rounded-xl bg-white px-4 py-2 text-black transition-all duration-200 hover:bg-white hover:text-black',
              isLoading && 'cursor-not-allowed opacity-75',
              className
            )}
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            aria-label="Connect wallet"
          >
            <div className="flex items-center text-sm font-bold">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="mr-3 h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="black"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="black"
                      d="M4 12a8 8 0 018-8V0C6.373 0 0 6.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isConnecting ? 'Connecting' : 'Disconnecting'}
                </div>
              ) : (
                <span>Connect Wallet</span>
              )}
            </div>
          </Button>
        ) : (
          <div className="flex items-center gap-x-3">
            <div className="flex flex-col items-end">
              <Button
                className={cn(
                  'h-max rounded-xl bg-white px-4 py-2 font-black text-black transition-all duration-200 hover:bg-white hover:text-black',
                  isLoading && 'cursor-not-allowed opacity-75'
                )}
                onClick={handleDisconnectWallet}
                disabled={isLoading}
                aria-label={`Disconnect wallet - ${address}`}
              >
                <span className="text-sm font-black">
                  {formatAddress(address ?? '-')}
                </span>
              </Button>

              {/* Wallet info */}
              {/* <div className="text-xs text-gray-400 mt-1 text-right">
                                <div className="flex items-center gap-1">
                                    <span className={cn(
                                        "inline-block w-2 h-2 rounded-full",
                                        walletType === 'stargaze' ? "bg-purple-500" : "bg-blue-500"
                                    )} />
                                    <span>{currentWallet?.name}</span>
                                    {chainName && (
                                        <>
                                            <span>•</span>
                                            <span>{chainName}</span>
                                        </>
                                    )}
                                </div>
                            </div> */}
            </div>

            {showProfile && (
              <div className="h-[40px] w-[40px] overflow-hidden rounded-full">
                <Link href={`/p/${address}`}>
                  <img
                    src={user?.user_image_url ?? DEFAULT_IMAGE_PROFILE}
                    onError={(e: any) => {
                      e.target.src = DEFAULT_IMAGE_PROFILE;
                    }}
                    className="h-[40px] w-[40px] rounded-full transition-transform duration-200 hover:scale-105"
                    alt="Profile"
                  />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loading={isLoading}
        onConnectWallet={handleConnectWallet}
        chainName={defaultChain}
      />
    </>
  );
}
