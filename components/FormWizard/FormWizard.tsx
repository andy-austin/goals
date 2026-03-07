'use client';

import { type ReactNode } from 'react';
import { FormWizardProvider } from './FormWizardContext';
import { StepIndicator } from './StepIndicator';
import { FormWizardNav } from './FormWizardNav';
import { Card, CardContent } from '@/components/ui';

// =============================================================================
// Types
// =============================================================================

interface StepConfig {
  label: string;
}

interface FormWizardProps<T extends Record<string, unknown>> {
  /** Configuration for each step */
  steps: StepConfig[];
  /** Initial form data (for template pre-fill) */
  initialData?: Partial<T>;
  /** Called when form is completed */
  onComplete: (data: T) => void;
  /** Step content */
  children: ReactNode;
  /** Text for the submit button */
  submitLabel?: string;
  /** Whether submitting is in progress */
  isSubmitting?: boolean;
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function FormWizard<T extends Record<string, unknown>>({
  steps,
  initialData,
  onComplete,
  children,
  submitLabel,
  isSubmitting = false,
  className = '',
}: FormWizardProps<T>) {
  return (
    <FormWizardProvider<T>
      totalSteps={steps.length}
      initialData={initialData}
      onComplete={onComplete}
    >
      <div className={`space-y-6 pb-6 ${className}`}>
        {/* Progress indicator — sticky on mobile so users keep context while scrolling */}
        <div className="sticky top-0 z-20 -mx-4 px-4 py-2 bg-muted/80 backdrop-blur-sm sm:static sm:mx-0 sm:px-0 sm:py-0 sm:bg-transparent sm:backdrop-blur-none">
          <StepIndicator steps={steps} />
        </div>

        {/* Step content */}
        <Card>
          <CardContent className="pt-6">
            {children}
          </CardContent>
        </Card>

        {/* Navigation */}
        <FormWizardNav
          submitLabel={submitLabel}
          isSubmitting={isSubmitting}
        />
      </div>
    </FormWizardProvider>
  );
}
