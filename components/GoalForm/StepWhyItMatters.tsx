'use client';

import { useEffect, useMemo } from 'react';
import { Label, Textarea } from '@/components/ui';
import { useFormWizard } from '@/components/FormWizard';
import type { GoalFormInput } from '@/types';

// =============================================================================
// Constants
// =============================================================================

const MIN_LENGTH = 10;

// =============================================================================
// Component
// =============================================================================

export function StepWhyItMatters() {
  const { data, updateData, setStepValid } = useFormWizard<Partial<GoalFormInput>>();

  const whyItMatters = data.whyItMatters || '';

  // Validation
  const isValid = useMemo(() => {
    return whyItMatters.length >= MIN_LENGTH;
  }, [whyItMatters]);

  // Update step validation state
  useEffect(() => {
    setStepValid(isValid);
  }, [isValid, setStepValid]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateData({ whyItMatters: e.target.value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Why does this matter?
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Connect your goal to an emotional anchor. This is what will keep you going when saving gets tough.
        </p>
      </div>

      {/* Why It Matters Field */}
      <div className="space-y-2">
        <Label htmlFor="whyItMatters" required>
          Your Motivation
        </Label>
        <Textarea
          id="whyItMatters"
          placeholder="e.g., I want to provide financial security for my family, or I want to have the freedom to travel the world."
          value={whyItMatters}
          onChange={handleChange}
          rows={4}
          maxLength={300}
          error={whyItMatters.length > 0 && whyItMatters.length < MIN_LENGTH}
        />
        <div className="flex items-center justify-between">
          <div>
            {whyItMatters.length > 0 && whyItMatters.length < MIN_LENGTH && (
              <p className="text-sm text-error">
                Please enter at least {MIN_LENGTH} characters
              </p>
            )}
          </div>
          <span
            className={`text-xs ${
              whyItMatters.length >= MIN_LENGTH
                ? 'text-success'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {whyItMatters.length}/300
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              SMART Tip: Make it Relevant
            </h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              A relevant goal matters to you and aligns with your other relevant goals. 
              If the goal isn&apos;t important, you won&apos;t stick to it.
            </p>
          </div>
        </div>
      </div>

       {/* Quick Select Examples */}
       <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          Examples
        </p>
        <div className="flex flex-col gap-2">
          {[
            "To have peace of mind knowing I can handle unexpected expenses.",
            "To build a legacy for my children and their education.",
            "To enjoy my retirement years without financial stress.",
            "To have the freedom to pursue my passion projects."
          ].map((example) => (
             <button
              key={example}
              type="button"
              onClick={() => updateData({ whyItMatters: example })}
              className="text-left text-sm text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary transition-colors"
            >
              &quot;{example}&quot;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
