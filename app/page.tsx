'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useGoals } from '@/context';
import { Button, Card, CardContent, BucketBadge } from '@/components';
import { BUCKET_CONFIG, formatCurrency, type Bucket } from '@/types';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tBuckets = useTranslations('buckets');
  const { goals, totalGoals, totalAmount, getAllGoalsByBucket } = useGoals();
  const goalsByBucket = getAllGoalsByBucket();

  const currency = goals.length > 0 ? goals[0].currency : 'USD';

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

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent>
            <p className="text-sm font-medium text-muted-foreground">{t('stats.totalGoals')}</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{totalGoals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm font-medium text-muted-foreground">{t('stats.totalTarget')}</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {formatCurrency(totalAmount, currency)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm font-medium text-muted-foreground">{t('stats.buckets')}</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">3</p>
          </CardContent>
        </Card>
      </div>

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
        <div className="grid gap-6 lg:grid-cols-3">
          {(['safety', 'growth', 'dream'] as Bucket[]).map((bucket) => {
            const config = BUCKET_CONFIG[bucket];
            const bucketGoals = goalsByBucket[bucket];

            return (
              <Card key={bucket}>
                <div
                  className="flex items-center gap-2 border-b border-border px-4 py-3"
                  style={{ backgroundColor: config.bgColorVar }}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: config.colorVar }}
                  />
                  <h2 className="font-medium text-foreground">
                    {tBuckets(`${bucket}.name`)}
                  </h2>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {bucketGoals.length} {t('goalsCount')}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {bucketGoals.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                      {t('noBucketGoals', { bucket: tBuckets(`${bucket}.name`).toLowerCase() })}
                    </p>
                  ) : (
                    bucketGoals.map((goal) => (
                      <div key={goal.id} className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">
                            {goal.title}
                          </p>
                          <BucketBadge bucket={goal.bucket} size="sm" showIcon={false} />
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatCurrency(goal.amount, goal.currency)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            );
          })}
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
