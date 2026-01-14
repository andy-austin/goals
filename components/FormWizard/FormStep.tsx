'use client';

import { type ReactNode, useEffect } from 'react';
import { useFormWizard } from './FormWizardContext';

// =============================================================================
// Types
// =============================================================================

interface FormStepProps {
  /** The step index this component represents (0-based) */
  step: number;
  /** Whether this step is currently valid */
  isValid?: boolean;
  /** Step content */
  children: ReactNode;
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function FormStep({ step, isValid = true, children, className = '' }: FormStepProps) {
  const { currentStep, setStepValid } = useFormWizard();

  // Update validation state when isValid changes
  useEffect(() => {
    if (currentStep === step) {
      setStepValid(isValid);
    }
  }, [currentStep, step, isValid, setStepValid]);

  // Only render if this is the current step
  if (currentStep !== step) {
    return null;
  }

  return (
    <div className={`animate-in fade-in duration-300 ${className}`}>
      {children}
    </div>
  );
}
