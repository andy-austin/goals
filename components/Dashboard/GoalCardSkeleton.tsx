import { Skeleton } from '@/components/ui/Skeleton';

export function GoalCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* drag handle placeholder */}
          <Skeleton className="h-4 w-4 mt-1 flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
        {/* action buttons placeholder */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-6 w-6 rounded-full" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-6 w-6 rounded" />
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
