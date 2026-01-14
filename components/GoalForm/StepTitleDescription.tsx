'use client';

import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Input, Textarea, Label } from '@/components/ui';
import { useFormWizard } from '@/components/FormWizard';
import type { GoalFormInput } from '@/types';

// =============================================================================
// Constants
// =============================================================================

const MIN_TITLE_LENGTH = 3;
const MIN_DESCRIPTION_LENGTH = 20;

// =============================================================================
// Component
// =============================================================================

export function StepTitleDescription() {
  const t = useTranslations('goalForm.step1');
  const tExamples = useTranslations('examples');
  const { data, updateData, setStepValid } = useFormWizard<Partial<GoalFormInput>>();

  const title = data.title || '';
  const description = data.description || '';

  // Validation
  const titleError = title.length > 0 && title.length < MIN_TITLE_LENGTH;
  const descriptionError = description.length > 0 && description.length < MIN_DESCRIPTION_LENGTH;

  const isValid = useMemo(() => {
    return title.length >= MIN_TITLE_LENGTH && description.length >= MIN_DESCRIPTION_LENGTH;
  }, [title, description]);

  // Update step validation state
  useEffect(() => {
    setStepValid(isValid);
  }, [isValid, setStepValid]);

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

      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" required>
          {t('titleLabel')}
        </Label>
        <Input
          id="title"
          placeholder={t('titlePlaceholder')}
          value={title}
          onChange={(e) => updateData({ title: e.target.value })}
          error={titleError}
          maxLength={100}
        />
        {titleError && (
          <p className="text-sm text-error">
            {t('titleError')}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description" required>
          {t('descriptionLabel')}
        </Label>
        <Textarea
          id="description"
          placeholder={t('descriptionPlaceholder')}
          value={description}
          onChange={(e) => updateData({ description: e.target.value })}
          error={descriptionError}
          rows={4}
          maxLength={500}
        />
        <div className="flex items-center justify-between">
          <div>
            {descriptionError && (
              <p className="text-sm text-error">
                {t('descriptionError')}
              </p>
            )}
          </div>
          <span
            className={`text-xs ${
              description.length >= MIN_DESCRIPTION_LENGTH
                ? 'text-success'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {description.length}/500
          </span>
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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

      {/* Examples */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          {t('examples')}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <ExampleCard
            title={tExamples('emergencyFund.title')}
            description={tExamples('emergencyFund.description')}
          />
          <ExampleCard
            title={tExamples('houseDownPayment.title')}
            description={tExamples('houseDownPayment.description')}
          />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Helper Components
// =============================================================================

function ExampleCard({ title, description }: { title: string; description: string }) {
  const { updateData } = useFormWizard<Partial<GoalFormInput>>();

  const handleUseExample = () => {
    updateData({ title, description });
  };

  return (
    <button
      type="button"
      onClick={handleUseExample}
      className="group rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-left transition-colors hover:border-primary hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary dark:hover:bg-zinc-800"
    >
      <p className="text-sm font-medium text-zinc-900 group-hover:text-primary dark:text-zinc-100">
        {title}
      </p>
      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
        {description}
      </p>
    </button>
  );
}
