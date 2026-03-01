import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadGoals,
  saveGoals,
  clearGoals,
  setCache,
  getCache,
  clearExpiredCache,
  isStorageAvailable,
} from './storage';
import type { Goal } from '@/types';

// ---------------------------------------------------------------------------
// localStorage mock (jsdom provides a real implementation)
// ---------------------------------------------------------------------------

function makeGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: 'goal_1',
    title: 'Test Goal',
    description: 'A test goal description',
    amount: 1000,
    currency: 'USD',
    targetDate: new Date('2027-06-01'),
    bucket: 'safety',
    whyItMatters: 'It matters a lot',
    priority: 1,
    createdAt: new Date('2026-01-01'),
    visibility: 'private',
    spaceId: null,
    checkIns: [],
    ...overrides,
  };
}

const STORAGE_KEY = 'investment-goals-v1';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// loadGoals
// ---------------------------------------------------------------------------

describe('loadGoals', () => {
  it('returns an empty array when localStorage is empty', () => {
    expect(loadGoals()).toEqual([]);
  });

  it('round-trips goals correctly (dates are restored as Date objects)', () => {
    const goal = makeGoal();
    saveGoals([goal]);

    const loaded = loadGoals();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe(goal.id);
    expect(loaded[0].targetDate).toBeInstanceOf(Date);
    expect(loaded[0].createdAt).toBeInstanceOf(Date);
    expect(loaded[0].targetDate.toISOString()).toBe(goal.targetDate.toISOString());
  });

  it('returns an empty array when JSON is malformed', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');
    expect(loadGoals()).toEqual([]);
  });

  it('returns an empty array when root data is not an object', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(null));
    expect(loadGoals()).toEqual([]);
  });

  it('returns an empty array when goals field is not an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, goals: 'oops' }));
    expect(loadGoals()).toEqual([]);
  });

  it('skips goals that fail the id/title/bucket validation and loads the rest', () => {
    const validGoal = makeGoal({ id: 'valid' });
    const raw = {
      version: 1,
      goals: [
        // Missing id — will fail the `goal.id && goal.title && goal.bucket` guard
        { title: 'No ID', bucket: 'safety', targetDate: new Date().toISOString(), createdAt: new Date().toISOString() },
        {
          ...validGoal,
          targetDate: validGoal.targetDate.toISOString(),
          createdAt: validGoal.createdAt.toISOString(),
        },
      ],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));

    const loaded = loadGoals();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe('valid');
  });

  it('skips goals missing required fields (id, title, bucket)', () => {
    const raw = {
      version: 1,
      goals: [
        // Missing id
        { title: 'No ID', bucket: 'safety', targetDate: new Date().toISOString(), createdAt: new Date().toISOString() },
      ],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    expect(loadGoals()).toHaveLength(0);
  });

  it('applies backward-compat defaults: visibility and spaceId', () => {
    const goal = makeGoal();
    // Simulate old data without visibility/spaceId
    const raw = {
      version: 1,
      goals: [{
        id: goal.id,
        title: goal.title,
        description: goal.description,
        amount: goal.amount,
        currency: goal.currency,
        targetDate: goal.targetDate.toISOString(),
        bucket: goal.bucket,
        whyItMatters: goal.whyItMatters,
        priority: goal.priority,
        createdAt: goal.createdAt.toISOString(),
        // visibility and spaceId deliberately omitted
      }],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));

    const loaded = loadGoals();
    expect(loaded[0].visibility).toBe('private');
    expect(loaded[0].spaceId).toBeNull();
  });

  it('still loads data when schema version mismatches (logs warning, does not throw)', () => {
    const goal = makeGoal();
    const raw = {
      version: 99,  // Future/unknown version
      goals: [{
        ...goal,
        targetDate: goal.targetDate.toISOString(),
        createdAt: goal.createdAt.toISOString(),
      }],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const loaded = loadGoals();
    expect(loaded).toHaveLength(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Schema version mismatch'));
  });
});

// ---------------------------------------------------------------------------
// saveGoals
// ---------------------------------------------------------------------------

describe('saveGoals', () => {
  it('returns true on success', () => {
    expect(saveGoals([makeGoal()])).toBe(true);
  });

  it('persists goals that loadGoals can subsequently read back', () => {
    const goals = [makeGoal({ id: 'a' }), makeGoal({ id: 'b', bucket: 'growth' })];
    saveGoals(goals);
    const loaded = loadGoals();
    expect(loaded.map((g) => g.id)).toEqual(['a', 'b']);
  });

  it('stores data with the correct schema version', () => {
    saveGoals([makeGoal()]);
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(raw.version).toBe(1);
    expect(Array.isArray(raw.goals)).toBe(true);
  });

  it('returns false when localStorage throws QuotaExceededError', () => {
    const error = new DOMException('QuotaExceededError');
    Object.defineProperty(error, 'name', { value: 'QuotaExceededError' });
    // Spy on the prototype so jsdom's non-configurable instance property is bypassed
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw error; });

    expect(saveGoals([makeGoal()])).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// clearGoals
// ---------------------------------------------------------------------------

describe('clearGoals', () => {
  it('removes goals from localStorage', () => {
    saveGoals([makeGoal()]);
    clearGoals();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('is a no-op when storage is already empty', () => {
    expect(() => clearGoals()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Cache operations
// ---------------------------------------------------------------------------

describe('setCache / getCache', () => {
  it('stores and retrieves a value within the TTL', () => {
    setCache('my-key', { foo: 'bar' }, 60_000);
    expect(getCache('my-key')).toEqual({ foo: 'bar' });
  });

  it('returns null for a key that was never set', () => {
    expect(getCache('unknown-key')).toBeNull();
  });

  it('returns null and removes the item when the TTL has expired', () => {
    vi.useFakeTimers();
    setCache('expiring', 42, 1_000);

    // Advance time past the TTL
    vi.advanceTimersByTime(2_000);

    expect(getCache('expiring')).toBeNull();
    vi.useRealTimers();
  });

  it('does not expire an item before its TTL elapses', () => {
    vi.useFakeTimers();
    setCache('fresh', 'hello', 10_000);
    vi.advanceTimersByTime(5_000);

    expect(getCache('fresh')).toBe('hello');
    vi.useRealTimers();
  });

  it('can cache different types (string, number, object, array)', () => {
    setCache('str', 'hello', 60_000);
    setCache('num', 42, 60_000);
    setCache('obj', { x: 1 }, 60_000);
    setCache('arr', [1, 2, 3], 60_000);

    expect(getCache('str')).toBe('hello');
    expect(getCache('num')).toBe(42);
    expect(getCache('obj')).toEqual({ x: 1 });
    expect(getCache('arr')).toEqual([1, 2, 3]);
  });
});

describe('clearExpiredCache', () => {
  it('removes expired cache entries but keeps fresh ones', () => {
    vi.useFakeTimers();

    setCache('expired-a', 1, 1_000);
    setCache('expired-b', 2, 1_000);
    setCache('fresh-c', 3, 60_000);

    vi.advanceTimersByTime(2_000);
    clearExpiredCache();

    expect(getCache('expired-a')).toBeNull();
    expect(getCache('expired-b')).toBeNull();
    expect(getCache('fresh-c')).toBe(3);

    vi.useRealTimers();
  });
});

// ---------------------------------------------------------------------------
// isStorageAvailable
// ---------------------------------------------------------------------------

describe('isStorageAvailable', () => {
  it('returns true in a jsdom environment where localStorage works', () => {
    expect(isStorageAvailable()).toBe(true);
  });

  it('returns false when localStorage.setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage disabled');
    });
    expect(isStorageAvailable()).toBe(false);
  });
});
