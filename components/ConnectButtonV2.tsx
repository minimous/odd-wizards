'use client';

import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { DEFAULT_IMAGE_PROFILE } from '@/constants';
import { cn, formatAddress } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import WalletConnectModal from './modal/wallet/wallet-connect-modal';
import { useSyncedWallet } from '@/providers/wallet-provider-wrapper';
import { mst_users } from '@prisma/client';
import axios from 'axios';

export interface ConnectButtonProps {
  showProfile?: boolean;
  className?: string;
  defaultChain?: string;
  supportedChains?: string[]; // New prop to specify which chains this button supports
}

export default function ConnectButtonV2({
  showProfile = true,
  className,
  defaultChain = 'stargaze-1',
  supportedChains = ['stargaze-1', 'initia-1', 'intergaze-1']
}: ConnectButtonProps) {
  const [user, setUser] = useState<mst_users | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Custom wallet hook for connection logic
  const { isConnecting, isDisconnecting, connect, disconnect, clearError } =
    useWallet(defaultChain);

  // Synced wallet state for UI
  const { isConnected, address } = useSyncedWallet();

  useEffect(() => {
    async function fetchData() {
      if (address) {
        try {
          const response = await axios.get(`/api/user/${address}`);
          if (response.data?.data) {
            setUser(response.data.data.user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    }

    fetchData();
  }, [isConnected, address]);

  // Handle wallet connection from modal
  const handleConnectWallet = async (
    selectedWalletId: string,
    selectedWalletType: 'stargaze' | 'initia' | 'ethereum',
    chainId?: string
  ) => {
    try {
      clearError();

      // Use the provided chainId or fall back to defaultChain
      const targetChain = chainId || defaultChain;

      // Validate that the target chain is supported
      if (!supportedChains.includes(targetChain)) {
        throw new Error(
          `Chain ${targetChain} is not supported by this component`
        );
      }

      await connect(selectedWalletId, targetChain);

      const chainNames: Record<string, string> = {
        'stargaze-1': 'Stargaze',
        'initia-1': 'Initia',
        'intergaze-1': 'Intergaze'
      };

      toast({
        variant: 'success',
        title: 'Connected!',
        description: `Successfully connected to ${selectedWalletId} on ${
          chainNames[targetChain] || targetChain
        }`
      });

      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Connection failed:', error);
      toast({
        title: 'Connection failed',
        description: error.message || 'Failed to connect wallet',
        variant: 'destructive'
      });
    }
  };

  // Handle wallet disconnection
  const handleDisconnectWallet = async () => {
    try {
      clearError();
      await disconnect();

      toast({
        variant: 'success',
        title: 'Disconnected',
        description: 'Wallet disconnected successfully'
      });
    } catch (error: any) {
      console.error('Disconnection failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to disconnect wallet',
        variant: 'destructive'
      });
    }
  };

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
