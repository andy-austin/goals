'use client';

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
  const { currentStep, totalSteps } = useFormWizard();

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div
      className={`w-full ${className}`}
      role="group"
      aria-label={`Form progress: Step ${currentStep + 1} of ${totalSteps}, ${steps[currentStep]?.label}`}
    >
      {/* Screen reader live region for step changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Step {currentStep + 1} of {totalSteps}: {steps[currentStep]?.label}
      </div>

      {/* Mobile: Simple text indicator */}
      <div className="flex items-center justify-between sm:hidden">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {steps[currentStep]?.label}
        </span>
      </div>

      {/* Desktop: Step dots with labels */}
      <div className="hidden sm:block">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              const stepStatus = isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming';

              return (
                <li
                  key={step.label}
                  className="relative flex flex-1 flex-col items-center"
                  aria-label={`Step ${index + 1}: ${step.label}, ${stepStatus}`}
                >
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-1/2 top-4 h-0.5 w-full ${
                        isCompleted ? 'bg-primary' : 'bg-zinc-200 dark:bg-zinc-700'
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
                          : 'border-zinc-300 bg-background text-zinc-500 dark:border-zinc-600 dark:text-zinc-400'
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
                        <span className="sr-only">Completed</span>
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
                          ? 'text-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-500 dark:text-zinc-400'
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
          aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
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
