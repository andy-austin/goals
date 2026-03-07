'use client';

import { forwardRef, type HTMLAttributes, type ReactNode, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Goal, formatCurrency, formatDate } from '@/types';
import { useGoals } from '@/context';
import { useToast, ConfirmationModal } from '@/components/ui';
import { Tooltip } from '@/components/ui/Tooltip';
import { computeFulfillment, calculateMonthlySavings } from '@/lib/tracking';
import { EditGoalModal } from './EditGoalModal';
import { ShareGoalModal } from './ShareGoalModal';
import { TrackingModal } from './TrackingModal';
import { CheckInModal } from './CheckInModal';
import { CalendarExportModal } from './CalendarExportModal';

interface GoalCardProps extends HTMLAttributes<HTMLDivElement> {
  goal: Goal;
  dragHandle?: ReactNode;
  isDragging?: boolean;
}

export const GoalCard = forwardRef<HTMLDivElement, GoalCardProps>(
  function GoalCard({ goal, dragHandle, isDragging = false, className = '', style, ...props }, ref) {
    const t = useTranslations('dashboard');
    const tSpaces = useTranslations('spaces');
    const tTracking = useTranslations('dashboard.trackingModal');
    const tCalendar = useTranslations('dashboard.calendarModal');
    const locale = useLocale();
    const { deleteGoal, completeGoal, restoreGoal } = useGoals();
    const { showToast } = useToast();
    const commonT = useTranslations('common');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

    const isCompleted = goal.status === 'completed';

    // Calculate days remaining
    const today = new Date();
    const target = new Date(goal.targetDate);
    const diffTime = target.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;

    // Fulfillment
    const fulfillment = computeFulfillment(goal);
    const fulfillmentPct = fulfillment?.fulfillmentPct ?? null;
    const isOnTrack = fulfillment?.isOnTrack ?? false;
    const latestAmount = fulfillment?.latestAmount ?? null;

    // Monthly savings needed (#52)
    const monthlySavings = calculateMonthlySavings(goal);

    // Time-based progress
    const created = new Date(goal.createdAt).getTime();
    const targetMs = target.getTime();
    const totalDuration = targetMs - created;
    const elapsed = today.getTime() - created;
    const timeProgressPct = totalDuration > 0
      ? Math.min(Math.max(Math.round((elapsed / totalDuration) * 100), 0), 100)
      : 100;

    const handleDeleteClick = () => setIsDeleteModalOpen(true);

    const confirmDelete = () => {
      deleteGoal(goal.id);
      showToast(`${commonT('delete')} ${goal.title}`, 'success');
      setIsDeleteModalOpen(false);
    };

    const handleComplete = () => {
      completeGoal(goal.id);
      showToast(t('completedToast', { title: goal.title }), 'success');
    };

    const handleRestore = () => {
      restoreGoal(goal.id);
      showToast(t('restoredToast', { title: goal.title }), 'success');
    };

    return (
      <>
        <div
          ref={ref}
          className={`group relative rounded-lg border border-border bg-card p-4 shadow-sm transition-all ${
            isCompleted ? 'opacity-75' : ''
          } ${isDragging ? 'shadow-lg ring-2 ring-primary/50 opacity-90' : 'hover:shadow-md'} ${className}`}
          style={style}
          {...props}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {dragHandle}
              <div className="space-y-1">
                <h3 className={`font-semibold text-foreground ${isCompleted ? 'line-through' : ''}`}>
                  {isCompleted && <span className="mr-1">&#10003;</span>}
                  {goal.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {latestAmount !== null ? (
                    <span>{formatCurrency(latestAmount, goal.currency, locale)} / {formatCurrency(goal.amount, goal.currency, locale)}</span>
                  ) : (
                    <span>{formatCurrency(goal.amount, goal.currency, locale)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Priority Badge and Actions */}
            <div className="flex items-center gap-0.5 flex-wrap justify-end">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground mr-1">
                #{goal.priority}
              </span>

              {!isCompleted && (
                <>
                  {/* Log Deposit button (#52) */}
                  <Tooltip content={t('logDeposit')} side="bottom">
                    <button
                      type="button"
                      onClick={() => setIsCheckInModalOpen(true)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded p-2 text-muted-foreground hover:bg-success/10 hover:text-success transition-colors cursor-pointer"
                      aria-label={t('logDeposit')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                  </Tooltip>

                  {/* Track button */}
                  <Tooltip content={tTracking('title')} side="bottom">
                    <button
                      type="button"
                      onClick={() => setIsTrackingModalOpen(true)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded p-2 text-muted-foreground hover:bg-success/10 hover:text-success transition-colors cursor-pointer"
                      aria-label={tTracking('title')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                      </svg>
                    </button>
                  </Tooltip>

                  {/* Calendar button (#55) */}
                  <Tooltip content={tCalendar('title')} side="bottom">
                    <button
                      type="button"
                      onClick={() => setIsCalendarModalOpen(true)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded p-2 text-muted-foreground hover:bg-warning/10 hover:text-warning transition-colors cursor-pointer"
                      aria-label={tCalendar('title')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </button>
                  </Tooltip>

                  {/* Share button */}
                  <Tooltip content={commonT('share')} side="bottom">
                    <button
                      type="button"
                      onClick={() => setIsShareModalOpen(true)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded p-2 text-muted-foreground hover:bg-info/10 hover:text-info transition-colors cursor-pointer"
                      aria-label={commonT('share')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16 6 12 2 8 6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                    </button>
                  </Tooltip>

                  {/* Edit button */}
                  <Tooltip content={commonT('edit')} side="bottom">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(true)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                      aria-label={commonT('edit')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </Tooltip>

                  {/* Complete button (#54) */}
                  <Tooltip content={t('markComplete')} side="bottom">
                    <button
                      type="button"
                      onClick={handleComplete}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded p-2 text-muted-foreground hover:bg-success/10 hover:text-success transition-colors cursor-pointer"
                      aria-label={t('markComplete')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                  </Tooltip>
                </>
              )}

              {isCompleted && (
                <Tooltip content={t('reactivate')} side="bottom">
                  <button
                    type="button"
                    onClick={handleRestore}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded p-2 text-muted-foreground hover:bg-info/10 hover:text-info transition-colors cursor-pointer"
                    aria-label={t('reactivate')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 4 1 10 7 10"/>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                    </svg>
                  </button>
                </Tooltip>
              )}

              {/* Delete button */}
              <Tooltip content={commonT('delete')} side="bottom">
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded p-2 text-muted-foreground hover:bg-error/10 hover:text-error transition-colors cursor-pointer"
                  aria-label={commonT('delete')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                </button>
              </Tooltip>
            </div>
          </div>

          {/* Monthly savings needed (#52) */}
          {!isCompleted && monthlySavings !== null && monthlySavings > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              {t('monthlySavingsNeeded', { amount: formatCurrency(monthlySavings, goal.currency, locale) })}
            </div>
          )}

          {/* Progress bar */}
          {!isCompleted && (
            <div className="mt-3">
              {fulfillmentPct !== null ? (
                <>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-medium ${isOnTrack ? 'text-success' : 'text-error'}`}>
                      {isOnTrack ? tTracking('onTrack') : tTracking('behindSchedule')}
                    </span>
                    <span className="text-muted-foreground">{fulfillmentPct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isOnTrack ? 'bg-success' : 'bg-error'}`}
                      style={{ width: `${Math.min(fulfillmentPct, 100)}%` }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground font-medium">{t('timeElapsed')}</span>
                    <span className="text-muted-foreground">{timeProgressPct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isOverdue ? 'bg-error' : 'bg-primary'}`}
                      style={{ width: `${timeProgressPct}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Completed date for completed goals */}
          {isCompleted && goal.completedAt && (
            <div className="mt-3 text-xs text-success font-medium">
              {t('completedOn', { date: formatDate(goal.completedAt, locale) })}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-2 text-xs">
              <span className={`${isOverdue ? 'text-error' : 'text-muted-foreground'}`}>
                {isOverdue
                  ? t('overdueBy', { count: Math.abs(daysRemaining) })
                  : t('daysLeft', { count: daysRemaining })}
              </span>
              {goal.visibility === 'shared' && (
                <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 bg-info/10 text-info font-medium">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {tSpaces('shared')}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
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

        <TrackingModal
          goal={goal}
          isOpen={isTrackingModalOpen}
          onClose={() => setIsTrackingModalOpen(false)}
        />

        <CheckInModal
          goal={goal}
          isOpen={isCheckInModalOpen}
          onClose={() => setIsCheckInModalOpen(false)}
        />

        <CalendarExportModal
          goal={goal}
          isOpen={isCalendarModalOpen}
          onClose={() => setIsCalendarModalOpen(false)}
        />
      </>
    );
  }
);
