'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { PlusCircle } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { BUCKET_CONFIG, Bucket, Goal } from '@/types';
import { SortableGoalCard } from './SortableGoalCard';
import { BucketEducationPanel } from '../Education/BucketEducationPanel';
import { useGoals } from '@/context';
import { useSortableList } from '@/hooks';

interface BucketSectionProps {
  bucket: Bucket;
  goals: Goal[];
  totalGoals: number; // To show percentage or just count?
}

// =============================================================================
// Icons
// =============================================================================

const Icons = {
  safety: (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  growth: (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  dream: (className: string) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
};

// =============================================================================
// Component
// =============================================================================

export function BucketSection({ bucket, goals }: BucketSectionProps) {
  const tBuckets = useTranslations('buckets');
  const tDashboard = useTranslations('dashboard');
  const storageKey = `fingoal_bucket_expanded_${bucket}`;
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem(storageKey);
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem(storageKey, String(isExpanded));
  }, [isExpanded, storageKey]);
  const { reorderGoalsInBucket } = useGoals();
  const config = BUCKET_CONFIG[bucket];
  const Icon = Icons[bucket];

  // Drag onboarding tooltip (#103)
  const DRAG_TOOLTIP_KEY = 'fingoal_drag_tooltip_seen';
  const [showDragTooltip, setShowDragTooltip] = useState(false);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (goals.length >= 2 && isExpanded) {
      const seen = localStorage.getItem(DRAG_TOOLTIP_KEY);
      if (!seen) {
        setShowDragTooltip(true);
        tooltipTimerRef.current = setTimeout(() => {
          setShowDragTooltip(false);
          localStorage.setItem(DRAG_TOOLTIP_KEY, 'true');
        }, 5000);
      }
    }
    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
  }, [goals.length, isExpanded]);

  const dismissDragTooltip = useCallback(() => {
    setShowDragTooltip(false);
    localStorage.setItem(DRAG_TOOLTIP_KEY, 'true');
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
  }, []);

  // Memoize the reorder callback to maintain referential equality
  const handleReorder = useCallback(
    (orderedIds: string[]) => reorderGoalsInBucket(bucket, orderedIds),
    [bucket, reorderGoalsInBucket]
  );

  // Use custom hook for DnD logic
  const { sensors, handleDragEnd } = useSortableList({
    items: goals,
    onReorder: handleReorder,
  });

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50 cursor-pointer"
        style={{ borderLeft: `4px solid ${config.colorVar}` }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: config.bgColorVar, color: config.colorVar }}
          >
            {Icon('h-6 w-6')}
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-foreground">
              {tBuckets(`${bucket}.name`)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {tDashboard('goalsCount', { count: goals.length })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Chevron Icon */}
           <svg
              className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-border px-6 py-6 bg-muted/50">
          {goals.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              <p>{tDashboard('noBucketGoals', { bucket: tBuckets(`${bucket}.name`).toLowerCase() })}</p>
              <Link
                href="/create"
                className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                {tDashboard('actions.addGoal')}
              </Link>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                items={goals.map((g) => g.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {/* Drag onboarding tooltip (#103) */}
                  {showDragTooltip && (
                    <button
                      type="button"
                      onClick={dismissDragTooltip}
                      className="flex w-full items-center gap-2 rounded-lg border border-info/30 bg-info/10 px-3 py-2 text-sm text-foreground animate-fade-in cursor-pointer"
                    >
                      <svg className="h-4 w-4 shrink-0 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      <span>{tDashboard('dragTooltip')}</span>
                    </button>
                  )}
                  {goals.map((goal) => (
                    <SortableGoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
          {/* Educational instruments panel (#56) */}
          <BucketEducationPanel bucket={bucket} />
        </div>
      )}
    </div>
  );
}
