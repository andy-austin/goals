import type { Goal } from '@/types';

export interface FulfillmentResult {
  latestAmount: number;
  expectedAmount: number;
  fulfillmentPct: number;
  isOnTrack: boolean;
}

/**
 * Calculate on-track fulfillment vs expected linear progress.
 * Expected = (elapsed days / total days) * target amount.
 *
 * Returns null when there are no check-ins or when the goal's
 * time span is zero/negative (targetDate <= createdAt).
 */
export function computeFulfillment(
  goal: Goal,
  now = Date.now()
): FulfillmentResult | null {
  if (goal.checkIns.length === 0) return null;

  const latestAmount = goal.checkIns.reduce((sum, ci) => sum + ci.currentAmount, 0);

  const start = goal.createdAt.getTime();
  const end = goal.targetDate.getTime();
  const totalMs = end - start;

  if (totalMs <= 0) return null;

  const progressRatio = Math.max(0, Math.min(1, (now - start) / totalMs));
  const expectedAmount = progressRatio * goal.amount;
  const fulfillmentPct = goal.amount > 0 ? Math.round((latestAmount / goal.amount) * 100) : 0;
  const isOnTrack = latestAmount >= expectedAmount;

  return { latestAmount, expectedAmount, fulfillmentPct, isOnTrack };
}

/**
 * Calculate monthly savings needed to reach the goal on time.
 * Takes into account any existing check-in balance.
 * Returns null if the goal is overdue or target is already reached.
 */
export function calculateMonthlySavings(
  goal: Goal,
  now = Date.now()
): number | null {
  const targetMs = goal.targetDate.getTime();
  const remainingMs = targetMs - now;
  if (remainingMs <= 0) return null;

  const remainingMonths = remainingMs / (1000 * 60 * 60 * 24 * 30.44);
  if (remainingMonths < 0.5) return null;

  // Sum all check-in deposits
  const currentAmount = goal.checkIns.reduce((sum, ci) => sum + ci.currentAmount, 0);

  const remaining = goal.amount - currentAmount;
  if (remaining <= 0) return 0;

  return remaining / remainingMonths;
}
