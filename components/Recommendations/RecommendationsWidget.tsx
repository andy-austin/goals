'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { Goal } from '@/types';
import { getCurrencySymbol } from '@/types';
import { getRecommendations, estimateInterest } from '@/lib/recommendations/engine';
import { buildAffiliateUrl, trackRecommendationEvent } from '@/lib/recommendations/tracking';
import type { Recommendation } from '@/lib/recommendations/types';
import { Button } from '@/components/ui/Button';
import { AffiliateDisclosure } from '@/components/ui/AffiliateDisclosure';
import { cn } from '@/lib/utils';

const DISMISS_KEY = 'fingoal_recommendations_dismissed';

interface RecommendationsWidgetProps {
  goals: Goal[];
}

export function RecommendationsWidget({ goals }: RecommendationsWidgetProps) {
  const t = useTranslations('recommendations');
  const [dismissed, setDismissed] = useState(true); // default hidden until checked

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === 'true');
  }, []);

  if (dismissed || goals.length === 0) return null;

  // Get primary recommendation per goal (up to 3)
  const goalRecs: { goal: Goal; rec: Recommendation }[] = [];
  for (const goal of goals.slice(0, 3)) {
    const rec = getRecommendations(goal);
    if (rec) goalRecs.push({ goal, rec });
  }

  if (goalRecs.length === 0) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, 'true');
    trackRecommendationEvent({ type: 'recommendation_dismissed', placement: 'dashboard' });
  };

  return (
    <div className="mb-6 rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">{t('widgetTitle')}</h3>
          <p className="text-sm text-muted-foreground">{t('widgetSubtitle')}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground p-1"
          aria-label={t('hide')}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {goalRecs.map(({ goal, rec }) => {
          const product = rec.primaryProduct;
          const months = (goal.targetDate.getFullYear() - new Date().getFullYear()) * 12
            + (goal.targetDate.getMonth() - new Date().getMonth());
          const interest = estimateInterest(goal.amount, product.apy, months);
          const currencySymbol = getCurrencySymbol(goal.currency);
          const url = buildAffiliateUrl(product, {
            placement: 'dashboard',
            position: 'primary',
            goalBucket: goal.bucket,
          });

          const bucketColor = goal.bucket === 'safety'
            ? 'text-bucket-safety'
            : goal.bucket === 'growth'
              ? 'text-bucket-growth'
              : 'text-bucket-dream';

          return (
            <div
              key={goal.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className={cn('text-sm font-medium truncate', bucketColor)}>
                  {goal.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  → {product.name}
                  {product.apy && ` (${product.apy} APY)`}
                  {interest > 0 && ` · ${t('earnEstimate', { amount: `${currencySymbol} ${interest.toLocaleString()}` })}`}
                </p>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() => {
                  trackRecommendationEvent({
                    type: 'recommendation_clicked',
                    productId: product.id,
                    productName: product.name,
                    provider: product.provider,
                    position: 'primary',
                    placement: 'dashboard',
                  });
                }}
              >
                <Button size="sm" variant="secondary" className="whitespace-nowrap">
                  {t('openAccount')}
                </Button>
              </a>
            </div>
          );
        })}
      </div>

      <AffiliateDisclosure variant="inline" className="mt-3" />
    </div>
  );
}
