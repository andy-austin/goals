'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Input, Label, Select, AISuggestionChip, Button } from '@/components/ui';
import { useFormWizard } from '@/components/FormWizard';
import { useAISuggestion } from '@/hooks';
import { getCurrencyOptions } from '@/types';
import type { GoalFormInput, Currency } from '@/types';

// =============================================================================
// Constants
// =============================================================================

const MIN_AMOUNT = 1;

// =============================================================================
// Component
// =============================================================================

export function StepAmountCurrency() {
  const t = useTranslations('goalForm.step2');
  const tAI = useTranslations('ai');
  const { data, updateData, setStepValid } = useFormWizard<Partial<GoalFormInput>>();

  // Default to 0 and USD if not set
  const amount = data.amount ?? '';
  const currency = data.currency || 'USD';
  const title = data.title || '';
  const description = data.description || '';

  // AI suggestion hook
  const {
    suggestion,
    reasoning,
    isLoading: isAILoading,
    error: aiError,
    getSuggestion,
    clearSuggestion,
    retry,
  } = useAISuggestion('amount');

  // Validation
  const amountError = typeof amount === 'number' && amount <= 0;

  const isValid = useMemo(() => {
    return typeof amount === 'number' && amount >= MIN_AMOUNT && !!currency;
  }, [amount, currency]);

  // Update step validation state
  useEffect(() => {
    setStepValid(isValid);
  }, [isValid, setStepValid]);

  // Set default currency if not set
  useEffect(() => {
    if (!data.currency) {
      updateData({ currency: 'USD' });
    }
  }, [data.currency, updateData]);

  // Handle AI suggestion request
  const handleGetSuggestion = useCallback(() => {
    if (title.length >= 3 || description.length >= 3) {
      getSuggestion(description || title, { title, description, currency });
    }
  }, [title, description, currency, getSuggestion]);

  // Handle accepting AI suggestion
  const handleAcceptSuggestion = useCallback(
    (suggestedAmount: string) => {
      const numValue = parseFloat(suggestedAmount);
      if (!isNaN(numValue) && numValue > 0) {
        updateData({ amount: numValue });
      }
    },
    [updateData]
  );

  // Check if we can request a suggestion
  const canRequestSuggestion = (title.length >= 3 || description.length >= 3) && !isAILoading;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for better UX while typing, but update with 0 or value
    if (value === '') {
      updateData({ amount: undefined }); // Use undefined to represent empty
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateData({ amount: numValue });
    }
  };

  const currencyOptions = useMemo(() => getCurrencyOptions(), []);

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

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Currency Field */}
        <div className="space-y-2">
          <Label htmlFor="currency" required>
            {t('currencyLabel')}
          </Label>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {(['USD', 'UYU', 'UYI'] as const).map((code) => (
                <Button
                  key={code}
                  type="button"
                  variant={currency === code ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => updateData({ currency: code })}
                  className="flex-1"
                >
                  {code === 'UYI' ? 'UI' : code}
                </Button>
              ))}
            </div>
            <Select
              id="currency"
              value={currency}
              onChange={(e) => updateData({ currency: e.target.value as Currency })}
            >
              {currencyOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.code === 'UYI' ? 'UI' : option.code} - {option.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Amount Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="amount" required>
              {t('amountLabel')}
            </Label>
            {canRequestSuggestion && !suggestion && !isAILoading && (
              <button
                type="button"
                onClick={handleGetSuggestion}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-info hover:text-info/80 transition-colors"
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                {tAI('suggestion')}
              </button>
            )}
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-zinc-500 sm:text-sm">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).formatToParts(0).find(part => part.type === 'currency')?.value}
              </span>
            </div>
            <Input
              id="amount"
              type="number"
              placeholder={t('amountPlaceholder')}
              className="pl-12"
              value={amount === undefined ? '' : amount}
              onChange={handleAmountChange}
              error={amountError}
              min={0}
              step="0.01"
            />
          </div>
          {amountError && (
            <p className="text-sm text-error">
              {t('amountError')}
            </p>
          )}
        </div>
      </div>

      {/* AI Suggestion Chip */}
      {(suggestion || isAILoading || aiError) && (
        <AISuggestionChip
          suggestion={
            suggestion
              ? `${new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(parseFloat(suggestion))}${reasoning ? ` - ${reasoning}` : ''}`
              : null
          }
          isLoading={isAILoading}
          error={aiError || undefined}
          onAccept={() => suggestion && handleAcceptSuggestion(suggestion)}
          onDismiss={clearSuggestion}
          onRetry={retry}
          acceptLabel={tAI('useThis')}
          dismissLabel={tAI('dismiss')}
          retryLabel={tAI('retry')}
        />
      )}

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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
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

      {/* Quick Select Buttons */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          {t('quickSelect')}
        </p>
        <div className="flex flex-wrap gap-2">
          {[1000, 5000, 10000, 25000, 50000, 100000].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => updateData({ amount: val })}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600 transition-colors hover:border-primary hover:text-primary dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-primary dark:hover:text-primary"
            >
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(val)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Helper Components
// =============================================================================

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
