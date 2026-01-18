'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { locales, type Locale } from '@/i18n';
import { setLocale } from '@/app/actions/locale';
import { Tooltip } from '@/components/ui';

const FLAGS: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
};

export function LanguageSwitcher() {
  const t = useTranslations('language');
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale || isPending) return;
    
    startTransition(() => {
      setLocale(newLocale);
    });
  };

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t('select')}>
      {locales.map((locale) => {
        const isActive = currentLocale === locale;
        return (
          <Tooltip key={locale} content={t(locale)} side="bottom">
            <button
              onClick={() => handleLocaleChange(locale)}
              disabled={isPending}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-xl transition-all hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-zinc-800 ${
                isActive 
                  ? 'bg-zinc-100 ring-1 ring-zinc-300 dark:bg-zinc-800 dark:ring-zinc-700' 
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <span className="leading-none">{FLAGS[locale]}</span>
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
