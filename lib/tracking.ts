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

  const sorted = [...goal.checkIns].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  const latestAmount = latest.currentAmount;

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
