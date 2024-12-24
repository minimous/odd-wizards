import HeaderMobile from '@/components/layout/HeaderMobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import getConfig from '@/config/config';
import ChainProviderWrapper from '@/providers/chain-provider-wrapper';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: 'Odds Wizard',
  description: 'Stake, Win, and LFGODDS!',
  openGraph: {
    type: "website",
    url: "https://www.oddsgarden.io",
    title: 'Odds Wizard',
    description: 'Stake, Win, and LFGODDS!',
    images: [
      {
        url: 'https://utfs.io/f/Ae0rhpcXcgiTO1o5jUZpAXyvWkwSZlLUYuPTOxn7f59FGEoV',
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
    images: ['https://utfs.io/f/Ae0rhpcXcgiTO1o5jUZpAXyvWkwSZlLUYuPTOxn7f59FGEoV']
  }
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex bg-black">
      <main className="h-screen w-full bg-black">
        <ChainProviderWrapper>
          <HeaderMobile />
          <ScrollArea className="w-full h-screen">
            <div className="mx-auto w-screen 2xl:max-w-[1920px]">
              {children}
            </div>
          </ScrollArea>
        </ChainProviderWrapper>
      </main>
    </div>
  );
}