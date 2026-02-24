/**
 * Unit tests for investment vehicle tracking logic (Issue #66)
 *
 * Tests:
 * 1. computeFulfillment helper extracted inline
 * 2. localStorage serialization round-trips for goals with checkIns
 * 3. deserializeGoal backward compatibility (legacy goals without checkIns)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Goal, CheckIn, InvestmentVehicle } from '@/types';
import { loadGoals, saveGoals, clearGoals } from '@/lib/storage';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeCheckIn(overrides: Partial<CheckIn> = {}): CheckIn {
  return {
    id: 'ci_1',
    date: '2026-06-01',
    currentAmount: 500,
    createdAt: new Date('2026-06-01T10:00:00Z').toISOString(),
    ...overrides,
  };
}

function makeGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: 'goal_1',
    title: 'Test Goal',
    description: 'A test goal description that is long enough',
    amount: 10000,
    currency: 'USD',
    targetDate: new Date('2028-01-01'),
    bucket: 'growth',
    whyItMatters: 'It matters for my future',
    priority: 1,
    createdAt: new Date('2026-01-01'),
    visibility: 'private',
    spaceId: null,
    checkIns: [],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// computeFulfillment — inline copy of the pure logic from TrackingModal
// (kept here to avoid importing a React component into a unit test)
// ---------------------------------------------------------------------------

interface FulfillmentResult {
  latestAmount: number;
  expectedAmount: number;
  fulfillmentPct: number;
  isOnTrack: boolean;
}

function computeFulfillment(goal: Goal, now = Date.now()): FulfillmentResult | null {
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

// ---------------------------------------------------------------------------
// computeFulfillment
// ---------------------------------------------------------------------------

describe('computeFulfillment', () => {
  it('returns null when there are no check-ins', () => {
    const goal = makeGoal();
    expect(computeFulfillment(goal)).toBeNull();
  });

  it('returns null when totalMs <= 0 (targetDate <= createdAt)', () => {
    const goal = makeGoal({
      createdAt: new Date('2026-01-01'),
      targetDate: new Date('2026-01-01'), // same date → totalMs = 0
    });
    const ci = makeCheckIn({ currentAmount: 100 });
    expect(computeFulfillment({ ...goal, checkIns: [ci] })).toBeNull();
  });

  it('reports 50% fulfillment when latest check-in is half the target', () => {
    const goal = makeGoal({ amount: 1000 });
    const ci = makeCheckIn({ currentAmount: 500 });
    const result = computeFulfillment({ ...goal, checkIns: [ci] });
    expect(result?.fulfillmentPct).toBe(50);
  });

  it('reports 100% fulfillment when target is fully reached', () => {
    const goal = makeGoal({ amount: 1000 });
    const ci = makeCheckIn({ currentAmount: 1000 });
    const result = computeFulfillment({ ...goal, checkIns: [ci] });
    expect(result?.fulfillmentPct).toBe(100);
  });

  it('reports more than 100% fulfillment when amount exceeds target', () => {
    const goal = makeGoal({ amount: 1000 });
    const ci = makeCheckIn({ currentAmount: 1200 });
    const result = computeFulfillment({ ...goal, checkIns: [ci] });
    expect(result?.fulfillmentPct).toBe(120);
  });

  it('uses the latest check-in (by date) when multiple exist', () => {
    const goal = makeGoal({ amount: 1000 });
    const early = makeCheckIn({ id: 'ci_early', date: '2026-03-01', currentAmount: 100 });
    const late = makeCheckIn({ id: 'ci_late', date: '2026-09-01', currentAmount: 700 });
    const result = computeFulfillment({ ...goal, checkIns: [late, early] }); // order shouldn't matter
    expect(result?.latestAmount).toBe(700);
    expect(result?.fulfillmentPct).toBe(70);
  });

  describe('on-track calculation', () => {
    // Goal: $10,000, created 2026-01-01, due 2028-01-01 (2 years = 730 days)
    // Half-way now (365 days after creation): expected = $5,000

    const createdAt = new Date('2026-01-01');
    const targetDate = new Date('2028-01-01');
    // Simulate "now" at exactly the halfway point
    const halfwayNow = createdAt.getTime() + (targetDate.getTime() - createdAt.getTime()) / 2;

    it('is on-track when latest amount >= expected linear progress', () => {
      const goal = makeGoal({ amount: 10000, createdAt, targetDate });
      const ci = makeCheckIn({ currentAmount: 6000 }); // above expected 5000
      const result = computeFulfillment({ ...goal, checkIns: [ci] }, halfwayNow);
      expect(result?.isOnTrack).toBe(true);
      expect(result?.expectedAmount).toBeCloseTo(5000, 0);
    });

    it('is behind schedule when latest amount < expected linear progress', () => {
      const goal = makeGoal({ amount: 10000, createdAt, targetDate });
      const ci = makeCheckIn({ currentAmount: 3000 }); // below expected 5000
      const result = computeFulfillment({ ...goal, checkIns: [ci] }, halfwayNow);
      expect(result?.isOnTrack).toBe(false);
    });

    it('clamps progressRatio to 1 even when now > targetDate', () => {
      const goal = makeGoal({ amount: 10000, createdAt, targetDate });
      const ci = makeCheckIn({ currentAmount: 10000 });
      const afterDeadline = targetDate.getTime() + 30 * 24 * 60 * 60 * 1000;
      const result = computeFulfillment({ ...goal, checkIns: [ci] }, afterDeadline);
      // progressRatio clamped to 1 → expectedAmount = 10000
      expect(result?.expectedAmount).toBe(10000);
      expect(result?.isOnTrack).toBe(true);
    });

    it('clamps progressRatio to 0 when now < createdAt', () => {
      const future = new Date('2030-01-01');
      const goal = makeGoal({ amount: 10000, createdAt: future, targetDate: new Date('2032-01-01') });
      const ci = makeCheckIn({ currentAmount: 0 });
      const nowBeforeCreation = new Date('2026-01-01').getTime();
      const result = computeFulfillment({ ...goal, checkIns: [ci] }, nowBeforeCreation);
      expect(result?.expectedAmount).toBe(0);
      expect(result?.isOnTrack).toBe(true); // 0 >= 0
    });
  });
});

// ---------------------------------------------------------------------------
// localStorage round-trip with checkIns, investmentVehicle, trackingCadence
// ---------------------------------------------------------------------------

describe('Goal tracking fields – localStorage round-trip', () => {
  beforeEach(() => clearGoals());
  afterEach(() => clearGoals());

  it('saves and reloads checkIns correctly', () => {
    const ci = makeCheckIn({ id: 'ci_1', currentAmount: 2500, note: 'First contribution' });
    const goal = makeGoal({ checkIns: [ci] });
    saveGoals([goal]);
    const loaded = loadGoals();
    expect(loaded[0].checkIns).toHaveLength(1);
    expect(loaded[0].checkIns[0].currentAmount).toBe(2500);
    expect(loaded[0].checkIns[0].note).toBe('First contribution');
    expect(loaded[0].checkIns[0].date).toBe('2026-06-01');
  });

  it('saves and reloads investmentVehicle correctly', () => {
    const vehicle: InvestmentVehicle = { name: 'Vanguard S&P 500', institution: 'Vanguard', type: 'Index Fund' };
    const goal = makeGoal({ investmentVehicle: vehicle });
    saveGoals([goal]);
    const loaded = loadGoals();
    expect(loaded[0].investmentVehicle).toEqual(vehicle);
  });

  it('saves and reloads trackingCadence correctly', () => {
    const goal = makeGoal({ trackingCadence: 'monthly' });
    saveGoals([goal]);
    const loaded = loadGoals();
    expect(loaded[0].trackingCadence).toBe('monthly');
  });

  it('preserves multiple check-ins in insertion order after a round-trip', () => {
    const ci1 = makeCheckIn({ id: 'ci_1', date: '2026-03-01', currentAmount: 1000 });
    const ci2 = makeCheckIn({ id: 'ci_2', date: '2026-06-01', currentAmount: 2500 });
    const ci3 = makeCheckIn({ id: 'ci_3', date: '2026-09-01', currentAmount: 4000 });
    const goal = makeGoal({ checkIns: [ci1, ci2, ci3] });
    saveGoals([goal]);
    const loaded = loadGoals();
    expect(loaded[0].checkIns).toHaveLength(3);
    expect(loaded[0].checkIns.map((c) => c.id)).toEqual(['ci_1', 'ci_2', 'ci_3']);
  });

  it('handles a check-in with an optional note being undefined', () => {
    const ci = makeCheckIn({ note: undefined });
    const goal = makeGoal({ checkIns: [ci] });
    saveGoals([goal]);
    const loaded = loadGoals();
    expect(loaded[0].checkIns[0].note).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Backward compatibility: legacy goals without checkIns field
// ---------------------------------------------------------------------------

describe('deserializeGoal – backward compatibility', () => {
  beforeEach(() => clearGoals());
  afterEach(() => clearGoals());

  it('defaults checkIns to [] for legacy goals missing the field', () => {
    // Simulate a goal saved before checkIns was added (no checkIns key)
    const legacy = {
      id: 'legacy_1',
      title: 'Legacy Goal',
      description: 'A legacy goal without checkIns field',
      amount: 5000,
      currency: 'USD',
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      bucket: 'safety',
      whyItMatters: 'It matters',
      priority: 1,
      createdAt: new Date('2025-01-01').toISOString(),
      visibility: 'private',
      spaceId: null,
      // No checkIns field intentionally
    };

    localStorage.setItem('investment-goals-v1', JSON.stringify({ version: 1, goals: [legacy] }));
    const loaded = loadGoals();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].checkIns).toEqual([]);
  });

  it('defaults investmentVehicle to undefined for legacy goals', () => {
    const legacy = {
      id: 'legacy_2',
      title: 'Legacy Goal',
      description: 'A legacy goal without vehicle field',
      amount: 5000,
      currency: 'USD',
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      bucket: 'growth',
      whyItMatters: 'It matters',
      priority: 1,
      createdAt: new Date('2025-01-01').toISOString(),
      visibility: 'private',
      spaceId: null,
      // No investmentVehicle or trackingCadence
    };

    localStorage.setItem('investment-goals-v1', JSON.stringify({ version: 1, goals: [legacy] }));
    const loaded = loadGoals();
    expect(loaded[0].investmentVehicle).toBeUndefined();
    expect(loaded[0].trackingCadence).toBeUndefined();
  });
});
