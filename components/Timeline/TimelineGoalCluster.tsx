'use client';

import { forwardRef, useState, type HTMLAttributes } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { BUCKET_CONFIG, formatCurrency } from '@/types';
import type { TimelineGoalClusterProps } from './timeline.types';

export interface ClusterProps
  extends TimelineGoalClusterProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {}

/**
 * Stacked indicator for multiple goals that are close together
 */
export const TimelineGoalCluster = forwardRef<HTMLDivElement, ClusterProps>(
  ({ cluster, onClick, className = '', ...props }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const t = useTranslations('timeline');
    const locale = useLocale();

    // Get unique buckets in this cluster
    const bucketCounts = cluster.goals.reduce(
      (acc, goal) => {
        acc[goal.bucket] = (acc[goal.bucket] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Primary bucket is the most common one
    const primaryBucket = Object.entries(bucketCounts).sort(
      ([, a], [, b]) => b - a
    )[0][0] as keyof typeof BUCKET_CONFIG;
    const primaryConfig = BUCKET_CONFIG[primaryBucket];

    return (
      <div
        ref={ref}
        className={`absolute flex flex-col items-center ${className}`}
        style={{ left: cluster.xPosition, top: '2rem' }}
        {...props}
      >
        {/* Expanded dropdown */}
        {isExpanded && (
          <div
            className="
              absolute left-1/2 bottom-full mb-2 z-50
              -translate-x-1/2 transform
              min-w-[220px] max-w-[300px]
              rounded-lg border border-border bg-background
              p-2 shadow-lg
            "
            role="menu"
          >
            {/* Arrow */}
            <div className="absolute left-1/2 top-full -translate-x-1/2 transform">
              <div className="h-2 w-2 rotate-45 transform border-b border-r border-border bg-background" />
            </div>

            <div className="space-y-1">
              {cluster.goals.map((goal) => {
                const config = BUCKET_CONFIG[goal.bucket];
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => {
                      onClick?.([goal]);
                      setIsExpanded(false);
                    }}
                    className="
                      flex w-full items-center justify-between gap-2
                      rounded-md p-2 text-left
                      hover:bg-muted transition-colors
                      cursor-pointer
                    "
                    role="menuitem"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: config.colorVar }}
                      />
                      <span className="text-sm font-medium text-foreground truncate">
                        {goal.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatCurrency(goal.amount, goal.currency, locale)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Connector line */}
        <div
          className="h-4 w-0.5"
          style={{ backgroundColor: primaryConfig.colorVar }}
        />

        {/* Cluster button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          onBlur={(e) => {
            // Close dropdown when focus leaves
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsExpanded(false);
            }
          }}
          className={`
            relative flex items-center justify-center
            min-w-[44px] min-h-[44px] px-3 py-1
            rounded-lg border-2 shadow-sm
            cursor-pointer transition-all
            hover:scale-105 hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          `}
          style={{
            backgroundColor: primaryConfig.bgColorVar,
            borderColor: primaryConfig.colorVar,
          }}
          aria-label={t('goalsCount', { count: cluster.goals.length })}
          aria-expanded={isExpanded}
          aria-haspopup="menu"
        >
          {/* Stacked indicator dots */}
          <div className="flex -space-x-1 mr-1">
            {Object.entries(bucketCounts)
              .slice(0, 3)
              .map(([bucket], index) => (
                <div
                  key={bucket}
                  className="h-3 w-3 rounded-full border border-white"
                  style={{
                    backgroundColor: BUCKET_CONFIG[bucket as keyof typeof BUCKET_CONFIG].colorVar,
                    zIndex: 3 - index,
                  }}
                />
              ))}
          </div>
          {/* Count */}
          <span
            className="text-sm font-bold"
            style={{ color: primaryConfig.colorVar }}
          >
            {cluster.goals.length}
          </span>
        </button>
      </div>
    );
  }
);

TimelineGoalCluster.displayName = 'TimelineGoalCluster';
