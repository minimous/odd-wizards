import { Skeleton } from '@/components/ui/skeleton';

// Skeleton Row Component
const SkeletonTableRow = () => (
  <tr className="transition-colors hover:bg-gray-800/30">
    {/* Collection Info */}
    <td className="px-4 py-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-lg bg-gray-800" />
        <Skeleton className="h-5 w-32 bg-gray-800" />
      </div>
    </td>

    {/* Floor Price */}
    <td className="px-4 py-4">
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-4 w-16 bg-gray-800" />
      </div>
    </td>

    {/* Best Offer */}
    <td className="px-4 py-4">
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-4 w-16 bg-gray-800" />
      </div>
    </td>

    {/* Owners */}
    <td className="px-4 py-4">
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-4 w-12 bg-gray-800" />
      </div>
    </td>

    {/* For Sale */}
    <td className="px-4 py-4">
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-4 w-12 bg-gray-800" />
      </div>
    </td>

    {/* Volume */}
    <td className="px-4 py-4">
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-4 w-20 bg-gray-800" />
      </div>
    </td>

    {/* % */}
    <td className="px-4 py-4">
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-4 w-20 bg-gray-800" />
      </div>
    </td>
  </tr>
);

export default SkeletonTableRow;
