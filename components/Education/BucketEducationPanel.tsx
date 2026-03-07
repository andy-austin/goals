'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { Bucket } from '@/types';
import { getInstrumentsForBucket } from '@/lib/education';
import { InstrumentCard } from './InstrumentCard';

interface BucketEducationPanelProps {
  bucket: Bucket;
}

const DISMISSED_KEY_PREFIX = 'fingoal_education_dismissed_';

export function BucketEducationPanel({ bucket }: BucketEducationPanelProps) {
  const t = useTranslations('education');
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  const storageKey = `${DISMISSED_KEY_PREFIX}${bucket}`;

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    setIsDismissed(dismissed === 'true');
  }, [storageKey]);

  const instruments = getInstrumentsForBucket(bucket);

  const handleDismiss = () => {
    localStorage.setItem(storageKey, 'true');
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-secondary/30 p-4'
      )}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          aria-expanded={isOpen}
        >
          <svg
            className={cn(
              'h-4 w-4 shrink-0 transition-transform',
              isOpen && 'rotate-90'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
          {t('commonInstruments')}
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t('dismiss')}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-3">
          {instruments.map((instrument) => (
            <InstrumentCard key={instrument.id} instrument={instrument} />
          ))}

          <p className="mt-4 text-xs text-muted-foreground italic border-t border-border pt-3">
            {t('disclaimer')}
          </p>
        </div>
      )}
    </div>
  );
}
