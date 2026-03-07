'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { FinancialProduct, TrackingContext } from '@/lib/recommendations/types';
import { buildAffiliateUrl, trackRecommendationEvent } from '@/lib/recommendations/tracking';

interface ProductCardProps {
  product: FinancialProduct;
  context: TrackingContext;
  isPrimary?: boolean;
  interestEstimate?: number;
  currency?: string;
  className?: string;
}

export function ProductCard({
  product,
  context,
  isPrimary = false,
  interestEstimate,
  currency,
  className,
}: ProductCardProps) {
  const t = useTranslations('recommendations');

  const handleClick = () => {
    trackRecommendationEvent({
      type: 'recommendation_clicked',
      productId: product.id,
      productName: product.name,
      provider: product.provider,
      position: context.position,
      placement: context.placement,
    });
  };

  const url = buildAffiliateUrl(product, context);

  return (
    <div className={cn(
      'rounded-lg border p-4 transition-shadow hover:shadow-md',
      isPrimary
        ? 'border-primary bg-primary/5 shadow-sm'
        : 'border-border bg-background',
      className,
    )}>
      {isPrimary && (
        <span className="mb-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {t('recommended')}
        </span>
      )}

      <h4 className="font-semibold text-foreground">{product.name}</h4>
      <p className="mt-0.5 text-sm text-muted-foreground">{product.provider}</p>

      {/* Features row */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {product.apy && (
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
            {product.apy} APY
          </span>
        )}
        {product.features.slice(0, 3).map(f => (
          <span key={f} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {t(`features.${f}`)}
          </span>
        ))}
      </div>

      {/* Interest estimate */}
      {interestEstimate != null && interestEstimate > 0 && currency && (
        <p className="mt-2 text-sm text-success">
          {t('earnEstimate', { amount: `${currency} ${interestEstimate.toLocaleString()}` })}
        </p>
      )}

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className="mt-3 block"
      >
        <Button
          size={isPrimary ? 'md' : 'sm'}
          variant={isPrimary ? 'primary' : 'secondary'}
          className="w-full"
        >
          {t('openAccount')}
        </Button>
      </a>
    </div>
  );
}
