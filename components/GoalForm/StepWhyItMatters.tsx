'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Label, Textarea, AISuggestionChip } from '@/components/ui';
import { useFormWizard } from '@/components/FormWizard';
import { useAISuggestion } from '@/hooks';
import { validateSMART, MIN_WHY_IT_MATTERS_LENGTH } from '@/lib';
import { SMARTValidationSummary } from './SMARTValidationSummary';
import type { GoalFormInput } from '@/types';

// =============================================================================
// Component
// =============================================================================

export function StepWhyItMatters() {
  const t = useTranslations('goalForm.step5');
  const tAI = useTranslations('ai');
  const { data, updateData, setStepValid } = useFormWizard<Partial<GoalFormInput>>();

  const whyItMatters = data.whyItMatters || '';
  const title = data.title || '';
  const description = data.description || '';
  const amount = data.amount;
  const bucket = data.bucket;

  // AI suggestion hook
  const {
    suggestion,
    isLoading: isAILoading,
    error: aiError,
    getSuggestion,
    clearSuggestion,
    retry,
  } = useAISuggestion('whyItMatters');

  // Validation — on the final step, check overall SMART validation
  const smartValidation = useMemo(() => validateSMART(data), [data]);
  const isFieldValid = whyItMatters.length >= MIN_WHY_IT_MATTERS_LENGTH;
  const isValid = isFieldValid && smartValidation.isComplete;

  // Update step validation state
  useEffect(() => {
    setStepValid(isValid);
  }, [isValid, setStepValid]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateData({ whyItMatters: e.target.value });
  };

  // Handle AI suggestion request
  const handleGetSuggestion = useCallback(() => {
    if (title.length >= 3 || description.length >= 3) {
      getSuggestion(whyItMatters || description || title, {
        title,
        description,
        amount,
        bucket,
      });
    }
  }, [title, description, whyItMatters, amount, bucket, getSuggestion]);

  // Handle accepting AI suggestion
  const handleAcceptSuggestion = useCallback(
    (suggestedMotivation: string) => {
      updateData({ whyItMatters: suggestedMotivation });
    },
    [updateData]
  );

  // Check if we can request a suggestion
  const canRequestSuggestion = (title.length >= 3 || description.length >= 3) && !isAILoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {t('title')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      {/* Why It Matters Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="whyItMatters" required>
            {t('whyLabel')}
          </Label>
          {canRequestSuggestion && !suggestion && !isAILoading && (
            <button
              type="button"
              onClick={handleGetSuggestion}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-info hover:text-info/80 transition-colors cursor-pointer"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              {tAI('suggestion')}
            </button>
          )}
        </div>
        <Textarea
          id="whyItMatters"
          placeholder={t('whyPlaceholder')}
          value={whyItMatters}
          onChange={handleChange}
          rows={3}
          maxLength={300}
          error={whyItMatters.length > 0 && whyItMatters.length < MIN_WHY_IT_MATTERS_LENGTH}
        />
        <div className="flex items-center justify-between">
          <div>
            {whyItMatters.length > 0 && whyItMatters.length < MIN_WHY_IT_MATTERS_LENGTH && (
              <p className="text-sm text-error">
                {t('whyError')}
              </p>
            )}
          </div>
          <span
            className={`text-xs ${
              whyItMatters.length >= MIN_WHY_IT_MATTERS_LENGTH
                ? 'text-success'
                : 'text-muted-foreground'
            }`}
          >
            {whyItMatters.length}/300
          </span>
        </div>

        {/* AI Suggestion Chip */}
        <AISuggestionChip
          suggestion={suggestion}
          isLoading={isAILoading}
          error={aiError || undefined}
          onAccept={handleAcceptSuggestion}
          onDismiss={clearSuggestion}
          onRetry={retry}
          acceptLabel={tAI('useThis')}
          dismissLabel={tAI('dismiss')}
          retryLabel={tAI('retry')}
        />
      </div>

      {!isValid && (
        <>
          {/* SMART Tip */}
          <div className="rounded-lg border border-info/30 bg-info/10 p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-info"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-info">
                  {t('smartTip')}
                </h3>
                <p className="mt-1 text-sm text-info/80">
                  {t('smartTipText')}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Select Examples */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t('examples')}
            </p>
            <div className="flex flex-col gap-2">
              {[
                t('example1'),
                t('example2'),
                t('example3'),
                t('example4')
              ].map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => updateData({ whyItMatters: example })}
                  className="text-left text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  &quot;{example}&quot;
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <SMARTValidationSummary />
      </div>
    </div>
  );
}

/**
 * Sparkles icon for AI suggestion button
 */
function SparklesIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
      />
    </svg>
  );
}
