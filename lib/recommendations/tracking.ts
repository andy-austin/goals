import type { FinancialProduct, TrackingContext } from './types';

export function buildAffiliateUrl(
  product: FinancialProduct,
  context: TrackingContext
): string {
  const baseUrl = product.affiliateUrl;
  const params = new URLSearchParams({
    utm_source: 'fingoal',
    utm_medium: 'affiliate',
    utm_campaign: `${context.goalBucket ?? 'general'}_bucket`,
    utm_content: `${context.placement}_${context.position}`,
  });

  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${params}`;
}

export type RecommendationEvent =
  | { type: 'recommendation_shown'; placement: string; products: string[]; primaryProduct: string; goalBucket: string }
  | { type: 'recommendation_clicked'; productId: string; productName: string; provider: string; position: string; placement: string }
  | { type: 'recommendation_skipped'; placement: string }
  | { type: 'recommendation_dismissed'; placement: string };

export function trackRecommendationEvent(event: RecommendationEvent): void {
  // Use Vercel Analytics track() if available
  if (typeof window !== 'undefined' && 'va' in window) {
    try {
      const { type, ...data } = event;
      (window as unknown as Record<string, CallableFunction>).va?.('event', { name: type, data });
    } catch {
      // Silently fail — analytics are non-critical
    }
  }
}
