'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

// =============================================================================
// Types
// =============================================================================

export interface FormWizardContextValue<T extends Record<string, unknown>> {
  /** Current step index (0-based) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Form data accumulated across all steps */
  data: Partial<T>;
  /** Whether on the first step */
  isFirstStep: boolean;
  /** Whether on the last step */
  isLastStep: boolean;
  /** Go to the next step */
  nextStep: () => void;
  /** Go to the previous step */
  prevStep: () => void;
  /** Go to a specific step */
  goToStep: (step: number) => void;
  /** Update form data */
  updateData: (updates: Partial<T>) => void;
  /** Reset the wizard to initial state */
  reset: () => void;
  /** Set validation state for current step */
  setStepValid: (isValid: boolean) => void;
  /** Whether current step is valid */
  isCurrentStepValid: boolean;
}

// =============================================================================
// Context
// =============================================================================

const FormWizardContext = createContext<FormWizardContextValue<Record<string, unknown>> | null>(null);

// =============================================================================
// Provider
// =============================================================================

interface FormWizardProviderProps<T extends Record<string, unknown>> {
  children: ReactNode;
  totalSteps: number;
  initialData?: Partial<T>;
  onComplete?: (data: T) => void;
}

export function FormWizardProvider<T extends Record<string, unknown>>({
  children,
  totalSteps,
  initialData = {},
  onComplete,
}: FormWizardProviderProps<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<T>>(initialData);
  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({});

  // Sync data state when initialData prop changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const timer = setTimeout(() => {
        setData((prev) => ({ ...prev, ...initialData }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialData]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const isCurrentStepValid = stepValidation[currentStep] ?? false;

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (isLastStep && onComplete) {
      onComplete(data as T);
    }
  }, [currentStep, totalSteps, isLastStep, onComplete, data]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const updateData = useCallback((updates: Partial<T>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setData(initialData);
    setStepValidation({});
  }, [initialData]);

  const setStepValid = useCallback((isValid: boolean) => {
    setStepValidation((prev) => ({ ...prev, [currentStep]: isValid }));
  }, [currentStep]);

  const value = useMemo(
    () => ({
      currentStep,
      totalSteps,
      data,
      isFirstStep,
      isLastStep,
      nextStep,
      prevStep,
      goToStep,
      updateData,
      reset,
      setStepValid,
      isCurrentStepValid,
    }),
    [
      currentStep,
      totalSteps,
      data,
      isFirstStep,
      isLastStep,
      nextStep,
      prevStep,
      goToStep,
      updateData,
      reset,
      setStepValid,
      isCurrentStepValid,
    ]
  );

  return (
    <FormWizardContext.Provider value={value as FormWizardContextValue<Record<string, unknown>>}>
      {children}
    </FormWizardContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useFormWizard<T extends Record<string, unknown>>(): FormWizardContextValue<T> {
  const context = useContext(FormWizardContext);
  if (!context) {
    throw new Error('useFormWizard must be used within a FormWizardProvider');
  }
  return context as FormWizardContextValue<T>;
}
