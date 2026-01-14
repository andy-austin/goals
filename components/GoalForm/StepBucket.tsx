'use client';

import { useEffect } from 'react';
import { useFormWizard } from '@/components/FormWizard';
import { BUCKET_CONFIG, BUCKETS } from '@/types';
import type { GoalFormInput, Bucket } from '@/types';

// =============================================================================
// Icons
// =============================================================================

const Icons = {
  safety: (className: string) => (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
      />
    </svg>
  ),
  growth: (className: string) => (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
      />
    </svg>
  ),
  dream: (className: string) => (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
      />
    </svg>
  ),
};

// =============================================================================
// Component
// =============================================================================

export function StepBucket() {
  const { data, updateData, setStepValid } = useFormWizard<Partial<GoalFormInput>>();

  const selectedBucket = data.bucket;

  // Validation
  useEffect(() => {
    setStepValid(!!selectedBucket);
  }, [selectedBucket, setStepValid]);

  const handleSelect = (bucket: Bucket) => {
    updateData({ bucket });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Categorize your goal
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Which bucket does this goal fit into? This helps determine the right investment strategy.
        </p>
      </div>

      {/* Bucket Selection Cards */}
      <div className="grid gap-4">
        {BUCKETS.map((bucket) => {
          const config = BUCKET_CONFIG[bucket];
          const isSelected = selectedBucket === bucket;
          const Icon = Icons[bucket];

          return (
            <button
              key={bucket}
              type="button"
              onClick={() => handleSelect(bucket)}
              className={`relative flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-[var(--bucket-color)] bg-[var(--bucket-bg)] ring-1 ring-[var(--bucket-color)]'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800'
              }`}
              style={
                isSelected
                  ? ({
                      '--bucket-color': config.colorVar,
                      '--bucket-bg': config.bgColorVar,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${
                  isSelected
                    ? 'bg-white text-[var(--bucket-color)] dark:bg-black'
                    : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {Icon('h-6 w-6')}
              </div>
              <div>
                <h3
                  className={`font-semibold ${
                    isSelected
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  {config.label}
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    isSelected
                      ? 'text-zinc-700 dark:text-zinc-300'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {config.description}
                </p>
              </div>
              
              {/* Checkmark for selected state */}
              {isSelected && (
                <div className="absolute right-4 top-4 text-[var(--bucket-color)]">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* SMART Tip / Methodology Tip */}
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-purple-600 dark:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Why Categorize?
            </h3>
            <p className="mt-1 text-sm text-purple-700 dark:text-purple-300">
              Different goals require different investment strategies. 
              <strong> Safety</strong> goals need low risk. 
              <strong> Growth</strong> goals balance risk and reward. 
              <strong> Dream</strong> goals can afford higher risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
