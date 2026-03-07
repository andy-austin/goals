'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { TrendingUp, LogOut, Clock, Users, LayoutDashboard, PlusCircle } from 'lucide-react';
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
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/create', label: t('createGoal'), icon: PlusCircle },
    ...(user ? [
      { href: '/timeline', label: t('timeline'), icon: Clock },
      { href: '/spaces', label: t('spaces'), icon: Users },
    ] : []),
  ];

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    window.location.href = '/';
  };

  return (
    <header className="print:hidden sticky top-0 z-50 border-b border-border bg-background">
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
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="ml-2 border-l border-border pl-2">
            <LanguageSwitcher />
          </div>
          {/* Auth UI */}
          <div className="ml-2 border-l border-border pl-2">
            {!loading && (
              user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground cursor-pointer"
                  >
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-semibold text-primary">{initials}</span>
                      )}
                    </div>
                    <span className="max-w-[120px] truncate">{displayName}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-1 w-64 rounded-md border border-border bg-card py-1 shadow-lg">
                      <div className="border-b border-border px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 overflow-hidden">
                            {avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-semibold text-primary">{initials}</span>
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
                      <div className="border-t border-border">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50 cursor-pointer"
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
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
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
            className="inline-flex items-center justify-center rounded-full cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            ) : !loading && user ? (
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 overflow-hidden ring-2 ring-offset-1 ring-primary/30">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-primary">{initials}</span>
                )}
              </div>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground rounded-md">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="border-t border-border px-4 py-2 sm:hidden">
          {/* User info at the top */}
          {!loading && user && (
            <div className="mb-2 flex items-center gap-3 px-3 py-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 overflow-hidden ring-2 ring-offset-1 ring-primary/30">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-base font-semibold text-primary">{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                {displayName && (
                  <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                )}
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          )}

          {/* Nav items */}
          <div className={`${!loading && user ? 'border-t border-border' : ''} pt-2 space-y-1`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Auth-specific items */}
            {!loading && (
              user ? (
                <>
                  <div className="border-t border-border pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted/50 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      {tAuth('signOut')}
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-base font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                  >
                    {tAuth('login')}
                  </Link>
                </div>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
