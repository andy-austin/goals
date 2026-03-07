'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const t = useTranslations('common');
  const tAuth = useTranslations('auth');

  return (
    <div className="flex min-h-dvh">
      {/* Branding panel — hidden on mobile, always dark navy regardless of color scheme */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(to bottom right, hsl(222 47% 18%), hsl(222 47% 12%))' }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <Link href="/" className="text-2xl font-bold text-white mb-8">
            {t('logo')}
          </Link>

          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
            {tAuth('brandingTitle')}
          </h2>
          <p className="text-lg text-white/80 leading-relaxed mb-10">
            {tAuth('brandingDescription')}
          </p>

          <div className="space-y-4">
            {(['brandingFeature1', 'brandingFeature2', 'brandingFeature3'] as const).map((key) => (
              <div key={key} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-white/90 text-sm font-medium">{tAuth(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full lg:w-1/2 flex-col">
        {/* Header */}
        <header role="banner" className="flex items-center justify-between p-4 lg:p-6">
          <Link href="/" className="text-lg font-bold text-foreground">
            {t('logo')}
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pb-8">
          <div className="w-full max-w-sm space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
