'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { BUCKET_CONFIG, formatCurrency } from '@/types';
import type { TimelineGoalTooltipProps } from './timeline.types';

export interface TooltipProps
  extends TimelineGoalTooltipProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

/**
 * Tooltip showing goal quick info on hover
 */
export const TimelineGoalTooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ goal, className = '', ...props }, ref) => {
    const t = useTranslations('dashboard');
    const tBuckets = useTranslations('buckets');
    const locale = useLocale();
    const bucketConfig = BUCKET_CONFIG[goal.bucket];
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;

    return (
      <div
        ref={ref}
        className={`
          absolute left-1/2 top-full mt-2 z-50
          -translate-x-1/2 transform
          min-w-[280px] max-w-[360px]
          rounded-lg border border-border bg-background
          p-3 shadow-lg
          ${className}
        `}
        role="tooltip"
        {...props}
      >
        {/* Arrow pointer */}
        <div className="absolute left-1/2 bottom-full -translate-x-1/2 transform">
          <div className="h-2 w-2 rotate-45 transform border-t border-l border-border bg-background" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Title and bucket badge */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground line-clamp-2">
              {goal.title}
            </h4>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: bucketConfig.bgColorVar,
                color: bucketConfig.colorVar,
              }}
            >
              {tBuckets(`${goal.bucket}.name`)}
            </span>
          </div>

          {/* Amount */}
          <div className="text-lg font-bold text-foreground">
            {formatCurrency(goal.amount, goal.currency, locale)}
          </div>

          {/* Date and time remaining */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {targetDate.toLocaleDateString(locale, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span
              className={`font-medium ${
                isOverdue ? 'text-error' : 'text-muted-foreground'
              }`}
            >
              {isOverdue
                ? t('overdueBy', { count: Math.abs(daysRemaining) })
                : t('daysLeft', { count: daysRemaining })}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

TimelineGoalTooltip.displayName = 'TimelineGoalTooltip';
