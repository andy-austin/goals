'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useGoals } from '@/context';
import { Button, Card, BucketSection, SummaryStats } from '@/components';
import { BUCKETS } from '@/types';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { goals, totalGoals, totalAmount, getAllGoalsByBucket } = useGoals();

  // Memoize to avoid recomputing on every render
  const goalsByBucket = useMemo(() => getAllGoalsByBucket(), [getAllGoalsByBucket]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {t('title')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      {/* Summary Stats */}
      <SummaryStats goals={goals} totalAmount={totalAmount} />

      {/* Goals by Bucket */}
      {totalGoals === 0 ? (
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
              totalGoals={totalGoals} 
            />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {totalGoals > 0 && (
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/create">
            <Button>{t('actions.addGoal')}</Button>
          </Link>
          <Link href="/timeline">
            <Button variant="secondary">{t('actions.viewTimeline')}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
