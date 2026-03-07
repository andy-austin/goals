'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { SavingsStrategy } from '@/lib/strategies';

interface StrategyCardProps {
  strategy: SavingsStrategy;
}

export function StrategyCard({ strategy }: StrategyCardProps) {
  const t = useTranslations('strategies');
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-background shadow-sm transition-all',
        expanded && 'ring-1 ring-primary/20'
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none" role="img" aria-hidden="true">
            {strategy.icon}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              {t(strategy.titleKey)}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              {t(strategy.subtitleKey)}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {t(strategy.bestForKey)}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              'text-xs font-medium transition-colors',
              'text-primary hover:text-primary-hover',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'rounded px-2 py-1'
            )}
            aria-expanded={expanded}
          >
            {expanded ? t('hideGuide') : t('readGuide')}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border px-4 py-3">
          <ol className="space-y-3">
            {strategy.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {t(step.titleKey)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    {t(step.descriptionKey)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
