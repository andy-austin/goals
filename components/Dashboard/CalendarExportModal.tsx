'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations, useLocale } from 'next-intl';
import { Goal, formatCurrency } from '@/types';
import { generateICS, downloadICS } from '@/lib/calendar';
import { calculateMonthlySavings } from '@/lib/tracking';
import { useToast } from '@/components/ui';

interface CalendarExportModalProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
}

function CalendarExportForm({ goal, onClose }: Omit<CalendarExportModalProps, 'isOpen'>) {
  const t = useTranslations('dashboard.calendarModal');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const { showToast } = useToast();
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('monthly');

  const monthlySavings = calculateMonthlySavings(goal);

  const handleExport = () => {
    const ics = generateICS({
      frequency,
      goalTitle: goal.title,
      goalAmount: goal.amount,
      goalCurrency: goal.currency,
      targetDate: goal.targetDate,
      monthlySavings,
    });
    const safeName = goal.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    downloadICS(ics, `fingoal-${safeName}.ics`);
    showToast(t('exportedToast'), 'success');
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
    >
      <div className="w-full max-w-md mx-4 rounded-xl border border-border bg-card p-6 shadow-lg" role="dialog" aria-modal="true">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">{t('title')}</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted cursor-pointer" aria-label={commonT('close')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {t('subtitle', { title: goal.title })}
        </p>

        {monthlySavings !== null && monthlySavings > 0 && (
          <div className="mb-4 rounded-lg bg-muted p-3 text-sm">
            <span className="font-medium text-foreground">{t('monthlySavingsLabel')}: </span>
            <span className="text-foreground">{formatCurrency(monthlySavings, goal.currency, locale)}</span>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">{t('frequencyLabel')}</label>
          <div className="grid grid-cols-3 gap-2">
            {(['weekly', 'biweekly', 'monthly'] as const).map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => setFrequency(freq)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  frequency === freq
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:bg-muted'
                }`}
              >
                {t(`frequency.${freq}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            {commonT('cancel')}
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer"
          >
            {t('download')}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function CalendarExportModal({ goal, isOpen, onClose }: CalendarExportModalProps) {
  if (!isOpen) return null;
  return <CalendarExportForm goal={goal} onClose={onClose} />;
}
