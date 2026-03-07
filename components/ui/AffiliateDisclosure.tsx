'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AffiliateDisclosureProps {
  variant: 'inline' | 'banner';
  className?: string;
}

export function AffiliateDisclosure({ variant, className }: AffiliateDisclosureProps) {
  const t = useTranslations('disclosure');

  if (variant === 'inline') {
    return (
      <p className={cn('text-xs text-muted-foreground', className)}>
        <span className="mr-1">ℹ️</span>
        {t('inline')}{' '}
        <Link href="/disclosure" className="underline hover:text-foreground">
          {t('learnMore')}
        </Link>
      </p>
    );
  }

  return (
    <div className={cn(
      'rounded-lg border border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground',
      className,
    )}>
      <span className="mr-1">ℹ️</span>
      {t('banner')}{' '}
      <Link href="/disclosure" className="underline hover:text-foreground">
        {t('learnMore')}
      </Link>
    </div>
  );
}
