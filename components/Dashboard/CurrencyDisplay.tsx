'use client';

import { useExchangeRates } from '@/hooks/useExchangeRates';
import { formatCurrency, type Currency } from '@/types';
import { useLocale } from 'next-intl';

interface CurrencyDisplayProps {
  amount: number;
  currency: string;
  displayCurrency: string;
}

export function CurrencyDisplay({ amount, currency, displayCurrency }: CurrencyDisplayProps) {
  const { convert, isLoading } = useExchangeRates();
  const locale = useLocale();

  if (currency === displayCurrency) {
    return null;
  }

  if (isLoading) {
    return (
      <span className="text-sm text-muted-foreground">...</span>
    );
  }

  const converted = convert(amount, currency, displayCurrency);

  if (converted == null) {
    return null;
  }

  return (
    <span className="text-sm text-muted-foreground">
      ≈ {formatCurrency(converted, displayCurrency as Currency, locale)}
    </span>
  );
}
