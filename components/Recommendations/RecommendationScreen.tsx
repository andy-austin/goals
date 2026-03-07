'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { Goal } from '@/types';
import { formatCurrency, getCurrencySymbol } from '@/types';
import type { Recommendation } from '@/lib/recommendations/types';
import { estimateInterest } from '@/lib/recommendations/engine';
import { trackRecommendationEvent } from '@/lib/recommendations/tracking';
import { Button } from '@/components/ui/Button';
import { AffiliateDisclosure } from '@/components/ui/AffiliateDisclosure';
import { ProductCard } from './ProductCard';

interface RecommendationScreenProps {
  goal: Goal;
  recommendation: Recommendation;
  onSkip: () => void;
}

export function RecommendationScreen({ goal, recommendation, onSkip }: RecommendationScreenProps) {
  const t = useTranslations('recommendations');
  const router = useRouter();

  const monthsUntil = (goal.targetDate.getFullYear() - new Date().getFullYear()) * 12
    + (goal.targetDate.getMonth() - new Date().getMonth());

  useEffect(() => {
    trackRecommendationEvent({
      type: 'recommendation_shown',
      placement: 'post_goal',
      products: recommendation.products.map(p => p.id),
      primaryProduct: recommendation.primaryProduct.id,
      goalBucket: goal.bucket,
    });
  }, [recommendation, goal.bucket]);

  const handleSkip = () => {
    trackRecommendationEvent({
      type: 'recommendation_skipped',
      placement: 'post_goal',
    });
    onSkip();
  };

  const currencySymbol = getCurrencySymbol(goal.currency);
  const primaryInterest = estimateInterest(
    goal.amount,
    recommendation.primaryProduct.apy,
    monthsUntil,
  );
  const alternatives = recommendation.products.slice(1);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Success header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
          <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-foreground">
          {t('goalCreated', { title: goal.title })}
        </h2>
        <p className="mt-1 text-muted-foreground">
          {formatCurrency(goal.amount, goal.currency)}
        </p>
      </div>

      {/* Suggestion header */}
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        {t('whereToSave')}
      </h3>

      {/* Primary recommendation */}
      <ProductCard
        product={recommendation.primaryProduct}
        context={{ placement: 'post_goal', position: 'primary', goalBucket: goal.bucket }}
        isPrimary
        interestEstimate={primaryInterest}
        currency={currencySymbol}
      />

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-muted-foreground">{t('otherOptions')}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {alternatives.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                context={{
                  placement: 'post_goal',
                  position: i === 0 ? 'alternative_1' : 'alternative_2',
                  goalBucket: goal.bucket,
                }}
                interestEstimate={estimateInterest(goal.amount, product.apy, monthsUntil)}
                currency={currencySymbol}
              />
            ))}
          </div>
        </div>
      )}

      {/* TODO: re-enable when affiliate program is live */}
      {/* <AffiliateDisclosure variant="inline" className="mt-4" /> */}

      {/* Actions */}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={handleSkip}>
          {t('skipForNow')}
        </Button>
        <Button onClick={() => router.push('/dashboard')}>
          {t('goToDashboard')}
        </Button>
      </div>
    </div>
  );
}
