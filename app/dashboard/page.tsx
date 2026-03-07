'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useGoals } from '@/context';
import { Button, Card, BucketSection, SummaryStats, RecommendationsWidget } from '@/components';
import { SummaryStatsSkeleton } from '@/components/Dashboard/SummaryStatsSkeleton';
import { GoalCardSkeleton } from '@/components/Dashboard/GoalCardSkeleton';
import { GoalCard } from '@/components/Dashboard/GoalCard';
import { BUCKETS, formatDate } from '@/types';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const { goals, totalGoals, totalAmount, getAllGoalsByBucket, isLoading, deleteGoal } = useGoals();
  const [showCompleted, setShowCompleted] = useState(true);

  // Split goals into active and completed
  const activeGoals = useMemo(() => goals.filter((g) => g.status !== 'completed'), [goals]);
  const completedGoals = useMemo(() => goals.filter((g) => g.status === 'completed'), [goals]);

  // Memoize active goals by bucket
  const goalsByBucket = useMemo(() => {
    const active = activeGoals;
    return {
      safety: active.filter((g) => g.bucket === 'safety').sort((a, b) => a.priority - b.priority),
      growth: active.filter((g) => g.bucket === 'growth').sort((a, b) => a.priority - b.priority),
      dream: active.filter((g) => g.bucket === 'dream').sort((a, b) => a.priority - b.priority),
    };
  }, [activeGoals]);

  const activeCount = activeGoals.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Page Header */}
      <div className="mb-8 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t('title')}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
          {isLoading ? (
            <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
              <div className="h-9 w-24 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-9 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ) : totalGoals > 0 ? (
            <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
              <Link href="/create" className="flex-1 sm:flex-initial">
                <Button size="sm" className="w-full sm:w-auto">{t('actions.addGoal')}</Button>
              </Link>
              <Link href="/timeline" className="flex-1 sm:flex-initial">
                <Button size="sm" variant="secondary" className="w-full sm:w-auto">{t('actions.viewTimeline')}</Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {/* Summary Stats */}
      {isLoading ? <SummaryStatsSkeleton /> : <SummaryStats goals={activeGoals} totalAmount={totalAmount} />}

      {/* Recommendations Widget */}
      {!isLoading && activeCount > 0 && <RecommendationsWidget goals={activeGoals} />}

      {/* Goals by Bucket */}
      {isLoading ? (
        <div className="space-y-6">
          {BUCKETS.map((bucket) => (
            <div key={bucket} className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                  <div className="space-y-2">
                    <div className="h-5 w-24 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3 w-16 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                </div>
                <div className="h-5 w-5 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="border-t border-zinc-100 px-6 py-6 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                <GoalCardSkeleton />
              </div>
            </div>
          ))}
        </div>
      ) : totalGoals === 0 ? (
        <Card className="p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-foreground">{t('empty.title')}</h3>
          <p className="mt-2 text-muted-foreground">
            {t('empty.description')}
          </p>
          <Link href="/create" className="mt-4 inline-block">
            <Button>{t('empty.cta')}</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {BUCKETS.map((bucket) => (
            <BucketSection
              key={bucket}
              bucket={bucket}
              goals={goalsByBucket[bucket]}
              totalGoals={activeCount}
            />
          ))}

          {/* Completed Goals Section (#54) */}
          {completedGoals.length > 0 && (
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-foreground">
                      {t('completedSection.title')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t('completedSection.count', { count: completedGoals.length })}
                    </p>
                  </div>
                </div>
                <svg
                  className={`h-5 w-5 text-muted-foreground transition-transform ${showCompleted ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCompleted && (
                <div className="border-t border-border px-6 py-6 bg-muted/50">
                  <div className="space-y-3">
                    {completedGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
