'use client';

import { useEffect, useMemo } from 'react';
import { Input, Label, Select } from '@/components/ui';
import { useFormWizard } from '@/components/FormWizard';
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
  const { data, updateData, setStepValid } = useFormWizard<Partial<GoalFormInput>>();
  
  // Default to 0 and USD if not set
  const amount = data.amount ?? '';
  const currency = data.currency || 'USD';

  // Validation
  const amountError = typeof amount === 'number' && amount <= 0;
  
  const isValid = useMemo(() => {
    return typeof amount === 'number' && amount >= MIN_AMOUNT && !!currency;
  }, [amount, currency]);

  // Update step validation state
  useEffect(() => {
    setStepValid(isValid);
  }, [isValid, setStepValid]);

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
          Set your target
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          How much do you need to achieve this goal?
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Currency Field */}
        <div className="space-y-2">
          <Label htmlFor="currency" required>
            Currency
          </Label>
          <Select
            id="currency"
            value={currency}
            onChange={(e) => updateData({ currency: e.target.value as Currency })}
          >
            {currencyOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.code} - {option.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Amount Field */}
        <div className="space-y-2">
          <Label htmlFor="amount" required>
            Target Amount
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-zinc-500 sm:text-sm">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).formatToParts(0).find(part => part.type === 'currency')?.value}
              </span>
            </div>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
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
              Please enter a valid amount greater than 0
            </p>
          )}
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              SMART Tip: Make it Measurable
            </h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Giving your goal a specific dollar amount makes it real. You can&apos;t track progress towards &quot;saving some money&quot;, but you can track progress towards $10,000.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Select Buttons */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Quick Select
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
