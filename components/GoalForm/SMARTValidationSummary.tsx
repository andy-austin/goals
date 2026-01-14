'use client';

import { useMemo } from 'react';
import { useFormWizard } from '@/components/FormWizard';
import { BUCKET_CONFIG, formatCurrency } from '@/types';
import type { GoalFormInput } from '@/types';

// =============================================================================
// Helpers
// =============================================================================

function formatDate(dateString: string | undefined) {
  if (!dateString) return '—';
  // Parse YYYY-MM-DD manually to avoid UTC timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  // Create date at local midnight
  const date = new Date(year, month - 1, day);
  
  // Verify date is valid
  if (isNaN(date.getTime())) return 'Invalid Date';

  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// =============================================================================
// Component
// =============================================================================

export function SMARTValidationSummary() {
  const { data } = useFormWizard<Partial<GoalFormInput>>();

  const validationItems = useMemo(() => {
    const { title, description, amount, currency, targetDate, whyItMatters } = data;

    return [
      {
        label: 'Specific',
        isValid: (title?.length || 0) >= 3 && (description?.length || 0) >= 20,
        description: 'Clear title and detailed description.',
      },
      {
        label: 'Measurable',
        isValid: (amount || 0) > 0,
        description: `Target of ${amount && currency ? formatCurrency(amount, currency) : 'a specific amount'}.`,
      },
      {
        label: 'Achievable',
        isValid: true, // Placeholder for AI/feasibility check
        description: 'Timeline and amount seem realistic.',
      },
      {
        label: 'Relevant',
        isValid: (whyItMatters?.length || 0) >= 10,
        description: 'Strong personal motivation identified.',
      },
      {
        label: 'Time-bound',
        isValid: !!targetDate && new Date(targetDate) > new Date(),
        description: targetDate ? `Deadline set for ${formatDate(targetDate)}.` : 'No deadline set.',
      },
    ];
  }, [data]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        SMART Validation Summary
      </h3>
      
      <div className="grid gap-3 sm:grid-cols-2">
        {validationItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-start gap-3 rounded-lg border p-3 ${
              item.isValid
                ? 'border-success/20 bg-success/5 dark:border-success/30'
                : 'border-error/20 bg-error/5 dark:border-error/30'
            }`}
          >
            <div className={`mt-0.5 flex-shrink-0 ${item.isValid ? 'text-success' : 'text-error'}`}>
              {item.isValid ? (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {item.label}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Goal Summary Card */}
      {data.bucket && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500 uppercase">Goal Preview</span>
            <span 
              className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: BUCKET_CONFIG[data.bucket].bgColorVar,
                color: BUCKET_CONFIG[data.bucket].colorVar 
              }}
            >
              {BUCKET_CONFIG[data.bucket].label}
            </span>
          </div>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{data.title || 'Untitled Goal'}</h4>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{data.description}</p>
          <div className="mt-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3">
             <div className="text-sm">
                <span className="text-zinc-500">Target:</span>{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {data.amount && data.currency ? formatCurrency(data.amount, data.currency) : '—'}
                </span>
             </div>
             <div className="text-sm">
                <span className="text-zinc-500">By:</span>{' '}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatDate(data.targetDate)}
                </span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
