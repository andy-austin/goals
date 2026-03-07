'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { STRATEGIES_CATALOG } from '@/lib/strategies';
import { StrategyCard } from './StrategyCard';

const DISMISSED_KEY = 'fingoal_strategies_dismissed';

export function StrategiesPanel() {
  const t = useTranslations('strategies');
  const [dismissed, setDismissed] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(DISMISSED_KEY);
    setDismissed(stored === 'true');
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setDismissed(true);
  };

  if (dismissed) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center gap-2 text-left',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded'
          )}
          aria-expanded={!collapsed}
        >
          <svg
            className={cn(
              'w-4 h-4 text-muted-foreground transition-transform',
              collapsed && '-rotate-90'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <h2 className="text-base font-semibold text-foreground">
            {t('panelTitle')}
          </h2>
        </button>

        <button
          onClick={handleDismiss}
          className={cn(
            'text-xs text-muted-foreground hover:text-foreground transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'rounded px-2 py-1'
          )}
          aria-label={t('dismiss')}
        >
          {t('dismiss')}
        </button>
      </div>

      {!collapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {STRATEGIES_CATALOG.map((strategy) => (
            <StrategyCard key={strategy.id} strategy={strategy} />
          ))}
        </div>
      )}
    </section>
  );
}
