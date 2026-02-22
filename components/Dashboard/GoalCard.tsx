'use client';

import { forwardRef, type HTMLAttributes, type ReactNode, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Goal, formatCurrency, formatDate } from '@/types';
import { useGoals } from '@/context';
import { useToast, ConfirmationModal } from '@/components/ui';
import { EditGoalModal } from './EditGoalModal';
import { ShareGoalModal } from './ShareGoalModal';

interface GoalCardProps extends HTMLAttributes<HTMLDivElement> {
  goal: Goal;
  dragHandle?: ReactNode;
  isDragging?: boolean;
}

export const GoalCard = forwardRef<HTMLDivElement, GoalCardProps>(
  function GoalCard({ goal, dragHandle, isDragging = false, className = '', style, ...props }, ref) {
    const t = useTranslations('dashboard');
    const locale = useLocale();
    const { deleteGoal } = useGoals();
    const { showToast } = useToast();
    const commonT = useTranslations('common');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Calculate days remaining (simple version, could move to helper)
    const today = new Date();
    const target = new Date(goal.targetDate);
    const diffTime = target.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isOverdue = daysRemaining < 0;

    const handleDeleteClick = () => {
      setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
      deleteGoal(goal.id);
      showToast(`${commonT('delete')} ${goal.title}`, 'success');
      setIsDeleteModalOpen(false);
    };

    return (
      <>
        <div
          ref={ref}
          className={`group relative rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900 ${
            isDragging ? 'shadow-lg ring-2 ring-primary/50 opacity-90' : 'hover:shadow-md'
          } ${className}`}
          style={style}
          {...props}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {/* Drag Handle */}
              {dragHandle}
              <div className="space-y-1">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {goal.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {formatCurrency(goal.amount, goal.currency, locale)}
                </p>
              </div>
            </div>

            {/* Priority Badge and Actions */}
            <div className="flex items-center gap-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 mr-1">
                #{goal.priority}
              </span>

              {/* Share button */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="rounded p-1 text-zinc-400 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors cursor-pointer"
                aria-label={commonT('share')}
                title={commonT('share')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
              </button>

              {/* Edit button */}
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                aria-label={commonT('edit')}
                title={commonT('edit')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>

              {/* Delete button */}
              <button
                type="button"
                onClick={handleDeleteClick}
                className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors cursor-pointer"
                aria-label={commonT('delete')}
                title={commonT('delete')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-xs">
              <span className={`${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-zinc-500'}`}>
                {isOverdue
                  ? t('overdueBy', { count: Math.abs(daysRemaining) })
                  : t('daysLeft', { count: daysRemaining })}
              </span>
              {goal.visibility === 'shared' && (
                <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Shared
                </span>
              )}
            </div>
            <div className="text-xs text-zinc-400">
              {formatDate(goal.targetDate, locale)}
            </div>
          </div>
        </div>

        {/* Modals */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title={commonT('confirmDeleteTitle')}
          message={commonT('confirmDeleteMessage')}
          confirmLabel={commonT('delete')}
          cancelLabel={commonT('cancel')}
          variant="destructive"
        />

        <EditGoalModal
          goal={goal}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />

        <ShareGoalModal
          goal={goal}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      </>
    );
  }
);
