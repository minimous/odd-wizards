import { ScrollArea } from '@/components/ui/scroll-area';
import ChainProviderWrapper from '@/providers/chain-provider-wrapper';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Odd Wizard',
  description:
    'Stake, Win, and LFGODDS!'
};

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex bg-black">
      <main className="h-screen w-full bg-black">
        <ChainProviderWrapper>
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
