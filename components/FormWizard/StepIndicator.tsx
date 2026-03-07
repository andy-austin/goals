'use client';

import { useTranslations } from 'next-intl';
import { useFormWizard } from './FormWizardContext';

// =============================================================================
// Types
// =============================================================================

interface StepInfo {
  label: string;
}

interface StepIndicatorProps {
  steps: StepInfo[];
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function StepIndicator({ steps, className = '' }: StepIndicatorProps) {
  const t = useTranslations('common.stepIndicator');
  const { currentStep, totalSteps } = useFormWizard();

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div
      className={`w-full ${className}`}
      role="group"
      aria-label={t('progress', {
        current: currentStep + 1,
        total: totalSteps,
        label: steps[currentStep]?.label,
      })}
    >
      {/* Screen reader live region for step changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {t('stepOf', { current: currentStep + 1, total: totalSteps })}: {steps[currentStep]?.label}
      </div>

      {/* Mobile: Compact step bar with previous/current/next labels */}
      <div className="flex items-center justify-center gap-1 sm:hidden">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isAdjacent = Math.abs(index - currentStep) === 1;

          return (
            <div key={step.label} className="flex items-center">
              {/* Connector before (skip first) */}
              {index > 0 && (
                <div
                  className={`h-0.5 w-3 ${isCompleted || isCurrent ? 'bg-primary' : 'bg-border'}`}
                  aria-hidden="true"
                />
              )}
              {/* Step dot + optional label */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                        ? 'border-2 border-primary bg-background text-primary'
                        : 'border border-border bg-background text-muted-foreground'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span aria-hidden="true">{index + 1}</span>
                  )}
                </div>
                {(isCurrent || isAdjacent) && (
                  <span
                    className={`mt-1 text-[10px] leading-tight max-w-[48px] truncate text-center ${
                      isCurrent ? 'font-semibold text-primary' : 'text-muted-foreground'
                    }`}
                    aria-hidden="true"
                  >
                    {step.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Step dots with labels */}
      <div className="hidden sm:block">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              const stepStatusKey = isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming';
              const stepStatus = t(`status.${stepStatusKey}`);

              return (
                <li
                  key={step.label}
                  className="relative flex flex-1 flex-col items-center"
                  aria-label={t('stepLabel', {
                    index: index + 1,
                    label: step.label,
                    status: stepStatus,
                  })}
                >
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-1/2 top-4 h-0.5 w-full ${
                        isCompleted ? 'bg-primary' : 'bg-border'
                      }`}
                      aria-hidden="true"
                    />
                  )}

                  {/* Step circle */}
                  <div
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                      isCompleted
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isCurrent
                          ? 'border-primary bg-background text-primary'
                          : 'border-border bg-background text-muted-foreground'
                    }`}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {isCompleted ? (
                      <>
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="sr-only">{t('completed')}</span>
                      </>
                    ) : (
                      <span aria-hidden="true">{index + 1}</span>
                    )}
                  </div>

                  {/* Step label */}
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                    }`}
                    aria-hidden="true"
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Progress bar (mobile) */}
      <div className="mt-2 sm:hidden">
        <div
          className="h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-700"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={t('stepOf', { current: currentStep + 1, total: totalSteps })}
        >
          <div
            className="h-1 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
