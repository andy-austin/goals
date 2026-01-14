'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormWizard, FormStep, useFormWizard } from '@/components';
import { useGoals } from '@/context';
import type { GoalFormInput } from '@/types';

// =============================================================================
// Step Configuration
// =============================================================================

const STEPS = [
  { label: 'Details' },
  { label: 'Amount' },
  { label: 'Date' },
  { label: 'Category' },
  { label: 'Why' },
];

// =============================================================================
// Placeholder Step Components (to be replaced in future issues)
// =============================================================================

function StepPlaceholder({ title, description }: { title: string; description: string }) {
  const { setStepValid } = useFormWizard();

  // For now, mark all steps as valid for testing navigation
  useState(() => {
    setStepValid(true);
  });

  return (
    <div className="py-8 text-center">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
        Form fields will be implemented in subsequent issues.
      </p>
    </div>
  );
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function CreateGoalPage() {
  const router = useRouter();
  const { addGoal } = useGoals();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = (data: Partial<GoalFormInput>) => {
    setIsSubmitting(true);

    // Simulate a delay for UX feedback
    setTimeout(() => {
      // TODO: Use actual form data when steps are implemented
      // For now, create a sample goal for testing
      addGoal({
        title: data.title || 'Sample Goal',
        description: data.description || 'This is a sample goal created from the wizard.',
        amount: data.amount || 10000,
        currency: data.currency || 'USD',
        targetDate: data.targetDate ? new Date(data.targetDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        bucket: data.bucket || 'growth',
        whyItMatters: data.whyItMatters || 'To achieve my financial goals.',
      });

      setIsSubmitting(false);
      router.push('/');
    }, 500);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Create a New Goal
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Define your investment goal using the SMART framework.
        </p>
      </div>

      <FormWizard<Partial<GoalFormInput>>
        steps={STEPS}
        onComplete={handleComplete}
        isSubmitting={isSubmitting}
      >
        <FormStep step={0} isValid={true}>
          <StepPlaceholder
            title="Step 1: Goal Details"
            description="Enter your goal title and a specific description."
          />
        </FormStep>

        <FormStep step={1} isValid={true}>
          <StepPlaceholder
            title="Step 2: Target Amount"
            description="Set your target amount and currency."
          />
        </FormStep>

        <FormStep step={2} isValid={true}>
          <StepPlaceholder
            title="Step 3: Target Date"
            description="Choose when you want to achieve this goal."
          />
        </FormStep>

        <FormStep step={3} isValid={true}>
          <StepPlaceholder
            title="Step 4: Category"
            description="Categorize your goal into Safety, Growth, or Dream bucket."
          />
        </FormStep>

        <FormStep step={4} isValid={true}>
          <StepPlaceholder
            title="Step 5: Why It Matters"
            description="Explain why this goal is important to you."
          />
        </FormStep>
      </FormWizard>
    </div>
  );
}
