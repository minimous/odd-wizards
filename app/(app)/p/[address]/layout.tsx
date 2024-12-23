import HeaderMobile from '@/components/layout/HeaderMobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChainProviderWrapper from '@/providers/chain-provider-wrapper';
import type { ReactNode } from 'react';

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
        url: 'https://i.stargaze-apis.com/TPC4NhLtDLzuJOqYnXIEiFaeSmsbC3nqCxYRW81goGo/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeif7j4jrvmafknh7v3n73v5f56gkrud37rhg3gdux5o7rbg6o3fxaq/7264.png',
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
    images: ['https://i.stargaze-apis.com/TPC4NhLtDLzuJOqYnXIEiFaeSmsbC3nqCxYRW81goGo/f:jpg/resize:fit:700:::/dpr:2/plain/ipfs://bafybeif7j4jrvmafknh7v3n73v5f56gkrud37rhg3gdux5o7rbg6o3fxaq/7264.png']
  }
};

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex bg-black">
      <main className="h-screen w-full bg-black">
        <ChainProviderWrapper>
          <HeaderMobile />
          {/* <MobileComingSoon /> */}
          {/* <Header /> */}
          {/* <NavPrice /> */}
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
