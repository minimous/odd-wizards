import TableHeader from './collection-statistic/TableHeader';
import { LeaderboardItem } from '@/types/leaderboard';
import { formatOddsPoints } from '@/lib/utils';

const rankEmojis = ['🥇 1st', '🥈 2nd', '🥉 3rd'];

export interface GlobalLeadearboardProps {
  hasNextPage: boolean;
  loadMore: () => void;
  loadingMore: boolean;
  leaderboard?: LeaderboardItem[];
  userAddress?: string | null;
  isConnected?: boolean;
  currentUser?: LeaderboardItem | null;
}

export default function GlobalLeadearboard({
  hasNextPage,
  loadMore,
  loadingMore,
  leaderboard = [],
  userAddress,
  isConnected = false,
  currentUser
}: GlobalLeadearboardProps) {
  return (
    <div className="w-full bg-black px-2 py-4 text-white md:px-4 md:py-6">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed md:max-w-[500px]">
          <thead className="border-b-2 border-[#15111D]">
            <tr>
              <TableHeader
                className="w-[80px] text-sm md:w-[100px] md:text-base"
                onSort={() => {}}
              >
                RANK
              </TableHeader>
              <TableHeader className="text-sm md:text-base" onSort={() => {}}>
                ADDRESS
              </TableHeader>
              <TableHeader
                align="right"
                className="text-sm md:text-base"
                onSort={() => {}}
              >
                POINTS
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {/* Show current user at top if they exist and not in visible leaderboard */}
            {currentUser &&
              isConnected &&
              !leaderboard.some(
                (item) => item.staker_address === currentUser.staker_address
              ) && (
                <tr className="border-b-2">
                  <td className="p-0">
                    <div className="my-2 h-10 w-[80px] rounded-l-[8px] bg-[#2D253E] px-2 py-2 md:w-[100px] md:px-4">
                      <span className="text-sm text-gray-400 md:text-base">
                        {rankEmojis[currentUser.ranking - 1] ||
                          currentUser.ranking ||
                          '?'}
                      </span>
                    </div>
                  </td>
                  <td className="p-0">
                    <div className="my-2 h-10 bg-[#2D253E] px-2 py-2 md:px-4">
                      <span className="truncate text-sm font-medium text-white md:text-base">
                        You
                      </span>
                    </div>
                  </td>
                  <td className="p-0" align="right">
                    <div className="my-2 h-10 rounded-r-[8px] bg-[#2D253E] px-2 py-2 md:px-4">
                      <span className="text-sm font-medium text-green-500 md:text-base">
                        {formatOddsPoints(currentUser.total_points)}
                      </span>
                    </div>
                  </td>
                </tr>
              )}

            {leaderboard.length > 0 ? (
              leaderboard.map((item, index) => {
                const isCurrentUser =
                  userAddress && item.staker_address === userAddress;
                return (
                  <tr
                    key={item.staker_address || index}
                    className={`transition-colors hover:bg-gray-800/30 ${
                      isCurrentUser && isConnected ? 'border-b-2' : ''
                    } ${isCurrentUser && isConnected ? 'bg-blue-900/30' : ''}`}
                  >
                    <td
                      className={`p-0 ${
                        isCurrentUser && isConnected ? '' : 'px-2 py-2 md:px-4'
                      }`}
                    >
                      {isCurrentUser && isConnected ? (
                        <div className="my-2 w-[80px] rounded-l-[8px] bg-[#2D253E] px-2 py-2 md:w-[100px] md:px-4">
                          <span className="text-sm text-gray-400 md:text-base">
                            {rankEmojis[item.ranking - 1] ||
                              item.ranking ||
                              '?'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 md:text-base">
                          {rankEmojis[item.ranking - 1] || item.ranking || '?'}
                        </span>
                      )}
                    </td>
                    <td
                      className={`p-0 ${
                        isCurrentUser && isConnected ? '' : 'px-2 py-2 md:px-4'
                      }`}
                    >
                      {isCurrentUser && isConnected ? (
                        <div className="my-2 bg-[#2D253E] px-2 py-2 md:px-4">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium text-white md:text-base">
                              You
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-white md:text-base">
                            {item.staker_address
                              ? `${item.staker_address.slice(
                                  0,
                                  6
                                )}...${item.staker_address.slice(-4)}`
                              : 'Unknown'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td
                      className={`p-0 ${
                        isCurrentUser && isConnected ? '' : 'px-2 py-2 md:px-4'
                      }`}
                      align="right"
                    >
                      {isCurrentUser && isConnected ? (
                        <div className="my-2 rounded-r-[8px] bg-[#2D253E] px-2 py-2 md:px-4">
                          <span className="text-sm font-medium text-green-500 md:text-base">
                            {formatOddsPoints(item.total_points)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-green-500 md:text-base">
                          {formatOddsPoints(item.total_points)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              // Fallback data when no leaderboard data is available but wallet is connected
              <tr>
                <td colSpan={3} className="py-8 text-center">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400 md:text-base">
                      No leaderboard data available
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          {hasNextPage && (
            <tfoot>
              <tr>
                <td colSpan={3} className="py-4 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="cursor-pointer rounded-md px-4 py-2 text-sm text-[#857F94] transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
                  >
                    {loadingMore ? 'Loading...' : 'See More...'}
                  </button>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
