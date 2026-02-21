'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { getConsent, saveConsent, buildConsentRecord } from '@/lib/consent';

export function ConsentBanner() {
  const t = useTranslations('consent.banner');
  // null = not yet determined (SSR safe), true = shown, false = hidden
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const existing = getConsent();
    setVisible(existing === null);
  }, []);

  function handleAccept() {
    saveConsent(buildConsentRecord(true));
    setVisible(false);
    // Reload so ConditionalAnalytics picks up the new consent
    window.location.reload();
  }

  function handleDecline() {
    saveConsent(buildConsentRecord(false));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t('title')}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 print:hidden"
    >
      <div
        className="max-w-3xl mx-auto rounded-xl border border-[var(--border,#e5e7eb)] bg-[var(--card,#ffffff)] shadow-[var(--shadow-xl)] p-5"
        style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold mb-1">{t('title')}</p>
            <p className="text-sm opacity-70 leading-snug">
              {t('description')}{' '}
              <Link href="/privacy" className="underline hover:opacity-100 opacity-80 transition-opacity">
                {t('privacyPolicy')}
              </Link>{' '}
              &amp;{' '}
              <Link href="/terms" className="underline hover:opacity-100 opacity-80 transition-opacity">
                {t('terms')}
              </Link>
              .
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" size="sm" onClick={handleDecline}>
              {t('decline')}
            </Button>
            <Button variant="primary" size="sm" onClick={handleAccept}>
              {t('acceptAll')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
