'use client';

import { ChainProvider } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';
import { SignerOptions, wallets } from 'cosmos-kit';
import { GasPrice } from '@cosmjs/stargate';

import '@interchain-ui/react/styles';
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

  return (
    <ChainProvider
      chains={chains} // supported chains
      assetLists={assets} // supported asset lists
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
