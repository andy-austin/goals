'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { InvestmentInstrument } from '@/lib/education/types';

interface InstrumentCardProps {
  instrument: InvestmentInstrument;
}

const riskBadgeVariant: Record<string, 'success' | 'warning' | 'error'> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
};

export function InstrumentCard({ instrument }: InstrumentCardProps) {
  const t = useTranslations('education');
  const [expanded, setExpanded] = useState(false);

  const variant = riskBadgeVariant[instrument.riskLevel];

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-foreground">
            {t(instrument.nameKey)}
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {t(instrument.descriptionKey)}
          </p>
        </div>
        <Badge variant={variant} size="sm">
          {t(`riskLevel.${instrument.riskLevel}`)}
        </Badge>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {t('typicalReturn')}:
        </span>
        <span className="text-xs font-semibold text-foreground">
          {instrument.typicalReturn}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'mt-3 text-xs font-medium text-primary hover:text-primary/80 transition-colors'
        )}
        aria-expanded={expanded}
      >
        {expanded ? t('showLess') : t('learnMore')}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 border-t border-border pt-3">
          <div>
            <h5 className="text-xs font-semibold text-success mb-1">
              {t('pros')}
            </h5>
            <ul className="space-y-1">
              {instrument.prosKeys.map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground"
                >
                  <svg
                    className="mt-0.5 h-3 w-3 shrink-0 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-error mb-1">
              {t('cons')}
            </h5>
            <ul className="space-y-1">
              {instrument.consKeys.map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground"
                >
                  <svg
                    className="mt-0.5 h-3 w-3 shrink-0 text-error"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
