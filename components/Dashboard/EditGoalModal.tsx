'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Goal, Bucket, Currency, CURRENCIES, BUCKETS } from '@/types';
import { useGoals } from '@/context';
import { useToast } from '@/components/ui';
import { Button, Input, Textarea, Label, Select, Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui';

interface EditGoalModalProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
}

export function EditGoalModal({ goal, isOpen, onClose }: EditGoalModalProps) {
  const t = useTranslations('dashboard.editModal');
  const tCommon = useTranslations('common');
  const tGoalForm = useTranslations('goalForm');
  const tBuckets = useTranslations('buckets');
  const { updateGoal } = useGoals();
  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);

  // Form state — initialised from the goal prop
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description);
  const [amount, setAmount] = useState(String(goal.amount));
  const [currency, setCurrency] = useState<Currency>(goal.currency);
  const [targetDate, setTargetDate] = useState(
    goal.targetDate instanceof Date
      ? goal.targetDate.toISOString().split('T')[0]
      : String(goal.targetDate).split('T')[0]
  );
  const [bucket, setBucket] = useState<Bucket>(goal.bucket);
  const [whyItMatters, setWhyItMatters] = useState(goal.whyItMatters);
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when goal changes
  useEffect(() => {
    setTitle(goal.title);
    setDescription(goal.description);
    setAmount(String(goal.amount));
    setCurrency(goal.currency);
    setTargetDate(
      goal.targetDate instanceof Date
        ? goal.targetDate.toISOString().split('T')[0]
        : String(goal.targetDate).split('T')[0]
    );
    setBucket(goal.bucket);
    setWhyItMatters(goal.whyItMatters);
  }, [goal]);

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

  // Validation
  const titleError = title.length > 0 && title.length < 3;
  const descriptionError = description.length > 0 && description.length < 20;
  const amountError = amount !== '' && (isNaN(Number(amount)) || Number(amount) <= 0);
  const dateError = targetDate !== '' && new Date(targetDate) <= new Date(new Date().toDateString());
  const whyError = whyItMatters.length > 0 && whyItMatters.length < 10;

  const isValid =
    title.length >= 3 &&
    description.length >= 20 &&
    Number(amount) > 0 &&
    targetDate !== '' &&
    new Date(targetDate) > new Date(new Date().toDateString()) &&
    whyItMatters.length >= 10;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSave = () => {
    if (!isValid) return;
    setIsSaving(true);

    updateGoal(goal.id, {
      title,
      description,
      amount: Number(amount),
      currency,
      targetDate: new Date(targetDate),
      bucket,
      whyItMatters,
    });

    showToast(t('savedToast'), 'success');
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  const bucketColors: Record<Bucket, string> = {
    safety: 'border-green-500 bg-green-50 dark:bg-green-950/30',
    growth: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
    dream: 'border-purple-500 bg-purple-50 dark:bg-purple-950/30',
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="edit-goal-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        <Card className="border-border shadow-lg flex flex-col overflow-hidden">
          {/* Header */}
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle id="edit-goal-modal-title">{t('title')}</CardTitle>
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

          {/* Scrollable body */}
          <CardContent className="overflow-y-auto flex-1 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-title" required>{tGoalForm('step1.titleLabel')}</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={titleError}
                maxLength={100}
                placeholder={tGoalForm('step1.titlePlaceholder')}
              />
              {titleError && <p className="text-xs text-red-600">{tGoalForm('step1.titleError')}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-description" required>{tGoalForm('step1.descriptionLabel')}</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={descriptionError}
                rows={3}
                maxLength={500}
                placeholder={tGoalForm('step1.descriptionPlaceholder')}
              />
              {descriptionError && <p className="text-xs text-red-600">{tGoalForm('step1.descriptionError')}</p>}
            </div>

            {/* Amount + Currency */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edit-amount" required>{tGoalForm('step2.amountLabel')}</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  error={amountError}
                  placeholder="0.00"
                />
                {amountError && <p className="text-xs text-red-600">{tGoalForm('step2.amountError')}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-currency">{tGoalForm('step2.currencyLabel')}</Label>
                <Select
                  id="edit-currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Target Date */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-date" required>{tGoalForm('step3.dateLabel')}</Label>
              <Input
                id="edit-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                error={dateError}
              />
              {dateError && <p className="text-xs text-red-600">{tGoalForm('step3.dateError')}</p>}
            </div>

            {/* Bucket */}
            <div className="space-y-1.5">
              <Label>{t('bucketLabel')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {BUCKETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBucket(b)}
                    className={`rounded-lg border-2 p-2 text-center text-xs font-medium transition-all cursor-pointer ${
                      bucket === b
                        ? bucketColors[b]
                        : 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    {tBuckets(`${b}.name`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Why It Matters */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-why" required>{tGoalForm('step5.whyLabel')}</Label>
              <Textarea
                id="edit-why"
                value={whyItMatters}
                onChange={(e) => setWhyItMatters(e.target.value)}
                error={whyError}
                rows={3}
                maxLength={500}
                placeholder={tGoalForm('step5.whyPlaceholder')}
              />
              {whyError && <p className="text-xs text-red-600">{tGoalForm('step5.whyError')}</p>}
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex-shrink-0 flex justify-end gap-2 border-t border-border">
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
