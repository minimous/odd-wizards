import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WalletConfig } from '@/types/wallet';
import { ExternalLink } from 'lucide-react';

// components/WalletItem.tsx
interface WalletItemProps {
  wallet: WalletConfig;
  isConnecting: boolean;
  isInstalled: boolean;
  onConnect: (wallet: WalletConfig) => void;
  chainInfo?: any;
}

const WalletItem = ({
  wallet,
  isConnecting,
  isInstalled,
  onConnect,
  chainInfo
}: WalletItemProps) => {
  return (
    <div
      onClick={() => !isConnecting && onConnect(wallet)}
      className={cn(
        'group cursor-pointer rounded-2xl border border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-4 transition-all duration-300 hover:scale-[1.02] hover:border-gray-500/50 hover:shadow-lg',
        isConnecting && 'cursor-not-allowed opacity-50',
        !isInstalled &&
          'border-yellow-500/30 bg-gradient-to-r from-yellow-900/10 to-orange-900/10'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="shrink-0">
          <div
            className={`rounded-xl bg-gradient-to-r p-3 ${wallet.color} transition-all duration-300 group-hover:shadow-lg`}
          >
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
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white transition-colors group-hover:text-gray-100">
              {wallet.name}
            </h3>
            <div className="flex items-center gap-2">
              {!isInstalled && wallet.downloadUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(wallet.downloadUrl, '_blank');
                  }}
                  className="h-auto p-1 text-xs text-yellow-400 hover:text-yellow-300"
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Install
                </Button>
              )}
              <div className="flex gap-1">
                {wallet.supportedTypes.map((type) => (
                  <div
                    key={type}
                    className="rounded bg-gray-800 px-2 py-1 text-xs uppercase tracking-wider text-gray-500"
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-400">{wallet.description}</p>
          {!isInstalled && (
            <p className="mt-1 text-xs text-yellow-400">
              Extension not installed
            </p>
          )}
          {isInstalled && (
            <p className="mt-1 text-xs text-green-400">✓ Extension installed</p>
          )}
          {chainInfo && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span>
                Chain:{' '}
                {chainInfo.chain?.pretty_name || chainInfo.chain?.chain_name}
              </span>
              {chainInfo.nativeAsset && (
                <span>• {chainInfo.nativeAsset.symbol}</span>
              )}
            </div>
          )}
        </div>
        <div className="text-gray-400 transition-colors group-hover:text-white">
          {isConnecting ? (
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
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
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C6.373 0 0 6.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
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
          )}
        </div>
      </div>

      {isConnecting && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
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
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C6.373 0 0 6.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2-647z"
            />
          </svg>
          Connecting to {wallet.name}...
        </div>
      )}
    </div>
  );
};

export default WalletItem;
