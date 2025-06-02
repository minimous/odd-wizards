'use client';

import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { useToast } from '../ui/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChain } from '@cosmos-kit/react';

interface Wallet {
    id: string;
    name: string;
    logo: string;
    description: string;
    color: string;
    supportedTypes: ('cosmos' | 'evm')[];
}

interface WalletConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    loading: boolean;
    onConnectWallet?: (walletId: string, walletType: 'cosmos' | 'evm') => void;
}

const COSMOS_WALLETS: Wallet[] = [
    {
        id: 'keplr-extension',
        name: 'Keplr',
        logo: 'https://wallet.keplr.app/assets/favicon-32x32.png',
        description: 'The most popular Cosmos wallet extension',
        color: 'from-blue-500 to-purple-600',
        supportedTypes: ['cosmos']
    },
    {
        id: 'leap-extension',
        name: 'Leap Wallet',
        logo: 'https://assets.leapwallet.io/logo.svg',
        description: 'Multi-chain Cosmos wallet with advanced features',
        color: 'from-orange-500 to-red-600',
        supportedTypes: ['cosmos']
    },
    {
        id: 'cosmostation-extension',
        name: 'Cosmostation',
        logo: 'https://wallet.cosmostation.io/favicon.ico',
        description: 'Comprehensive Cosmos ecosystem wallet',
        color: 'from-purple-500 to-indigo-600',
        supportedTypes: ['cosmos']
    },
    {
        id: 'station-extension',
        name: 'Station Wallet',
        logo: 'https://station.terra.money/favicon.ico',
        description: 'Terra ecosystem wallet with staking features',
        color: 'from-green-500 to-blue-600',
        supportedTypes: ['cosmos']
    }
];

const EVM_WALLETS: Wallet[] = [
    {
        id: 'metamask',
        name: 'MetaMask',
        logo: 'https://docs.metamask.io/img/metamask-fox.svg',
        description: 'The most popular Ethereum wallet',
        color: 'from-orange-500 to-yellow-600',
        supportedTypes: ['evm']
    },
    {
        id: 'walletconnect',
        name: 'WalletConnect',
        logo: 'https://walletconnect.com/walletconnect-logo.svg',
        description: 'Connect to 300+ wallets',
        color: 'from-blue-500 to-cyan-600',
        supportedTypes: ['evm']
    },
    {
        id: 'coinbase',
        name: 'Coinbase Wallet',
        logo: 'https://wallet.coinbase.com/assets/images/favicon.ico',
        description: 'Self-custody crypto wallet',
        color: 'from-blue-400 to-blue-600',
        supportedTypes: ['evm']
    },
    {
        id: 'trustwallet',
        name: 'Trust Wallet',
        logo: 'https://trustwallet.com/assets/images/favicon.ico',
        description: 'Multi-chain mobile wallet',
        color: 'from-blue-500 to-indigo-600',
        supportedTypes: ['evm']
    },
    {
        id: 'rabby',
        name: 'Rabby Wallet',
        logo: 'https://rabby.io/assets/images/logo-128.png',
        description: 'Multi-chain DeFi wallet',
        color: 'from-purple-500 to-pink-600',
        supportedTypes: ['evm']
    },
    {
        id: 'phantom',
        name: 'Phantom',
        logo: 'https://phantom.app/img/phantom-logo.svg',
        description: 'Multi-chain crypto wallet',
        color: 'from-purple-600 to-indigo-700',
        supportedTypes: ['evm']
    }
];

export default function WalletConnectModal({
    isOpen,
    onClose,
    loading,
    onConnectWallet
}: WalletConnectModalProps) {
    const [selectedType, setSelectedType] = useState<'cosmos' | 'evm' | null>(null);
    const { toast } = useToast();
    
    // Use cosmos-kit hooks for connecting to Cosmos chains
    const { connect: connectKeplr, status: keplrStatus } = useChain('cosmoshub');
    const { connect: connectStargaze } = useChain('stargaze');
    const { connect: connectOsmosis } = useChain('osmosis');
    const { connect: connectJuno } = useChain('juno');

    const handleCosmosWalletSelect = async (wallet: Wallet) => {
        try {
            switch (wallet.id) {
                case 'keplr-extension':
                    await connectKeplr();
                    break;
                case 'leap-extension':
                    // Leap wallet connection through cosmos-kit
                    await connectKeplr(); // You can adjust this based on your setup
                    break;
                default:
                    await connectKeplr();
            }
            
            toast({
                title: "Connected!",
                description: `Successfully connected to ${wallet.name}`,
            });
            onClose();
        } catch (error) {
            console.error('Cosmos wallet connection error:', error);
            toast({
                title: "Connection failed",
                description: `Failed to connect to ${wallet.name}`,
                variant: "destructive"
            });
        }
    };

    const handleEvmWalletSelect = async (wallet: Wallet) => {
        try {
            // Handle EVM wallet connections
            if (wallet.id === 'metamask') {
                if (typeof window !== 'undefined' && window.ethereum) {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    toast({
                        title: "Connected!",
                        description: `Successfully connected to ${wallet.name}`,
                    });
                    onClose();
                } else {
                    toast({
                        title: "MetaMask not found",
                        description: "Please install MetaMask extension",
                        variant: "destructive"
                    });
                }
            } else {
                // Handle other EVM wallets
                if (onConnectWallet) {
                    await onConnectWallet(wallet.id, 'evm');
                }
                toast({
                    title: "Connecting...",
                    description: `Connecting to ${wallet.name}`,
                });
            }
        } catch (error) {
            console.error('EVM wallet connection error:', error);
            toast({
                title: "Connection failed",
                description: `Failed to connect to ${wallet.name}`,
                variant: "destructive"
            });
        }
    };

    const handleWalletSelect = async (wallet: Wallet) => {
        if (selectedType === 'cosmos') {
            await handleCosmosWalletSelect(wallet);
        } else if (selectedType === 'evm') {
            await handleEvmWalletSelect(wallet);
        }
    };

    const handleBack = () => {
        setSelectedType(null);
    };

    const resetModal = () => {
        setSelectedType(null);
        onClose();
    };

    const getWalletsForType = (type: 'cosmos' | 'evm') => {
        return type === 'cosmos' ? COSMOS_WALLETS : EVM_WALLETS;
    };

    return (
        <Dialog open={isOpen} onOpenChange={resetModal}>
            <DialogContent className="max-w-[95%] md:!max-w-lg rounded-2xl bg-gradient-to-br from-gray-900 to-black border-gray-800 px-0">
                <div className="w-full text-white">
                    {/* Header */}
                    <div className='px-6 pt-6 pb-4 flex items-center gap-4'>
                        {selectedType && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBack}
                                className="p-2 hover:bg-gray-800 rounded-full"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className='font-bold text-2xl'>Connect Wallet</h2>
                                <p className="text-gray-400 text-sm">
                                    {selectedType ? `Choose your ${selectedType.toUpperCase()} wallet` : 'Choose your preferred blockchain'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className={cn(selectedType && 'h-[60vh]')}>
                        <div className='px-6 pb-6'>
                            {!selectedType ? (
                                // Chain Type Selection
                                <div className="space-y-4">
                                    <div 
                                        onClick={() => setSelectedType('cosmos')}
                                        className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                                                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                                                    <path d="M2 17L12 22L22 17"/>
                                                    <path d="M2 12L12 17L22 12"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                                    Cosmos Ecosystem
                                                </h3>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    Inter-blockchain communication protocol
                                                </p>
                                            </div>
                                            <div className="text-gray-400 group-hover:text-white transition-colors">
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div 
                                        onClick={() => setSelectedType('evm')}
                                        className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                                                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M11.944 17.97L4.58 13.62L11.943 24L19.307 13.62L11.944 17.97ZM12.056 0L4.69 12.223L12.056 16.578L19.42 12.223L12.056 0Z"/>
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                                                    EVM Networks
                                                </h3>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    Ethereum Virtual Machine compatible chains
                                                </p>
                                            </div>
                                            <div className="text-gray-400 group-hover:text-white transition-colors">
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Wallet Selection - Row Layout
                                <div className="space-y-3">
                                    {getWalletsForType(selectedType).map((wallet) => (
                                        <div
                                            key={wallet.id}
                                            onClick={() => handleWalletSelect(wallet)}
                                            className="group cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-700/50 hover:border-gray-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="shrink-0">
                                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${wallet.color} group-hover:shadow-lg transition-all duration-300`}>
                                                        <img 
                                                            src={wallet.logo} 
                                                            alt={wallet.name}
                                                            className="h-8 w-8 object-contain"
                                                            onError={(e: any) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-lg font-bold text-white group-hover:text-gray-100 transition-colors">
                                                            {wallet.name}
                                                        </h3>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                                                            {selectedType}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mt-1">
                                                        {wallet.description}
                                                    </p>
                                                </div>
                                                <div className="text-gray-400 group-hover:text-white transition-colors">
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            {loading && (
                                                <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C6.373 0 0 6.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                    </svg>
                                                    Connecting...
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}