'use client';

import { ChainProvider } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';
import { SignerOptions, wallets } from 'cosmos-kit';
import { GasPrice } from '@cosmjs/stargate';
import { Chain, AssetList } from '@chain-registry/types';

import '@interchain-ui/react/styles';

// Add Intergaze chain configuration
const intergazeChain: Chain = {
  $schema: '../chain.schema.json',
  chain_name: 'intergaze',
  chain_type: 'cosmos',
  chain_id: 'intergaze-1',
  pretty_name: 'Intergaze',
  status: 'live',
  network_type: 'mainnet',
  website: 'https://intergaze.com',
  bech32_prefix: 'init',
  daemon_name: 'initiad',
  node_home: '$HOME/.initia',
  key_algos: ['secp256k1'],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: 'uinit',
        fixed_min_gas_price: 0.15,
        low_gas_price: 0.15,
        average_gas_price: 0.15,
        high_gas_price: 0.4
      }
    ]
  },
  staking: {
    staking_tokens: [
      {
        denom: 'uinit'
      }
    ]
  },
  codebase: {
    git_repo: 'https://github.com/initia-labs/initia',
    recommended_version: 'v0.2.12',
    compatible_versions: ['v0.2.12'],
    genesis: {
      genesis_url:
        'https://initia.s3.ap-southeast-1.amazonaws.com/initia-1/genesis.json'
    }
  },
  apis: {
    rpc: [
      {
        address: 'https://rpc.initia.tech:443'
      }
    ],
    rest: [
      {
        address: 'https://lcd.initia.tech'
      }
    ]
  },
  explorers: [
    {
      kind: 'initia scan',
      url: 'https://scan.initia.tech',
      tx_page: 'https://scan.initia.tech/initia-1/txs/${txHash}'
    }
  ]
};

// Add Intergaze asset list
const intergazeAssets: AssetList = {
  $schema: '../assetlist.schema.json',
  chain_name: 'intergaze',
  assets: [
    {
      description: 'The native token of Intergaze',
      denom_units: [
        {
          denom: 'uinit',
          exponent: 0
        },
        {
          denom: 'init',
          exponent: 6
        }
      ],
      base: 'uinit',
      name: 'Initia',
      display: 'init',
      symbol: 'INIT',
      type_asset: 'sdk.coin',
      logo_URIs: {
        png: 'https://registry.initia.xyz/images/initia.png'
      }
    }
  ]
};

export default function ChainProviderWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  // const signerOptions: SignerOptions = {
  //   signingStargate: (_chain) => {
  //     let gasPrice;
  //     try {
  //       const chain =
  //         typeof _chain === 'string'
  //           ? chains.find(({ chain_name }) => chain_name === _chain)!
  //           : _chain;
  //       const feeToken = chain.fees?.fee_tokens[0];
  //       const fee = `${feeToken?.average_gas_price || 0.025}${feeToken?.denom}`;
  //       gasPrice = GasPrice.fromString(fee);
  //     } catch (error) {
  //       gasPrice = GasPrice.fromString('0.025uosmo');
  //     }
  //     return { gasPrice };
  //   }
  // };

  // Combine existing chains with Intergaze
  const allChains = [...chains, intergazeChain];
  const allAssets = [...assets, intergazeAssets];

  return (
    <ChainProvider
      chains={allChains} // supported chains including Intergaze
      assetLists={allAssets} // supported asset lists including Intergaze
      wallets={wallets} // supported wallets
      walletConnectOptions={{
        signClient: {
          projectId: 'a8510432ebb71e6948cfd6cde54b70f7',
          relayUrl: 'wss://relay.walletconnect.org',
          metadata: {
            name: 'Your App Name',
            description: 'Your app description',
            url: 'https://yourapp.com',
            icons: ['https://yourapp.com/icon.png']
          }
        }
      }}
      // signerOptions={signerOptions}
      throwErrors={false}
    >
      {children}
    </ChainProvider>
  );
}
