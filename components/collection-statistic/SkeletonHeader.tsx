import { Skeleton } from "@/components/ui/skeleton";

// Header Skeleton Component
const SkeletonHeader = () => (
    <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-48 bg-gray-800" />
            </div>
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-16 bg-gray-800" />
                <Skeleton className="h-10 w-16 bg-gray-800" />
                <Skeleton className="h-10 w-16 bg-gray-800" />
                <Skeleton className="h-10 w-16 bg-gray-800" />
            </div>
        </div>
    </div>
);


export default SkeletonHeader;