'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useGoals } from '@/context';
import { Button, Card, BucketSection, SummaryStats, RecommendationsWidget } from '@/components';
import { SummaryStatsSkeleton } from '@/components/Dashboard/SummaryStatsSkeleton';
import { GoalCardSkeleton } from '@/components/Dashboard/GoalCardSkeleton';
import { GoalCard } from '@/components/Dashboard/GoalCard';
import { BUCKETS, BUCKET_CONFIG, formatDate } from '@/types';
import { GOAL_TEMPLATES } from '@/lib/templates';
import { StrategiesPanel } from '@/components/Strategies';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tTemplates = useTranslations('templates');
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
              <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
              <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
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

      {/* Savings Strategies Panel (#57) */}
      {!isLoading && activeCount > 0 && <StrategiesPanel />}

      {/* Goals by Bucket */}
      {isLoading ? (
        <div className="space-y-6">
          {BUCKETS.map((bucket) => (
            <div key={bucket} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
                  <div className="space-y-2">
                    <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
                    <div className="h-3 w-16 animate-pulse rounded-md bg-muted" />
                  </div>
                </div>
                <div className="h-5 w-5 animate-pulse rounded bg-muted" />
              </div>
              <div className="border-t border-border px-6 py-6 bg-muted/50">
                <GoalCardSkeleton />
              </div>
            </div>
          ))}
        </div>
      ) : totalGoals === 0 ? (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">{t('empty.title')}</h3>
            <p className="mt-1 text-muted-foreground">{t('empty.description')}</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {(['safety', 'growth', 'dream'] as const).map((bucket) => {
              const template = GOAL_TEMPLATES.find((tmpl) => tmpl.bucket === bucket)!;
              const config = BUCKET_CONFIG[bucket];
              return (
                <Link
                  key={bucket}
                  href={`/create?template=${template.id}`}
                  className="group rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${config.classes.bgLight} ${config.classes.text}`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {bucket === 'safety' && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                      {bucket === 'growth' && <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
                      {bucket === 'dream' && <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
                    </svg>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{tTemplates(`${template.id}.title`)}</h4>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{tTemplates(`${template.id}.description`)}</p>
                  <span className="text-xs font-medium text-primary group-hover:underline">
                    {t('empty.cta')} &rarr;
                  </span>
                </Link>
              );
            })}
          </div>

          <Link
            href="/create"
            className="block rounded-xl border-2 border-dashed border-border p-5 text-center hover:border-primary/40 hover:bg-muted/50 transition-all"
          >
            <span className="text-sm font-medium text-muted-foreground">{t('empty.startFromScratch')}</span>
          </Link>
        </div>
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
