'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { locales, type Locale } from '@/i18n';
import { setLocale } from '@/app/actions/locale';

const FLAGS: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
};

const NATIVE_NAMES: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
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
          <button
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            disabled={isPending}
            aria-label={t(locale)}
            aria-pressed={isActive}
            className={`flex items-center gap-1.5 cursor-pointer rounded-md px-2 py-1.5 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
              isActive
                ? 'text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-base leading-none">{FLAGS[locale]}</span>
            <span className="hidden sm:inline">{NATIVE_NAMES[locale]}</span>
          </button>
        );
      })}
    </div>
  );
}
