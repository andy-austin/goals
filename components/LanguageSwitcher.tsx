'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { locales, localeNames, type Locale } from '@/i18n';
import { setLocale } from '@/app/actions/locale';

export function LanguageSwitcher() {
  const t = useTranslations('language');
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as Locale;
    startTransition(() => {
      setLocale(newLocale);
    });
  };

  return (
    <div className="relative">
      <select
        value={currentLocale}
        onChange={handleChange}
        disabled={isPending}
        className="appearance-none rounded-md border border-zinc-300 bg-white px-3 py-1.5 pr-8 text-sm text-zinc-700 transition-colors hover:border-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600"
        aria-label={t('select')}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeNames[locale]}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg
          className="h-4 w-4 text-zinc-500 dark:text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
          />
        </svg>
      </div>
    </div>
  );
}
