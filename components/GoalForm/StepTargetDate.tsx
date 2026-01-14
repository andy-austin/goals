'use client';

import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Input, Label } from '@/components/ui';
import { useFormWizard } from '@/components/FormWizard';
import type { GoalFormInput } from '@/types';

// =============================================================================
// Constants
// =============================================================================

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// =============================================================================
// Component
// =============================================================================

export function StepTargetDate() {
  const t = useTranslations('goalForm.step3');
  const { data, updateData, setStepValid } = useFormWizard<Partial<GoalFormInput>>();

  const targetDate = data.targetDate || '';

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  // Validation
  const isValid = useMemo(() => {
    if (!targetDate) return false;
    return targetDate >= today;
  }, [targetDate, today]);

  // Update step validation state
  useEffect(() => {
    setStepValid(isValid);
  }, [isValid, setStepValid]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ targetDate: e.target.value });
  };

  const setQuickDate = (years: number) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + years);
    updateData({ targetDate: date.toISOString().split('T')[0] });
  };

  // Calculate time remaining description
  const timeRemaining = useMemo(() => {
    if (!targetDate) return null;
    
    const start = new Date();
    const end = new Date(targetDate);
    
    // Reset hours to compare dates only
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / ONE_DAY_MS);
    
    if (diffDays < 0) return 'Date is in the past';
    if (diffDays === 0) return 'Today';
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}${months > 0 ? ` and ${months} month${months > 1 ? 's' : ''}` : ''}`;
    }
    
    if (months > 0) {
      const days = diffDays % 30;
      return `${months} month${months > 1 ? 's' : ''}${days > 0 ? ` and ${days} day${days > 1 ? 's' : ''}` : ''}`;
    }
    
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  }, [targetDate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {t('subtitle')}
        </p>
      </div>

      {/* Date Input */}
      <div className="space-y-2">
        <Label htmlFor="targetDate" required>
          {t('dateLabel')}
        </Label>
        <Input
          id="targetDate"
          type="date"
          min={today}
          value={targetDate}
          onChange={handleDateChange}
          error={!!targetDate && targetDate < today}
        />
        {targetDate && targetDate < today && (
          <p className="text-sm text-error">
            {t('dateError')}
          </p>
        )}
        {isValid && timeRemaining && (
          <p className="text-sm text-success">
            {t('timeHorizon', { time: timeRemaining })}
          </p>
        )}
      </div>

      {/* Quick Select Buttons */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          {t('quickSelect.label')}
        </p>
        <div className="flex flex-wrap gap-2">
          {[1, 3, 5, 10, 20].map((years) => (
            <button
              key={years}
              type="button"
              onClick={() => setQuickDate(years)}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600 transition-colors hover:border-primary hover:text-primary dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-primary dark:hover:text-primary"
            >
              {t(`quickSelect.${years}year${years > 1 ? 's' : ''}`)}
            </button>
          ))}
        </div>
      </div>

      {/* SMART Tip */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {t('smartTip')}
            </h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              {t('smartTipText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
