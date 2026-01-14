'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FormWizard, FormStep, StepTitleDescription, StepAmountCurrency, StepTargetDate, StepBucket, StepWhyItMatters } from '@/components';
import { useGoals } from '@/context';
import { validateSMART } from '@/lib';
import type { GoalFormInput } from '@/types';

// =============================================================================
// Main Page Component
// =============================================================================

export default function CreateGoalPage() {
  const t = useTranslations('goalForm');
  const router = useRouter();
  const { addGoal } = useGoals();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { label: t('steps.details') },
    { label: t('steps.amount') },
    { label: t('steps.date') },
    { label: t('steps.category') },
    { label: t('steps.why') },
  ];

  const handleComplete = (data: Partial<GoalFormInput>) => {
    // Final data validation before saving
    const validation = validateSMART(data);
    if (!validation.isComplete) {
      console.error('Incomplete goal data', validation);
      return;
    }

    setIsSubmitting(true);

    // Simulate a delay for UX feedback
    setTimeout(() => {
      addGoal({
        title: data.title!,
        description: data.description!,
        amount: data.amount!,
        currency: data.currency!,
        targetDate: new Date(data.targetDate!),
        bucket: data.bucket!,
        whyItMatters: data.whyItMatters!,
      });

      setIsSubmitting(false);
      router.push('/');
    }, 800);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {t('createTitle')}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {t('createSubtitle')}
        </p>
      </div>

      <FormWizard<Partial<GoalFormInput>>
        steps={steps}
        onComplete={handleComplete}
        isSubmitting={isSubmitting}
      >
        <FormStep step={0}>
          <StepTitleDescription />
        </FormStep>

        <FormStep step={1}>
          <StepAmountCurrency />
        </FormStep>

        <FormStep step={2}>
          <StepTargetDate />
        </FormStep>

        <FormStep step={3}>
          <StepBucket />
        </FormStep>

        <FormStep step={4}>
          <StepWhyItMatters />
        </FormStep>
      </FormWizard>
    </div>
  );
}
