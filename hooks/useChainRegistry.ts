import { ChainConfig } from '@/types/wallet';
import { chains, assets } from 'chain-registry';
import { useMemo } from 'react';

// hooks/useChainRegistry.ts
const useChainRegistry = (chainName: string) => {
  return useMemo(() => {
    const chain = chains.find((c) => c.chain_name === chainName);
    const asset = assets.find((a) => a.chain_name === chainName);

    if (!chain || !asset) {
      return null;
    }

    const nativeAsset = asset.assets.find(
      (a) => a.base === chain.staking?.staking_tokens?.[0]?.denom
    );

    return {
      chain,
      asset,
      nativeAsset,
      config: {
        chainName: chain.chain_name,
        chainId: chain.chain_id,
        rpc: chain.apis?.rpc?.[0]?.address || '',
        rest: chain.apis?.rest?.[0]?.address || '',
        bech32Prefix: chain.bech32_prefix,
        coinType: chain.slip44,
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.04
        }
      } as ChainConfig
    };
  }, [chainName]);
};

export default useChainRegistry;
