'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FormWizard, FormStep, StepTitleDescription, StepAmountCurrency, StepTargetDate, StepBucket, StepWhyItMatters, TemplateSelector, Tooltip, RecommendationScreen } from '@/components';
import { useGoals } from '@/context';
import { useToast } from '@/components/ui/Toast';
import { validateSMART } from '@/lib';
import { getRecommendations } from '@/lib/recommendations/engine';
import type { GoalFormInput, GoalTemplate, Currency, Goal } from '@/types';
import { CURRENCIES } from '@/types';
import type { Recommendation } from '@/lib/recommendations/types';

// =============================================================================
// Main Page Component
// =============================================================================

export default function CreateGoalPage() {
  const t = useTranslations('goalForm');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addGoal } = useGoals();
  const { showToast } = useToast();

  // State for wizard mode and initial data
  const [mode, setMode] = useState<'selection' | 'wizard' | 'recommendation'>('selection');
  const [initialData, setInitialData] = useState<Partial<GoalFormInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGoal, setCreatedGoal] = useState<Goal | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  // Initialize from URL params if present
  useEffect(() => {
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency');
    const date = searchParams.get('date');
    const spaceIdParam = searchParams.get('spaceId');

    if (amount || currency || date || spaceIdParam) {
      const timer = setTimeout(() => {
        setInitialData(prev => {
          // Validate currency param against allowed currencies
          const validatedCurrency = currency && CURRENCIES.includes(currency as Currency)
            ? (currency as Currency)
            : undefined;

          return {
            ...prev,
            amount: amount ? parseFloat(amount) : undefined,
            currency: validatedCurrency,
            targetDate: date || undefined,
            ...(spaceIdParam ? { visibility: 'shared' as const, spaceId: spaceIdParam } : {}),
          };
        });
        setMode('wizard');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

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
    
    setInitialData(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      amount: template.suggestedAmountMin,
      currency: 'USD', // Default currency
      targetDate: targetDate.toISOString().split('T')[0],
      bucket: template.bucket,
      whyItMatters: template.sampleWhyItMatters,
    }));
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
      showToast(t('validationError'), 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate a delay for UX feedback
    setTimeout(() => {
      const newGoal = addGoal({
        title: data.title!,
        description: data.description!,
        amount: data.amount!,
        currency: data.currency!,
        targetDate: new Date(data.targetDate!),
        bucket: data.bucket!,
        whyItMatters: data.whyItMatters!,
        visibility: data.visibility ?? 'private',
        spaceId: data.spaceId ?? null,
      });

      setIsSubmitting(false);

      // Try to show recommendation screen
      const rec = getRecommendations(newGoal);
      if (rec) {
        setCreatedGoal(newGoal);
        setRecommendation(rec);
        setMode('recommendation');
      } else {
        router.push('/dashboard');
      }
    }, 800);
  };

  if (mode === 'recommendation' && createdGoal && recommendation) {
    return (
      <RecommendationScreen
        goal={createdGoal}
        recommendation={recommendation}
        onSkip={() => router.push('/dashboard')}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {t('createTitle')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('createSubtitle')}
          <Tooltip content={t('learnMoreSmart')} className="ml-1.5 align-middle -translate-y-px">
            <a
              href="https://en.wikipedia.org/wiki/SMART_criteria"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              aria-label={t('learnMoreSmart')}
            >
              ?
            </a>
          </Tooltip>
        </p>
      </div>

      {mode === 'selection' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Start Custom Goal Section */}
          <section>
            <button
              type="button"
              onClick={handleStartCustom}
              className="w-full rounded-xl border-2 border-dashed border-border p-6 text-left hover:border-primary/40 hover:bg-muted/50 transition-all cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {t('selection.title')}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('selection.description')}
              </p>
              <span className="mt-3 inline-flex items-center text-sm font-medium text-primary">
                {t('selection.cta')} &rarr;
              </span>
            </button>
          </section>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-sm text-muted-foreground">
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
