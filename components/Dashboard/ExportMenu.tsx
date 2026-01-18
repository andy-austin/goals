'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useToast } from '@/components/ui';
import { formatGoalsAsText, copyToClipboard, generateGoalsPDF } from '@/lib';
import type { Goal } from '@/types';

interface ExportMenuProps {
  goals: Goal[];
}

export function ExportMenu({ goals }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('export');
  const locale = useLocale();
  const { showToast } = useToast();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close menu on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleCopy = useCallback(async () => {
    const text = formatGoalsAsText(goals, locale);
    const success = await copyToClipboard(text);
    if (success) {
      showToast(t('copySuccess'), 'success');
    } else {
      showToast(t('copyError'), 'error');
    }
    setIsOpen(false);
  }, [goals, locale, showToast, t]);

  const handlePdfExport = useCallback(() => {
    try {
      generateGoalsPDF(goals, locale);
      showToast(t('pdfSuccess'), 'success');
    } catch {
      showToast(t('pdfError'), 'error');
    }
    setIsOpen(false);
  }, [goals, locale, showToast, t]);

  const handlePrint = useCallback(() => {
    setIsOpen(false);
    // Small delay to allow menu to close before print dialog
    setTimeout(() => window.print(), 100);
  }, []);

  const menuItems = [
    {
      label: t('pdfExport'),
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      onClick: handlePdfExport,
    },
    {
      label: t('print'),
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      ),
      onClick: handlePrint,
    },
    {
      label: t('copyToClipboard'),
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      onClick: handleCopy,
    },
  ];

  // Handle keyboard navigation within menu
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const items = menuRef.current?.querySelectorAll('[role="menuitem"]');
    if (!items) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        (items[(index + 1) % items.length] as HTMLElement).focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        (items[(index - 1 + items.length) % items.length] as HTMLElement).focus();
        break;
      case 'Home':
        event.preventDefault();
        (items[0] as HTMLElement).focus();
        break;
      case 'End':
        event.preventDefault();
        (items[items.length - 1] as HTMLElement).focus();
        break;
    }
  };

  if (goals.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary-hover transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {t('export')}
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1 w-48 origin-top-right rounded-md bg-background border border-border shadow-lg z-50"
        >
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                role="menuitem"
                onClick={item.onClick}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
