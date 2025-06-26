'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ConnectButton from '@/components/ConnectButton';
import { useWallet } from '@/hooks/useWallet';
import axios from 'axios';
import { useUser } from '@/hooks/useUser';
import getConfig from '@/config/config';
import { usePathname } from 'next/navigation';
import { cn, formatAddress } from '@/lib/utils';
import { useNavbarMobile } from '@/hooks/useNavbarMobile';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useToast } from '../ui/use-toast';
import { useLoading } from '@/hooks/useLoading';
import { useTheme } from 'next-themes';
import RewardModalModal from '../modal/reward-modal';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { mst_project } from '@prisma/client';
import { useSyncedWallet } from '@/providers/wallet-provider-wrapper';

export default function Header() {
  const { theme, setTheme } = useTheme();
  setTheme('dark');

  // Global state hooks
  const { isConnected, address, user, isReady, error, connectionType } =
    useSyncedWallet();

  const config = getConfig();
  const path = usePathname();
  const { isOpened, setOpen } = useNavbarMobile();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [rewardModal, setRewardModal] = useState<boolean>(false);
  const [projects, setProjects] = useState<mst_project[] | []>([]);
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  // Fetch user and project data
  useEffect(() => {
    async function fetchData() {
      showLoading();

      try {
        // Fetch user data if wallet is connected
        // if (address) {
        //   const resp = await axios.get(`/api/user/${address}?collection_address=${config?.collection_address}`);
        //   if (resp.data?.data) {
        //     setUser(resp.data.data.user);
        //     setStaker(resp.data.data.staker);
        //   }
        // }

        // Fetch projects list
        const projectResp = await axios.get(`/api/project/list`);
        setProjects(projectResp.data.data ?? []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        hideLoading();
      }
    }

    fetchData();
  }, [address, config?.collection_address, showLoading, hideLoading]);

  // Handle authentication when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      handleAuthentication();
    }
  }, [isConnected, address]);

  const handleAuthentication = async () => {
    if (!isConnected || !address) {
      toast({
        variant: 'destructive',
        title: 'Ups! Something wrong.',
        description: 'Please connect your wallet first!'
      });
      return;
    }

    setIsAuthenticating(true);

    try {
      const result = await signIn('credentials', {
        wallet: address,
        redirect: false
      });

      console.log('Authentication successful!');
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Check for winner status and show reward modal
  useEffect(() => {
    if (address && user) {
      const handleLoad = async () => {
        try {
          // Check if user is a winner
          if (user?.is_winner === 'Y' && address) {
            setTimeout(() => {
              setRewardModal(true);
            }, 500);
          }
        } catch (error) {
          console.error('Error checking winner status:', error);
        }
      };

      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, [address, user]);

  return (
    <nav className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between bg-transparent py-5 md:px-14">
      <RewardModalModal
        isOpen={rewardModal}
        setOpen={setRewardModal}
        onClose={() => {}}
        wallet={address ?? ''}
      />

      <div className="container mx-auto flex w-full items-center justify-between">
        {/* Logo and Links */}
        <div className="flex items-center space-x-4 md:space-x-10">
          {/* Logo */}
          <div className="relative">
            <Link
              href="/"
              aria-label="Home"
              className="group flex h-[40px] w-[50px] items-center justify-center overflow-hidden rounded-[12px] md:h-[50px] md:w-[65px] md:rounded-[16px]"
            >
              <img
                src="/images/logo.png"
                alt="Logo"
                className="object-contain group-hover:hidden"
              />
              <img
                src="/images/logo.gif"
                alt="Logo"
                className="hidden object-contain group-hover:block"
              />
            </Link>
          </div>

          <Link
            href="/challenge"
            className={cn(
              'hidden text-xl font-bold transition-transform md:!flex ',
              path === '/challenge'
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            Challenge
          </Link>

          {/* Navigation Links */}
          <div className="hidden space-x-8 md:!flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem className="bg-transparent hover:!bg-transparent focus:!bg-transparent data-[active]:!bg-transparent data-[state=open]:!bg-transparent">
                  <NavigationMenuTrigger
                    className={cn(
                      'bg-transparent px-0 py-0 text-xl font-bold hover:!bg-transparent focus:!bg-transparent data-[active]:!bg-transparent data-[state=open]:!bg-transparent',
                      path === '/stake'
                        ? 'text-white hover:text-white'
                        : 'text-gray-400 hover:text-gray-400 hover:text-white'
                    )}
                  >
                    Stake
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="p-0">
                    <div className="grid w-[250px] gap-2 !bg-white p-4">
                      {projects.map((project, index) => (
                        <div key={index}>
                          {project.project_status === 'N' ? (
                            <div className="grid grid-cols-12 items-center hover:scale-105 hover:font-semibold">
                              <span className="col-span-2 opacity-30">
                                {project.project_icon}
                              </span>
                              <div className="col-span-10 flex text-[#156E7E] opacity-30">
                                {project.project_name} (Soon)
                              </div>
                            </div>
                          ) : (
                            <Link
                              href={`/stake/${project.project_code}`}
                              className="grid grid-cols-12 items-center hover:scale-105 hover:font-semibold"
                            >
                              <span className="col-span-2">
                                {project.project_icon}
                              </span>
                              <span className="col-span-10 text-[#156E7E]">
                                {project.project_name}
                              </span>
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <Link
            href="/raffle"
            className={cn(
              'hidden text-xl font-bold transition-transform md:!flex ',
              path === '/raffle'
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            Raffle
          </Link>
        </div>

        {/* Connect Wallet Button */}
        <div className="hidden md:!block">
          <ConnectButton />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-x-3 md:!hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open Menu"
            className="rounded-[5px] bg-white p-2 text-black focus:outline-none"
          >
            <svg
              className="h-5 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpened ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M2 22L22 2M2 2l20 20"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M-6 6h36M-6 12h36M-6 18h36"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
