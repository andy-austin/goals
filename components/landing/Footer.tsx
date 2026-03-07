'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('landing.footer');
  const tHeader = useTranslations('landing.header');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const pathname = usePathname();

  const isLanding = pathname === '/';

  const navLinks = isLanding
    ? [
        { href: '/dashboard', label: tHeader('dashboard') },
        { href: '#methodology', label: tHeader('methodology') },
        { href: '#calculator', label: tHeader('calculator') },
        { href: '#features', label: tHeader('features') },
      ]
    : [
        { href: '/dashboard', label: tNav('dashboard') },
        { href: '/create', label: tNav('createGoal') },
        { href: '/timeline', label: tNav('timeline') },
      ];

  const legalLinks = [
    { href: '/privacy', label: t('privacy') },
    { href: '/terms', label: t('terms') },
    { href: '/disclosure', label: t('disclosure') },
  ];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top: Logo + Link Columns */}
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 text-foreground">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">{tCommon('logo')}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              {t('tagline')}
            </p>
          </div>

          {/* Link Columns */}
          <div className="flex gap-16 sm:gap-20">
            {/* Product */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('product')}
              </h3>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('legal')}
              </h3>
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {t('rights', { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}
