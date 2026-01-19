'use client';

import { useMemo, type ReactNode } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui';
import { formatCurrency, BUCKET_CONFIG, type Goal, type Bucket, type Currency } from '@/types';
import { ExportMenu } from './ExportMenu';

interface SummaryStatsProps {
  goals: Goal[];
  totalAmount: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Calculate the next upcoming goal (nearest by target date)
 */
function getNextGoal(goals: Goal[]): Goal | null {
  if (goals.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter future goals and sort by target date
  const futureGoals = goals
    .filter(g => new Date(g.targetDate) >= today)
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());

  return futureGoals[0] || null;
}

/**
 * Calculate days until a target date
 */
function getDaysUntil(targetDate: Date | string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  return Math.ceil((target.getTime() - today.getTime()) / MS_PER_DAY);
}

/**
 * Count goals per bucket
 */
function countByBucket(goals: Goal[]): Record<Bucket, number> {
  return goals.reduce((acc, goal) => {
    acc[goal.bucket] = (acc[goal.bucket] || 0) + 1;
    return acc;
  }, { safety: 0, growth: 0, dream: 0 } as Record<Bucket, number>);
}

/**
 * Bucket icon components
 */
const BucketIcons: Record<Bucket, ReactNode> = {
  safety: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  growth: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  dream: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
};

export function SummaryStats({ goals }: SummaryStatsProps) {
  const t = useTranslations('dashboard');
  const tBuckets = useTranslations('buckets');
  const locale = useLocale();

  const totalsByCurrency = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const goal of goals) {
      totals[goal.currency] = (totals[goal.currency] || 0) + goal.amount;
    }
    return totals;
  }, [goals]);

  const currencyCodes = Object.keys(totalsByCurrency) as Currency[];
  const bucketCounts = useMemo(() => countByBucket(goals), [goals]);
  const nextGoal = useMemo(() => getNextGoal(goals), [goals]);
  const daysUntilNext = useMemo(() => nextGoal ? getDaysUntil(nextGoal.targetDate) : 0, [nextGoal]);

  if (goals.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* Main stats header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            {/* Goals count */}
            <div className="text-2xl font-bold text-foreground">
              {t('goalsCount', { count: goals.length })}
            </div>

            {/* Currency totals */}
            <div className="space-y-0.5">
              {currencyCodes.map((code, index) => (
                <div key={code} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <span className="text-muted-foreground text-sm">+</span>
                  )}
                  <span className={`font-semibold text-foreground ${index === 0 ? 'text-xl' : 'text-lg'}`}>
                    {formatCurrency(totalsByCurrency[code], code, locale)}
                  </span>
                  {index === currencyCodes.length - 1 && (
                    <span className="text-sm text-muted-foreground">{t('stats.total')}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <ExportMenu goals={goals} />
        </div>

        {/* Bucket breakdown */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          {(['safety', 'growth', 'dream'] as Bucket[]).map((bucket) => (
            <div
              key={bucket}
              className="flex items-center gap-1.5"
              style={{ color: BUCKET_CONFIG[bucket].colorVar }}
            >
              {BucketIcons[bucket]}
              <span className="text-sm font-medium whitespace-nowrap">
                {bucketCounts[bucket]} {tBuckets(`${bucket}.name`)}
              </span>
            </div>
          ))}
        </div>

        {/* Next goal */}
        {nextGoal && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t('stats.nextGoal')}:</span>
              <span className="font-medium text-foreground">{nextGoal.title}</span>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `color-mix(in srgb, ${BUCKET_CONFIG[nextGoal.bucket].colorVar} 15%, transparent)`,
                  color: BUCKET_CONFIG[nextGoal.bucket].colorVar
                }}
              >
                {daysUntilNext} {t('stats.days')}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
