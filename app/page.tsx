'use client';

import Link from 'next/link';
import { useGoals } from '@/context';
import { BUCKET_CONFIG, formatCurrency, type Bucket } from '@/types';

export default function DashboardPage() {
  const { goals, totalGoals, totalAmount, getAllGoalsByBucket } = useGoals();
  const goalsByBucket = getAllGoalsByBucket();

  const currency = goals.length > 0 ? goals[0].currency : 'USD';

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Track and manage your investment goals.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Goals</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{totalGoals}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Target</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(totalAmount, currency)}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Buckets</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">3</p>
        </div>
      </div>

      {/* Goals by Bucket */}
      {totalGoals === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <svg
            className="mx-auto h-12 w-12 text-zinc-400"
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
          <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">No goals yet</h3>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Get started by creating your first investment goal.
          </p>
          <Link
            href="/create"
            className="mt-4 inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Create Goal
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {(['safety', 'growth', 'dream'] as Bucket[]).map((bucket) => {
            const config = BUCKET_CONFIG[bucket];
            const bucketGoals = goalsByBucket[bucket];

            return (
              <div
                key={bucket}
                className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div
                  className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800"
                  style={{ backgroundColor: config.bgColor + '20' }}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <h2 className="font-medium text-zinc-900 dark:text-zinc-100">
                    {config.label}
                  </h2>
                  <span className="ml-auto text-sm text-zinc-500 dark:text-zinc-400">
                    {bucketGoals.length} goals
                  </span>
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {bucketGoals.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                      No {bucket} goals yet
                    </p>
                  ) : (
                    bucketGoals.map((goal) => (
                      <div key={goal.id} className="px-4 py-3">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                          {goal.title}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          {formatCurrency(goal.amount, goal.currency)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      {totalGoals > 0 && (
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/create"
            className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Add Goal
          </Link>
          <Link
            href="/timeline"
            className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            View Timeline
          </Link>
        </div>
      )}
    </div>
  );
}
