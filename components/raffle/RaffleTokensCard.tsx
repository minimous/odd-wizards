'use client';
import { cn, formatDecimal } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';

export interface TokenInfo {
  project_id: number;
  project_seqn: number;
  project_symbol: string;
  project_symbol_img: string;
  total_nft_staked: number;
  total_points: number;
}

export interface RaffleTokensCardProps {
  data: TokenInfo[];
  tokenType: string[] | [];
  setTokenType: React.Dispatch<React.SetStateAction<string[] | []>>;
}

const RaffleTokensCard = ({
  data,
  tokenType,
  setTokenType
}: RaffleTokensCardProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const tokenTypeArray = tokenType as string[]; // Type assertion to handle the array

  // Check if we're on mobile based on screen width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Set initial token type once when data is loaded
  useEffect(() => {
    if (data.length > 0 && tokenType.length === 0) {
      const sortedData = [...data].sort((a, b) => {
        if (a.project_symbol === 'WZRD') return -1;
        if (b.project_symbol === 'WZRD') return 1;

        const seqnA = a.project_seqn ?? 999999; // atau 0, tergantung kebutuhan
        const seqnB = b.project_seqn ?? 999999;

        return seqnA - seqnB;
      });

      if (sortedData.length > 0) {
        const hasOddsWizard = sortedData.some(
          (item) => item.project_symbol === 'WZRD'
        );
        setTokenType([hasOddsWizard ? 'WZRD' : sortedData[0].project_symbol]);
      }
    }
  }, [data, tokenType.length, setTokenType]);

  // Sort data based on project_seqn
  const sortedData = [...data].sort((a, b) => {
    if (a.project_symbol === 'WZRD') return -1;
    if (b.project_symbol === 'WZRD') return 1;

    const seqnA = a.project_seqn ?? 999999; // atau 0, tergantung kebutuhan
    const seqnB = b.project_seqn ?? 999999;

    return seqnA - seqnB;
  });

  // Determine number of items to show based on screen size
  const itemsPerView = isMobile ? 1.5 : 3.5;

  // Check if we need to center items (2 or fewer on desktop)
  const shouldCenterItems = sortedData.length <= 2 && !isMobile;

  // Handle token selection with multiple select
  const handleTokenClick = (symbol: string) => {
    if (tokenTypeArray.includes(symbol)) {
      // Remove the token if it's already selected
      setTokenType((prev) => {
        const newSelection = prev.filter((item) => item !== symbol);
        // If removing the last token, return the empty array, otherwise return the new selection
        return newSelection.length > 0 ? newSelection : ([] as string[]);
      });
    } else {
      // Add the token to the selection
      setTokenType((prev) => [...prev, symbol]);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      {shouldCenterItems ? (
        // Centered layout for 1-2 items on desktop
        <div className="flex justify-center gap-4">
          {sortedData.map((token, index) => (
            <div
              key={index}
              onClick={() => handleTokenClick(token.project_symbol)}
              className={cn(
                'w-full max-w-xs cursor-pointer rounded-2xl border-2 border-[#323237] p-3 text-[#A1A1AA] md:p-4',
                tokenTypeArray.includes(token.project_symbol)
                  ? "bg-[url('/images/About.gif')] bg-cover bg-center"
                  : 'bg-[#18181B]'
              )}
              role="button"
              aria-pressed={tokenTypeArray.includes(token.project_symbol)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTokenClick(token.project_symbol);
                }
              }}
            >
              <div className="flex w-full items-center gap-3 md:gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={token.project_symbol_img ?? '/images/Icon/wzrd.png'}
                    className="h-8 w-8 object-contain md:h-12 md:w-12"
                    alt={`${token.project_symbol} token`}
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="text-xs font-medium text-white md:text-sm lg:text-base">
                    Token
                  </span>
                  <p className="truncate text-sm font-bold text-white md:text-base lg:text-lg">
                    {formatDecimal(token.total_points, 2)} $
                    {token.project_symbol}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Carousel layout for 3+ items or on mobile
        <Carousel
          className="w-full"
          opts={{
            align: 'center',
            loop: sortedData.length > itemsPerView
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {sortedData.map((token, index) => (
              <CarouselItem key={index} className="pl-2 md:basis-1/3 md:pl-4">
                <div
                  onClick={() => handleTokenClick(token.project_symbol)}
                  className={cn(
                    'relative h-full cursor-pointer rounded-2xl border-2 border-[#323237] p-3 text-[#A1A1AA] md:p-4',
                    tokenTypeArray.includes(token.project_symbol)
                      ? "bg-[url('/images/About.gif')] bg-cover bg-center"
                      : 'bg-[#18181B]'
                  )}
                  role="button"
                  aria-pressed={tokenTypeArray.includes(token.project_symbol)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTokenClick(token.project_symbol);
                    }
                  }}
                >
                  <div className="flex w-full items-center gap-3 md:gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={
                          token.project_symbol_img ?? '/images/Icon/wzrd.png'
                        }
                        className="h-8 w-8 object-contain md:h-12 md:w-12"
                        alt={`${token.project_symbol} token`}
                      />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-xs font-medium text-white md:text-sm lg:text-base">
                        Token
                      </span>
                      <p className="truncate text-sm font-bold text-white md:text-base lg:text-lg">
                        {formatDecimal(token.total_points, 2)} $
                        {token.project_symbol}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {sortedData.length > itemsPerView && (
            <>
              <CarouselPrevious
                className="-left-4 md:-left-6"
                aria-label="Previous tokens"
              />
              <CarouselNext
                className="-right-4 md:-right-6"
                aria-label="Next tokens"
              />
            </>
          )}
        </Carousel>
      )}

      {/* Selected tokens summary (optional) */}
      {tokenTypeArray.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-gray-400">Selected: </span>
          {tokenTypeArray.map((symbol, index) => (
            <span
              key={index}
              className="rounded-full bg-[#323237] px-2 py-1 text-xs text-white"
            >
              ${symbol}
              {tokenTypeArray.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTokenClick(symbol);
                  }}
                  className="ml-1 text-gray-400 hover:text-white"
                  aria-label={`Remove ${symbol}`}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RaffleTokensCard;
