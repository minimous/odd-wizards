// types/wallet.ts
export interface WalletConfig {
  id: string;
  name: string;
  logo: string;
  description: string;
  color: string;
  supportedTypes: ('stargaze' | 'evm')[];
  downloadUrl?: string;
  deepLink?: string;
}

export interface ChainConfig {
  chainName: string;
  chainId: string;
  rpc: string;
  rest: string;
  bech32Prefix: string;
  coinType: number;
  gasPriceStep: {
    low: number;
    average: number;
    high: number;
  };
  currencies: [
    {
      coinDenom: string;
      coinMinimalDenom: string;
      coinDecimals: number;
    }
  ];
  feeCurrencies: [
    {
      coinDenom: string;
      coinMinimalDenom: string;
      coinDecimals: number;
      gasPriceStep: {
        low: number;
        average: number;
        high: number;
      };
    }
  ];
}
