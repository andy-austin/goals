'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { TrendingUp, LogOut, Clock, Users } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const { user, loading, signOut } = useAuth();

  const displayName: string =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split('@')[0] ??
    '';
  const avatarUrl: string | null =
    user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null;
  const initials = displayName
    ? displayName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : (user?.email?.[0] ?? '?').toUpperCase();

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { href: '/dashboard', label: t('dashboard') },
    { href: '/create', label: t('createGoal') },
  ];

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    window.location.href = '/';
  };

  return (
    <header className="print:hidden sticky top-0 z-50 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo/Title */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-growth flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-growth-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            {tCommon('logo')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex sm:items-center sm:gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="ml-2 border-l border-zinc-200 pl-2 dark:border-zinc-700">
            <LanguageSwitcher />
          </div>
          {/* Auth UI */}
          <div className="ml-2 border-l border-zinc-200 pl-2 dark:border-zinc-700">
            {!loading && (
              user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
                  >
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 overflow-hidden">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">{initials}</span>
                      )}
                    </div>
                    <span className="max-w-[120px] truncate">{displayName}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-1 w-64 rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 overflow-hidden">
                            {avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{initials}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            {user.user_metadata?.full_name && (
                              <p className="truncate text-sm font-semibold text-foreground">{user.user_metadata.full_name}</p>
                            )}
                            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/timeline"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        >
                          <Clock className="h-4 w-4" />
                          {t('timeline')}
                        </Link>
                        <Link
                          href="/spaces"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                        >
                          <Users className="h-4 w-4" />
                          {t('spaces')}
                        </Link>
                      </div>
                      <div className="border-t border-zinc-200 dark:border-zinc-700">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50 cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-800"
                        >
                          <LogOut className="h-4 w-4" />
                          {tAuth('signOut')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  {tAuth('login')}
                </Link>
              )
            )}
          </div>
        </nav>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 sm:hidden">
          <LanguageSwitcher />

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="border-t border-zinc-200 px-4 py-2 sm:hidden dark:border-zinc-800">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {/* Mobile Auth */}
          <div className="mt-2 border-t border-zinc-200 pt-2 dark:border-zinc-700">
            {!loading && (
              user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 overflow-hidden">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{initials}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      {user.user_metadata?.full_name && (
                        <p className="truncate text-sm font-semibold text-foreground">{user.user_metadata.full_name}</p>
                      )}
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/timeline"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                  >
                    <Clock className="h-4 w-4" />
                    {t('timeline')}
                  </Link>
                  <Link
                    href="/spaces"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                  >
                    <Users className="h-4 w-4" />
                    {t('spaces')}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-50 cursor-pointer dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                  >
                    <LogOut className="h-4 w-4" />
                    {tAuth('signOut')}
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-blue-600 hover:bg-zinc-50 dark:text-blue-400 dark:hover:bg-zinc-800/50"
                >
                  {tAuth('login')}
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
