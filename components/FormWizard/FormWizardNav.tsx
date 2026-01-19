'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { useFormWizard } from './FormWizardContext';

// =============================================================================
// Types
// =============================================================================

interface FormWizardNavProps {
  /** Text for the next button (default from translations) */
  nextLabel?: string;
  /** Text for the back button (default from translations) */
  backLabel?: string;
  /** Text for the submit button on last step (default from translations) */
  submitLabel?: string;
  /** Whether the submit is in loading state */
  isSubmitting?: boolean;
  /** Custom validation function called before next/submit */
  onValidate?: () => boolean;
  /** Called when form is submitted on the last step */
  onSubmit?: () => void;
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function FormWizardNav({
  nextLabel,
  backLabel,
  submitLabel,
  isSubmitting = false,
  onValidate,
  onSubmit,
  className = '',
}: FormWizardNavProps) {
  const t = useTranslations('common');
  const { isFirstStep, isLastStep, nextStep, prevStep, isCurrentStepValid } = useFormWizard();

  // Use provided labels or fall back to translations
  const nextBtnLabel = nextLabel || t('next');
  const backBtnLabel = backLabel || t('back');
  const submitBtnLabel = submitLabel || t('create');

  const handleNext = () => {
    // Run custom validation if provided
    if (onValidate && !onValidate()) {
      return;
    }

    if (isLastStep && onSubmit) {
      onSubmit();
    } else {
      nextStep();
    }
  };

  const canProceed = isCurrentStepValid && !isSubmitting;

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div>
        {!isFirstStep && (
          <Button
            type="button"
            variant="secondary"
            onClick={prevStep}
            disabled={isSubmitting}
          >
            {backBtnLabel}
          </Button>
        )}
      </div>

      <Button
        type="button"
        onClick={handleNext}
        disabled={!canProceed}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t('creating')}
          </span>
        ) : isLastStep ? (
          submitBtnLabel
        ) : (
          nextBtnLabel
        )}
      </Button>
    </div>
  );
}
