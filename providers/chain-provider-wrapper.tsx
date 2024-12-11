"use client";

import { ChainProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { wallets as keplrWallet } from "@cosmos-kit/keplr";
import { wallets as leapwallets } from "@cosmos-kit/leap";

const wallets = [
  ...keplrWallet, // add keplr wallets
  ...leapwallets, // add leap wallets
];

import "@interchain-ui/react/styles";
export default function ChainProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChainProvider
      chains={chains} // supported chains
      assetLists={assets} // supported asset lists
      wallets={wallets} // supported wallets
      walletConnectOptions={{
        signClient: {
          projectId: "2b31f77632bb06772994ad96a9d33e4c",
          relayUrl: "wss://relay.walletconnect.org",
        },
      }}
    >
      {children}
    </ChainProvider>
  );
}
