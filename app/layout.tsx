import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';
import LoadingPage from '@/components/LoadingPage';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Odds Wizard',
  description: 'Stake, Win, and LFGODDS!',
  openGraph: {
    type: "website",
    url: "https://www.oddsgarden.io",
    title: 'Odd Wizard',
    description: 'Stake, Win, and LFGODDS!',
    images: [
      {
        url: 'https://www.oddsgarden.io/images/Odds-Banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Odds Wizard Share Image'
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

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-hidden `}
        suppressHydrationWarning={true}
      >
        <NextTopLoader showSpinner={false} />
        <Providers session={session}>
          <Toaster />
          <LoadingPage />
          {children}
        </Providers>
      </body>
    </html>
  );
}
