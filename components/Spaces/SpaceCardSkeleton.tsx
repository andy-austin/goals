import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent } from '@/components/ui/Card';

export function SpaceCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        {/* Avatar */}
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
          <div className="flex items-center gap-4 mt-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Chevron */}
        <Skeleton className="w-5 h-5 rounded flex-shrink-0" />
      </CardContent>
    </Card>
  );
}
