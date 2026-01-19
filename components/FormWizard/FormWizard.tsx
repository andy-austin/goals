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
      <div className={`space-y-6 ${className}`}>
        {/* Progress indicator */}
        <StepIndicator steps={steps} />

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
