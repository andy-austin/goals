'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FormWizard, FormStep, StepTitleDescription, StepAmountCurrency, StepTargetDate, StepBucket, StepWhyItMatters, TemplateSelector, Button, Card, CardContent } from '@/components';
import { useGoals } from '@/context';
import { validateSMART } from '@/lib';
import type { GoalFormInput, GoalTemplate } from '@/types';

// =============================================================================
// Main Page Component
// =============================================================================

export default function CreateGoalPage() {
  const t = useTranslations('goalForm');
  const router = useRouter();
  const { addGoal } = useGoals();
  
  // State for wizard mode and initial data
  const [mode, setMode] = useState<'selection' | 'wizard'>('selection');
  const [initialData, setInitialData] = useState<Partial<GoalFormInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { label: t('steps.details') },
    { label: t('steps.amount') },
    { label: t('steps.date') },
    { label: t('steps.category') },
    { label: t('steps.why') },
  ];

  // Handle template selection
  const handleTemplateSelect = (template: GoalTemplate) => {
    // Calculate target date based on suggested months
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + template.suggestedTimelineMonths);
    
    setInitialData({
      title: template.title,
      description: template.description,
      amount: template.suggestedAmountMin,
      currency: 'USD', // Default currency
      targetDate: targetDate.toISOString(),
      bucket: template.bucket,
      whyItMatters: template.sampleWhyItMatters,
    });
    setMode('wizard');
  };

  // Handle starting from scratch
  const handleStartCustom = () => {
    setInitialData({});
    setMode('wizard');
  };

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
          {mode === 'wizard' ? t('createTitle') : t('createTitle')} 
          {/* Note: Could have different titles for selection screen */}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {t('createSubtitle')}
        </p>
      </div>

      {mode === 'selection' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Start Custom Goal Section */}
          <section>
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer" onClick={handleStartCustom}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {t('selection.title')}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {t('selection.description')}
                  </p>
                </div>
                <Button onClick={(e) => { e.stopPropagation(); handleStartCustom(); }}>
                  {t('selection.cta')}
                </Button>
              </CardContent>
            </Card>
          </section>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-zinc-50 dark:bg-zinc-950 px-2 text-sm text-zinc-500">
                {t('selection.divider')}
              </span>
            </div>
          </div>

          {/* Templates Section */}
          <section>
            <TemplateSelector onSelect={handleTemplateSelect} />
          </section>
        </div>
      ) : (
        <FormWizard<Partial<GoalFormInput>>
          steps={steps}
          initialData={initialData}
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
      )}
    </div>
  );
}
