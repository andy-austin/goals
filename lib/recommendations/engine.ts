import type { Goal } from '@/types';
import type { Recommendation, FinancialProduct } from './types';
import { PRODUCT_CATALOG } from './products';

function monthsUntil(date: Date): number {
  const now = new Date();
  return (date.getFullYear() - now.getFullYear()) * 12 + (date.getMonth() - now.getMonth());
}

function generateReasonKey(product: FinancialProduct): string {
  if (product.type === 'savings' || product.type === 'money_market' || product.type === 'cd') {
    return 'reasonSafety';
  }
  if (product.type === 'robo') {
    return 'reasonGrowth';
  }
  return 'reasonDream';
}

export function getRecommendations(goal: Goal): Recommendation | null {
  // 1. Filter products by bucket
  const bucketProducts = PRODUCT_CATALOG.filter(p => p.bestFor.includes(goal.bucket));

  // 2. Filter by time horizon
  const timelineMonths = monthsUntil(goal.targetDate);
  const timelineFiltered = bucketProducts.filter(p =>
    (!p.minTimeHorizonMonths || timelineMonths >= p.minTimeHorizonMonths) &&
    (!p.maxTimeHorizonMonths || timelineMonths <= p.maxTimeHorizonMonths)
  );

  // Fall back to bucket-only matches if timeline is too restrictive
  const candidates = timelineFiltered.length > 0 ? timelineFiltered : bucketProducts;

  if (candidates.length === 0) return null;

  // 3. Sort by estimated payout (proxy for relevance)
  const sorted = [...candidates].sort((a, b) => b.estimatedPayout - a.estimatedPayout);

  // 4. Return top 3
  const top = sorted.slice(0, 3);

  return {
    goalId: goal.id,
    products: top,
    primaryProduct: top[0],
    reasonKey: generateReasonKey(top[0]),
  };
}

export function estimateInterest(amount: number, apyStr: string | undefined, months: number): number {
  if (!apyStr) return 0;
  const apy = parseFloat(apyStr) / 100;
  if (isNaN(apy) || apy <= 0) return 0;
  const years = months / 12;
  return Math.round(amount * apy * years);
}
