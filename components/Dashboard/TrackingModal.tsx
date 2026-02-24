'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations, useLocale } from 'next-intl';
import { Goal, InvestmentVehicle, TrackingCadence, CheckIn, formatCurrency } from '@/types';
import { useGoals } from '@/context';
import { useToast } from '@/components/ui';
import { Button, Input, Label, Select, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';
import { CheckInModal } from './CheckInModal';

interface TrackingModalProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
}

const CADENCE_OPTIONS: Array<{ value: TrackingCadence | ''; labelKey: string }> = [
  { value: '', labelKey: 'cadenceNone' },
  { value: 'weekly', labelKey: 'cadenceWeekly' },
  { value: 'monthly', labelKey: 'cadenceMonthly' },
  { value: 'quarterly', labelKey: 'cadenceQuarterly' },
  { value: 'annually', labelKey: 'cadenceAnnually' },
];

/**
 * Calculate on-track fulfillment vs expected progress
 * Expected = (elapsed days / total days) * target amount
 */
function computeFulfillment(
  goal: Goal
): { latestAmount: number; expectedAmount: number; fulfillmentPct: number; isOnTrack: boolean } | null {
  if (goal.checkIns.length === 0) return null;

  const sorted = [...goal.checkIns].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  const latestAmount = latest.currentAmount;

  const now = Date.now();
  const start = goal.createdAt.getTime();
  const end = goal.targetDate.getTime();
  const totalMs = end - start;
  const elapsedMs = now - start;

  if (totalMs <= 0) return null;

  const progressRatio = Math.max(0, Math.min(1, elapsedMs / totalMs));
  const expectedAmount = progressRatio * goal.amount;
  const fulfillmentPct = goal.amount > 0 ? Math.round((latestAmount / goal.amount) * 100) : 0;
  const isOnTrack = latestAmount >= expectedAmount;

  return { latestAmount, expectedAmount, fulfillmentPct, isOnTrack };
}

export function TrackingModal({ goal, isOpen, onClose }: TrackingModalProps) {
  const t = useTranslations('dashboard.trackingModal');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { updateGoal, deleteCheckIn } = useGoals();
  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  // Vehicle form state
  const [vehicleName, setVehicleName] = useState(goal.investmentVehicle?.name ?? '');
  const [institution, setInstitution] = useState(goal.investmentVehicle?.institution ?? '');
  const [vehicleType, setVehicleType] = useState(goal.investmentVehicle?.type ?? '');
  const [cadence, setCadence] = useState<TrackingCadence | ''>(goal.trackingCadence ?? '');
  const [isSaving, setIsSaving] = useState(false);

  // Sync with goal when it changes (e.g., after save)
  useEffect(() => {
    setVehicleName(goal.investmentVehicle?.name ?? '');
    setInstitution(goal.investmentVehicle?.institution ?? '');
    setVehicleType(goal.investmentVehicle?.type ?? '');
    setCadence(goal.trackingCadence ?? '');
  }, [goal]);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isCheckInOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, isCheckInOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Don't close when CheckInModal is open — React synthetic events bubble
    // through the portal tree, so a click inside CheckInModal (e.g. Save button)
    // propagates here. The target won't be inside modalRef, so without this guard
    // the TrackingModal would close unexpectedly.
    if (isCheckInOpen) return;
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSave = () => {
    setIsSaving(true);

    const investmentVehicle: InvestmentVehicle | undefined = vehicleName.trim()
      ? {
          name: vehicleName.trim(),
          institution: institution.trim() || undefined,
          type: vehicleType.trim() || undefined,
        }
      : undefined;

    updateGoal(goal.id, {
      investmentVehicle,
      trackingCadence: cadence || undefined,
    });

    showToast(t('savedToast'), 'success');
    setIsSaving(false);
    onClose();
  };

  const handleDeleteCheckIn = (checkIn: CheckIn) => {
    deleteCheckIn(goal.id, checkIn.id);
  };

  const fulfillment = computeFulfillment(goal);
  const sortedCheckIns = [...goal.checkIns].sort((a, b) => b.date.localeCompare(a.date));

  if (!isOpen) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        onClick={handleBackdropClick}
        aria-modal="true"
        role="dialog"
        aria-labelledby="tracking-modal-title"
      >
        <div
          ref={modalRef}
          className="w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        >
          <Card className="border-border shadow-lg flex flex-col overflow-hidden">
            {/* Header */}
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle id="tracking-modal-title">{t('title')}</CardTitle>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{goal.title}</p>
                </div>
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

            {/* Scrollable content */}
            <CardContent className="overflow-y-auto flex-1 space-y-6">
              {/* Investment Vehicle */}
              <section>
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  {t('vehicleSection')}
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="vehicle-name">{t('vehicleNameLabel')}</Label>
                    <Input
                      id="vehicle-name"
                      value={vehicleName}
                      onChange={(e) => setVehicleName(e.target.value)}
                      placeholder={t('vehicleNamePlaceholder')}
                      maxLength={100}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="institution">{t('institutionLabel')}</Label>
                      <Input
                        id="institution"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder={t('institutionPlaceholder')}
                        maxLength={100}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="vehicle-type">{t('vehicleTypeLabel')}</Label>
                      <Input
                        id="vehicle-type"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        placeholder={t('vehicleTypePlaceholder')}
                        maxLength={60}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Tracking Cadence */}
              <section>
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {t('cadenceSection')}
                </h3>
                <div className="space-y-1.5">
                  <Label htmlFor="cadence">{t('cadenceLabel')}</Label>
                  <Select
                    id="cadence"
                    value={cadence}
                    onChange={(e) => setCadence(e.target.value as TrackingCadence | '')}
                  >
                    {CADENCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey as Parameters<typeof t>[0])}
                      </option>
                    ))}
                  </Select>
                </div>
              </section>

              {/* Fulfillment Summary */}
              {fulfillment && (
                <section>
                  <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {t('fulfillmentLabel')}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                          {fulfillment.fulfillmentPct}%
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          fulfillment.isOnTrack
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {fulfillment.isOnTrack ? t('onTrack') : t('behindSchedule')}
                        </span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fulfillment.isOnTrack
                            ? 'bg-green-500 dark:bg-green-400'
                            : 'bg-red-500 dark:bg-red-400'
                        }`}
                        style={{ width: `${Math.min(fulfillment.fulfillmentPct, 100)}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                      <span>
                        {formatCurrency(fulfillment.latestAmount, goal.currency, locale)}
                      </span>
                      <span>
                        {t('expectedByNow')}: {formatCurrency(fulfillment.expectedAmount, goal.currency, locale)}
                      </span>
                    </div>
                  </div>
                </section>
              )}

              {/* Progress History */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    {t('progressSection')}
                  </h3>
                  <Button
                    variant="secondary"
                    onClick={() => setIsCheckInOpen(true)}
                    className="text-xs py-1 px-3 h-auto"
                  >
                    + {t('addCheckIn')}
                  </Button>
                </div>

                {sortedCheckIns.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-6 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg">
                    {t('noCheckIns')}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {sortedCheckIns.map((checkIn) => (
                      <li
                        key={checkIn.id}
                        className="flex items-start justify-between rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 bg-white dark:bg-zinc-900"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                              {formatCurrency(checkIn.currentAmount, goal.currency, locale)}
                            </span>
                            <span className="text-xs text-zinc-400">
                              {new Date(checkIn.date + 'T00:00:00').toLocaleDateString(locale, {
                                year: 'numeric', month: 'short', day: 'numeric'
                              })}
                            </span>
                          </div>
                          {checkIn.note && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                              {checkIn.note}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCheckIn(checkIn)}
                          className="ml-2 flex-shrink-0 rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                          aria-label={t('deleteCheckInConfirm')}
                          title={t('deleteCheckInConfirm')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </CardContent>

            <CardFooter className="flex-shrink-0 flex justify-end gap-2 border-t border-border">
              <Button variant="ghost" onClick={onClose} disabled={isSaving}>
                {tCommon('cancel')}
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? tCommon('saving') : tCommon('save')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Nested check-in modal rendered at z-[60] */}
      <CheckInModal
        goal={goal}
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
      />
    </>,
    document.body
  );
}
