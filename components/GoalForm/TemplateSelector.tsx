'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BUCKET_CONFIG, BUCKETS, Bucket, GoalTemplate } from '@/types';
import { GOAL_TEMPLATES } from '@/lib/templates';

// =============================================================================
// Props
// =============================================================================

interface TemplateSelectorProps {
  onSelect: (template: GoalTemplate) => void;
}

// =============================================================================
// Icons (Simplified version of StepBucket icons)
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

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const tBuckets = useTranslations('buckets');
  const [activeBucket, setActiveBucket] = useState<Bucket>('safety');

  // Filter templates by active bucket
  const templates = GOAL_TEMPLATES.filter((t) => t.bucket === activeBucket);

  return (
    <div className="space-y-6">
      {/* Bucket Tabs */}
      <div className="flex p-1 space-x-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
        {BUCKETS.map((bucket) => {
          const isActive = activeBucket === bucket;
          const config = BUCKET_CONFIG[bucket];
          
          return (
            <button
              key={bucket}
              onClick={() => setActiveBucket(bucket)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                isActive
                  ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <div className={isActive ? `text-[${config.colorVar}]` : ''} style={isActive ? { color: config.colorVar } : undefined}>
                {Icons[bucket]('w-4 h-4')}
              </div>
              {tBuckets(`${bucket}.name`)}
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className="text-left group relative flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-[var(--bucket-color)] hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            style={{
              '--bucket-color': BUCKET_CONFIG[template.bucket].colorVar,
            } as React.CSSProperties}
          >
            <div className="flex items-start justify-between w-full">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-[var(--bucket-color)]">
                {template.title}
              </h3>
              {/* Optional: Icon rendering if we mapped string icon names to components */}
            </div>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
              {template.description}
            </p>

            <div className="mt-auto pt-2 flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-500">
               {/* Metadata badges could go here (e.g. "3-6 months") */}
               <span>{template.suggestedTimelineMonths} months</span>
               <span>•</span>
               <span>${template.suggestedAmountMin.toLocaleString()} - ${template.suggestedAmountMax.toLocaleString()}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
