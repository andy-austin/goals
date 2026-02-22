'use client';

/**
 * VisibilityToggle — lets users set a goal as private or shared
 * within a shared space (Issue #65)
 */

import { useTranslations } from 'next-intl';
import type { GoalVisibility } from '@/types';

interface VisibilityToggleProps {
  value: GoalVisibility;
  onChange: (visibility: GoalVisibility) => void;
  disabled?: boolean;
}

const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export function VisibilityToggle({ value, onChange, disabled = false }: VisibilityToggleProps) {
  const t = useTranslations('spaces');

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('private')}
        className={[
          'flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          value === 'private'
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-foreground border-border hover:bg-secondary',
        ].join(' ')}
      >
        <LockIcon />
        {t('private')}
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('shared')}
        className={[
          'flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          value === 'shared'
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-foreground border-border hover:bg-secondary',
        ].join(' ')}
      >
        <UsersIcon />
        {t('shared')}
      </button>
    </div>
  );
}
