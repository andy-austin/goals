'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations, useLocale } from 'next-intl';
import { Goal, CheckIn, formatCurrency } from '@/types';
import { useGoals } from '@/context';
import { useToast } from '@/components/ui';
import { Button, Input, Textarea, Label, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';

interface CheckInModalProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
}

function generateCheckInId(): string {
  return crypto.randomUUID();
}

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Inner form component that mounts fresh each time the modal opens,
 * so state naturally resets without needing a useEffect.
 */
function CheckInForm({ goal, onClose }: { goal: Goal; onClose: () => void }) {
  const t = useTranslations('dashboard.checkInModal');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const { addCheckIn } = useGoals();
  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState(toLocalDateString(new Date()));
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const parsedAmount = parseFloat(amount);
  const amountError = amount !== '' && (isNaN(parsedAmount) || parsedAmount < 0);
  const isValid = date !== '' && amount !== '' && !amountError;

  // Fulfillment preview (existing deposits + this new one)
  const existingTotal = goal.checkIns.reduce((sum, ci) => sum + ci.currentAmount, 0);
  const fulfillmentPercent =
    isValid && goal.amount > 0
      ? Math.round(((existingTotal + parsedAmount) / goal.amount) * 100)
      : null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSave = () => {
    if (!isValid) return;
    setIsSaving(true);

    const checkIn: CheckIn = {
      id: generateCheckInId(),
      date,
      currentAmount: parsedAmount,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    addCheckIn(goal.id, checkIn);
    showToast(t('savedToast'), 'success');
    setIsSaving(false);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="check-in-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md animate-in zoom-in-95 duration-200"
      >
        <Card className="border-border shadow-lg">
          {/* Header */}
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle id="check-in-modal-title">{t('title')}</CardTitle>
              <button
                type="button"
                onClick={onClose}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label={tCommon('close')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {goal.title} · {formatCurrency(goal.amount, goal.currency, locale)} target
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Date */}
            <div className="space-y-1.5">
              <Label htmlFor="checkin-date" required>{t('dateLabel')}</Label>
              <Input
                id="checkin-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={toLocalDateString(new Date())}
              />
            </div>

            {/* Current Amount */}
            <div className="space-y-1.5">
              <Label htmlFor="checkin-amount" required>{t('amountLabel')} ({goal.currency})</Label>
              <Input
                id="checkin-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={amountError}
                placeholder={t('amountPlaceholder')}
              />
              {amountError && (
                <p className="text-xs text-error">{t('amountError')}</p>
              )}
            </div>

            {/* Fulfillment preview */}
            {fulfillmentPercent !== null && (
              <div className="rounded-lg border border-border p-3 bg-muted">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">
                    {t('fulfillmentPreview', { percent: fulfillmentPercent })}
                  </span>
                  <span className={`font-semibold ${fulfillmentPercent >= 100 ? 'text-success' : 'text-foreground'}`}>
                    {fulfillmentPercent}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(fulfillmentPercent, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Note */}
            <div className="space-y-1.5">
              <Label htmlFor="checkin-note">{t('noteLabel')}</Label>
              <Textarea
                id="checkin-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                maxLength={300}
                placeholder={t('notePlaceholder')}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 border-t border-border">
            <Button variant="ghost" onClick={onClose} disabled={isSaving}>
              {tCommon('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={!isValid || isSaving}>
              {isSaving ? tCommon('saving') : tCommon('save')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>,
    document.body
  );
}

/**
 * CheckInModal wrapper — renders inner form only when open,
 * so form state resets naturally on each open.
 */
export function CheckInModal({ goal, isOpen, onClose }: CheckInModalProps) {
  if (!isOpen) return null;
  return <CheckInForm goal={goal} onClose={onClose} />;
}
