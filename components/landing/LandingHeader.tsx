'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('landing.header');
  const tCommon = useTranslations('common');

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-growth flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-growth-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">{tCommon('logo')}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#methodology" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('methodology')}
            </a>
            <a href="#calculator" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('calculator')}
            </a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t('features')}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center justify-center h-9 px-3 text-sm font-medium rounded-md hover:bg-muted transition-colors"
            >
              {t('dashboard')}
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-lg bg-gradient-growth text-growth-foreground shadow-lg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {t('getStarted')}
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border/50 py-4">
            <div className="flex flex-col space-y-2">
              <a
                href="#methodology"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {t('methodology')}
              </a>
              <a
                href="#calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {t('calculator')}
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {t('features')}
              </a>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {t('dashboard')}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
