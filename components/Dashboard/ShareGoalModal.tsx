'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Goal, GoalVisibility } from '@/types';
import { useGoals } from '@/context';
import { useAuth } from '@/context';
import { useSpaces } from '@/context';
import { useToast, Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Select, Label } from '@/components/ui';

interface ShareGoalModalProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareGoalModal({ goal, isOpen, onClose }: ShareGoalModalProps) {
  const t = useTranslations('dashboard.shareModal');
  const tCommon = useTranslations('common');
  const tSpaces = useTranslations('spaces');
  const { updateGoal } = useGoals();
  const { user } = useAuth();
  const { spaces } = useSpaces();
  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);

  const [visibility, setVisibility] = useState<GoalVisibility>(() => {
    // Default to 'shared' when opening the modal (the user opened it to share)
    return goal.visibility === 'shared' ? 'shared' : 'shared';
  });
  const [spaceId, setSpaceId] = useState<string | null>(() => {
    if (goal.spaceId) return goal.spaceId;
    return spaces.length > 0 ? spaces[0].id : null;
  });
  const [isSaving, setIsSaving] = useState(false);

  // Reset when goal changes
  useEffect(() => {
    const defaultShared = 'shared' as GoalVisibility;
    setVisibility(goal.visibility === 'shared' ? 'shared' : defaultShared);
    setSpaceId(goal.spaceId ?? (spaces.length > 0 ? spaces[0].id : null));
  }, [goal, spaces]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  function handleVisibilityChange(v: GoalVisibility) {
    setVisibility(v);
    if (v === 'private') {
      setSpaceId(null);
    } else if (v === 'shared' && spaceId === null && spaces.length > 0) {
      setSpaceId(spaces[0].id);
    }
  }

  const isValid =
    visibility === 'private' ||
    (visibility === 'shared' && (spaceId !== null || spaces.length === 0));

  const handleSave = () => {
    if (!isValid) return;
    setIsSaving(true);

    updateGoal(goal.id, { visibility, spaceId });

    showToast(
      visibility === 'shared' ? t('sharedToast') : t('madePrivateToast'),
      'success'
    );
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="share-goal-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md animate-in zoom-in-95 duration-200"
      >
        <Card className="border-border shadow-lg">
          {/* Header */}
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle id="share-goal-modal-title">{t('title')}</CardTitle>
              <button
                type="button"
                onClick={onClose}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
                aria-label={tCommon('cancel')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Goal name */}
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t('subtitle', { title: goal.title })}
            </p>

            {/* Auth gate */}
            {!user ? (
              <div className="rounded-lg border border-border bg-zinc-50 dark:bg-zinc-900 p-4 flex items-start gap-3">
                <LockIcon className="w-5 h-5 text-zinc-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {tSpaces('signInRequired')}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {tSpaces('signInDescription')}
                  </p>
                  <a
                    href="/auth/login"
                    className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    {tSpaces('signIn')} →
                  </a>
                </div>
              </div>
            ) : (
              <>
                {/* Clickable visibility cards */}
                <div>
                  <Label>{t('visibilityLabel')}</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => handleVisibilityChange('private')}
                      className={`rounded-lg border p-3 text-left transition-colors cursor-pointer ${visibility === 'private' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:border-zinc-300 dark:hover:border-zinc-600'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <LockIcon className="w-4 h-4 text-zinc-500" />
                        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{tSpaces('private')}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('privateDesc')}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVisibilityChange('shared')}
                      className={`rounded-lg border p-3 text-left transition-colors cursor-pointer ${visibility === 'shared' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-background hover:border-zinc-300 dark:hover:border-zinc-600'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <UsersIcon className="w-4 h-4 text-zinc-500" />
                        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{tSpaces('shared')}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{t('sharedDesc')}</p>
                    </button>
                  </div>
                </div>

                {/* Space selector (always visible, disabled when private) */}
                <div>
                  {spaces.length === 0 ? (
                    <div className={`rounded-lg border border-dashed border-border bg-zinc-50 dark:bg-zinc-900/50 p-4 text-center transition-opacity ${visibility === 'private' ? 'opacity-40 pointer-events-none' : ''}`}>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                        {t('noSpaces')}
                      </p>
                      <a
                        href="/spaces"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {t('createSpaceLink')}
                      </a>
                    </div>
                  ) : (
                    <div className={`space-y-1.5 transition-opacity ${visibility === 'private' ? 'opacity-40 pointer-events-none' : ''}`}>
                      <Label htmlFor="share-space-select">{t('spaceLabel')}</Label>
                      <Select
                        id="share-space-select"
                        value={spaceId ?? ''}
                        onChange={(e) => setSpaceId(e.target.value || null)}
                        disabled={visibility === 'private'}
                      >
                        <option value="">{t('selectSpace')}</option>
                        {spaces.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </Select>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose} disabled={isSaving}>
              {tCommon('cancel')}
            </Button>
            {user && (
              <Button onClick={handleSave} disabled={!isValid || isSaving}>
                {isSaving ? tCommon('saving') : tCommon('save')}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>,
    document.body
  );
}

// =============================================================================
// Icon helpers
// =============================================================================

function LockIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function UsersIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
