import { describe, it, expect } from 'vitest';
import { goalsReducer, getNextPriorityForBucket } from './GoalsContext';
import type { Goal, Bucket, CheckIn } from '@/types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeCheckIn(overrides: Partial<CheckIn> = {}): CheckIn {
  return {
    id: 'checkin_1',
    date: '2026-06-01',
    currentAmount: 500,
    createdAt: new Date('2026-06-01').toISOString(),
    ...overrides,
  };
}

function makeGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: 'goal_1',
    title: 'Test Goal',
    description: 'A test goal description',
    amount: 1000,
    currency: 'USD',
    targetDate: new Date('2027-01-01'),
    bucket: 'safety',
    whyItMatters: 'It matters',
    priority: 1,
    createdAt: new Date('2026-01-01'),
    visibility: 'private',
    spaceId: null,
    checkIns: [],
    ...overrides,
  };
}

const g1 = makeGoal({ id: 'g1', bucket: 'safety', priority: 1 });
const g2 = makeGoal({ id: 'g2', bucket: 'safety', priority: 2 });
const g3 = makeGoal({ id: 'g3', bucket: 'growth', priority: 1 });

// ---------------------------------------------------------------------------
// goalsReducer
// ---------------------------------------------------------------------------

describe('goalsReducer', () => {
  describe('ADD_GOAL', () => {
    it('appends the new goal to the list', () => {
      const state = { goals: [g1] };
      const next = goalsReducer(state, { type: 'ADD_GOAL', payload: g2 });
      expect(next.goals).toHaveLength(2);
      expect(next.goals[1]).toBe(g2);
    });

    it('does not mutate the original state', () => {
      const state = { goals: [g1] };
      goalsReducer(state, { type: 'ADD_GOAL', payload: g2 });
      expect(state.goals).toHaveLength(1);
    });

    it('works on an empty list', () => {
      const next = goalsReducer({ goals: [] }, { type: 'ADD_GOAL', payload: g1 });
      expect(next.goals).toEqual([g1]);
    });
  });

  describe('SET_GOALS', () => {
    it('replaces the entire goals array', () => {
      const state = { goals: [g1, g2] };
      const next = goalsReducer(state, { type: 'SET_GOALS', payload: [g3] });
      expect(next.goals).toEqual([g3]);
    });

    it('can clear all goals with an empty array', () => {
      const next = goalsReducer({ goals: [g1] }, { type: 'SET_GOALS', payload: [] });
      expect(next.goals).toHaveLength(0);
    });
  });

  describe('UPDATE_GOAL', () => {
    it('updates the matching goal', () => {
      const state = { goals: [g1, g2] };
      const next = goalsReducer(state, {
        type: 'UPDATE_GOAL',
        payload: { goalId: 'g1', updates: { title: 'Updated' } },
      });
      expect(next.goals.find((g) => g.id === 'g1')?.title).toBe('Updated');
    });

    it('leaves other goals untouched', () => {
      const state = { goals: [g1, g2] };
      const next = goalsReducer(state, {
        type: 'UPDATE_GOAL',
        payload: { goalId: 'g1', updates: { title: 'Updated' } },
      });
      expect(next.goals.find((g) => g.id === 'g2')).toEqual(g2);
    });

    it('is a no-op when goalId does not exist', () => {
      const state = { goals: [g1] };
      const next = goalsReducer(state, {
        type: 'UPDATE_GOAL',
        payload: { goalId: 'does-not-exist', updates: { title: 'Ghost' } },
      });
      expect(next.goals).toEqual([g1]);
    });
  });

  describe('UPDATE_GOAL_PRIORITY', () => {
    it('updates priority on the matching goal', () => {
      const state = { goals: [g1, g2] };
      const next = goalsReducer(state, {
        type: 'UPDATE_GOAL_PRIORITY',
        payload: { goalId: 'g1', newPriority: 99 },
      });
      expect(next.goals.find((g) => g.id === 'g1')?.priority).toBe(99);
    });

    it('does not change priority on other goals', () => {
      const state = { goals: [g1, g2] };
      const next = goalsReducer(state, {
        type: 'UPDATE_GOAL_PRIORITY',
        payload: { goalId: 'g1', newPriority: 99 },
      });
      expect(next.goals.find((g) => g.id === 'g2')?.priority).toBe(g2.priority);
    });
  });

  describe('REORDER_GOALS_IN_BUCKET', () => {
    it('reassigns 1-indexed priorities according to orderedIds', () => {
      const state = { goals: [g1, g2] };
      // Reverse order: g2 first, g1 second
      const next = goalsReducer(state, {
        type: 'REORDER_GOALS_IN_BUCKET',
        payload: { bucket: 'safety', orderedIds: ['g2', 'g1'] },
      });
      expect(next.goals.find((g) => g.id === 'g2')?.priority).toBe(1);
      expect(next.goals.find((g) => g.id === 'g1')?.priority).toBe(2);
    });

    it('does not affect goals in other buckets', () => {
      const state = { goals: [g1, g2, g3] };
      const next = goalsReducer(state, {
        type: 'REORDER_GOALS_IN_BUCKET',
        payload: { bucket: 'safety', orderedIds: ['g2', 'g1'] },
      });
      expect(next.goals.find((g) => g.id === 'g3')?.priority).toBe(g3.priority);
    });

    it('keeps original priority for goals not in orderedIds', () => {
      // g2 is in the safety bucket but not in orderedIds
      const state = { goals: [g1, g2] };
      const next = goalsReducer(state, {
        type: 'REORDER_GOALS_IN_BUCKET',
        payload: { bucket: 'safety', orderedIds: ['g1'] },
      });
      // g1 gets priority 1; g2 is not in the list so priority is unchanged
      expect(next.goals.find((g) => g.id === 'g2')?.priority).toBe(g2.priority);
    });
  });

  describe('DELETE_GOAL', () => {
    it('removes the goal with the given id', () => {
      const state = { goals: [g1, g2] };
      const next = goalsReducer(state, { type: 'DELETE_GOAL', payload: 'g1' });
      expect(next.goals.find((g) => g.id === 'g1')).toBeUndefined();
      expect(next.goals).toHaveLength(1);
    });

    it('is a no-op when the id does not exist', () => {
      const state = { goals: [g1] };
      const next = goalsReducer(state, { type: 'DELETE_GOAL', payload: 'nonexistent' });
      expect(next.goals).toEqual([g1]);
    });

    it('can delete the only goal, leaving an empty list', () => {
      const next = goalsReducer({ goals: [g1] }, { type: 'DELETE_GOAL', payload: 'g1' });
      expect(next.goals).toHaveLength(0);
    });
  });

  describe('ADD_CHECK_IN', () => {
    it('appends a check-in to the matching goal', () => {
      const state = { goals: [g1, g2] };
      const checkIn = makeCheckIn({ id: 'ci_1' });
      const next = goalsReducer(state, {
        type: 'ADD_CHECK_IN',
        payload: { goalId: 'g1', checkIn },
      });
      expect(next.goals.find((g) => g.id === 'g1')?.checkIns).toHaveLength(1);
      expect(next.goals.find((g) => g.id === 'g1')?.checkIns[0]).toEqual(checkIn);
    });

    it('does not modify other goals', () => {
      const state = { goals: [g1, g2] };
      const checkIn = makeCheckIn({ id: 'ci_1' });
      const next = goalsReducer(state, {
        type: 'ADD_CHECK_IN',
        payload: { goalId: 'g1', checkIn },
      });
      expect(next.goals.find((g) => g.id === 'g2')?.checkIns).toHaveLength(0);
    });

    it('accumulates multiple check-ins on the same goal', () => {
      const ci1 = makeCheckIn({ id: 'ci_1', currentAmount: 200 });
      const ci2 = makeCheckIn({ id: 'ci_2', currentAmount: 400 });
      const goalWithOne = makeGoal({ id: 'g1', checkIns: [ci1] });
      const state = { goals: [goalWithOne] };
      const next = goalsReducer(state, {
        type: 'ADD_CHECK_IN',
        payload: { goalId: 'g1', checkIn: ci2 },
      });
      expect(next.goals[0].checkIns).toHaveLength(2);
    });

    it('does not mutate the original goal checkIns array', () => {
      const state = { goals: [g1] };
      const originalCheckIns = g1.checkIns;
      const checkIn = makeCheckIn();
      goalsReducer(state, { type: 'ADD_CHECK_IN', payload: { goalId: 'g1', checkIn } });
      expect(originalCheckIns).toHaveLength(0);
    });

    it('is a no-op when goalId does not match', () => {
      const state = { goals: [g1] };
      const checkIn = makeCheckIn();
      const next = goalsReducer(state, {
        type: 'ADD_CHECK_IN',
        payload: { goalId: 'nonexistent', checkIn },
      });
      expect(next.goals[0].checkIns).toHaveLength(0);
    });
  });

  describe('DELETE_CHECK_IN', () => {
    it('removes the matching check-in from the goal', () => {
      const ci1 = makeCheckIn({ id: 'ci_1' });
      const ci2 = makeCheckIn({ id: 'ci_2' });
      const goalWithTwo = makeGoal({ id: 'g1', checkIns: [ci1, ci2] });
      const state = { goals: [goalWithTwo] };
      const next = goalsReducer(state, {
        type: 'DELETE_CHECK_IN',
        payload: { goalId: 'g1', checkInId: 'ci_1' },
      });
      const updatedGoal = next.goals.find((g) => g.id === 'g1');
      expect(updatedGoal?.checkIns).toHaveLength(1);
      expect(updatedGoal?.checkIns[0].id).toBe('ci_2');
    });

    it('is a no-op when checkInId does not exist on the goal', () => {
      const ci1 = makeCheckIn({ id: 'ci_1' });
      const goalWithOne = makeGoal({ id: 'g1', checkIns: [ci1] });
      const state = { goals: [goalWithOne] };
      const next = goalsReducer(state, {
        type: 'DELETE_CHECK_IN',
        payload: { goalId: 'g1', checkInId: 'nonexistent' },
      });
      expect(next.goals[0].checkIns).toHaveLength(1);
    });

    it('does not affect other goals', () => {
      const ci1 = makeCheckIn({ id: 'ci_1' });
      const goalWithCheckIn = makeGoal({ id: 'g1', checkIns: [ci1] });
      const state = { goals: [goalWithCheckIn, g2] };
      const next = goalsReducer(state, {
        type: 'DELETE_CHECK_IN',
        payload: { goalId: 'g1', checkInId: 'ci_1' },
      });
      expect(next.goals.find((g) => g.id === 'g2')?.checkIns).toHaveLength(0);
    });

    it('leaves an empty checkIns array when the last check-in is deleted', () => {
      const ci1 = makeCheckIn({ id: 'ci_1' });
      const goalWithOne = makeGoal({ id: 'g1', checkIns: [ci1] });
      const next = goalsReducer({ goals: [goalWithOne] }, {
        type: 'DELETE_CHECK_IN',
        payload: { goalId: 'g1', checkInId: 'ci_1' },
      });
      expect(next.goals[0].checkIns).toHaveLength(0);
    });
  });
});

// ---------------------------------------------------------------------------
// getNextPriorityForBucket
// ---------------------------------------------------------------------------

describe('getNextPriorityForBucket', () => {
  it('returns 1 when the bucket has no goals', () => {
    expect(getNextPriorityForBucket([], 'safety')).toBe(1);
  });

  it('returns 1 when only goals in other buckets exist', () => {
    const goals = [makeGoal({ bucket: 'growth', priority: 5 })];
    expect(getNextPriorityForBucket(goals, 'safety' as Bucket)).toBe(1);
  });

  it('returns max priority + 1', () => {
    const goals = [
      makeGoal({ id: 'a', bucket: 'safety', priority: 3 }),
      makeGoal({ id: 'b', bucket: 'safety', priority: 1 }),
    ];
    expect(getNextPriorityForBucket(goals, 'safety')).toBe(4);
  });

  it('handles a single goal with priority 1', () => {
    const goals = [makeGoal({ bucket: 'dream', priority: 1 })];
    expect(getNextPriorityForBucket(goals, 'dream')).toBe(2);
  });
});
