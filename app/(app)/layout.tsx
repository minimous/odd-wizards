import HeaderMobile from '@/components/layout/HeaderMobile';
import HeaderV2 from '@/components/layout/headerV2';
import { MobileComingSoon } from '@/components/MobileComingSoon';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChainProviderWrapper from '@/providers/chain-provider-wrapper';
import { WalletProviderWrapper } from '@/providers/wallet-provider-wrapper';
// import { InitiaWidgetProvider } from "@initia/widget-react";
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Odds Wizard',
  description: 'Stake, Win, and LFGODDS!',
  openGraph: {
    type: 'website',
    url: 'https://www.oddsgarden.io',
    title: 'Odds Wizard',
    description: 'Stake, Win, and LFGODDS!',
    images: [
      {
        url: 'https://www.oddsgarden.io/images/Odds-Banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Odd Wizard Share Image'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Odds Wizard',
    description: 'Stake, Win, and LFGODDS!',
    images: ['https://www.oddsgarden.io/images/Odds-Banner.jpg']
  }
};

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex bg-black">
      <main className="h-screen w-full bg-black">
        {/* <InitiaWidgetProvider defaultChainId="intergaze"> */}
        <ChainProviderWrapper>
          <WalletProviderWrapper>
            <HeaderMobile />
            {/* <MobileComingSoon /> */}
            <HeaderV2 />
            {/* <NavPrice /> */}
            <ScrollArea className="h-[calc(100vh-70px)] w-full">
              <div className="mx-auto w-screen 2xl:max-w-[1920px]">
                {children}
              </div>
            </ScrollArea>
          </WalletProviderWrapper>
        </ChainProviderWrapper>
        {/* </InitiaWidgetProvider> */}
      </main>
    </div>
  );
}
