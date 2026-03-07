import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

export function SummaryStatsSkeleton() {
  return (
    <Card className="mb-8 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <div className="mt-3 flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </Card>
  );
}
