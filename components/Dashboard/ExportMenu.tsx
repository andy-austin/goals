'use client';

import { useTranslations } from 'next-intl';
import type { Goal } from '@/types';

interface ExportMenuProps {
  goals: Goal[];
}

export function ExportMenu({ goals }: ExportMenuProps) {
  const t = useTranslations('export');

  const handlePrint = () => {
    window.print();
  };

  if (goals.length === 0) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer"
      aria-label={t('print')}
      title={t('print')}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
    </button>
  );
}
