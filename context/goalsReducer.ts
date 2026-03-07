import type { Goal, Bucket, CheckIn } from '@/types';

// =============================================================================
// Types
// =============================================================================

export interface GoalsState {
  goals: Goal[];
}

export type GoalsAction =
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'UPDATE_GOAL'; payload: { goalId: string; updates: Partial<Omit<Goal, 'id' | 'createdAt'>> } }
  | { type: 'UPDATE_GOAL_PRIORITY'; payload: { goalId: string; newPriority: number } }
  | { type: 'REORDER_GOALS_IN_BUCKET'; payload: { bucket: Bucket; orderedIds: string[] } }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_CHECK_IN'; payload: { goalId: string; checkIn: CheckIn } }
  | { type: 'DELETE_CHECK_IN'; payload: { goalId: string; checkInId: string } };

// =============================================================================
// Helpers
// =============================================================================

export function getNextPriorityForBucket(goals: Goal[], bucket: Bucket): number {
  const bucketGoals = goals.filter((g) => g.bucket === bucket);
  if (bucketGoals.length === 0) return 1;
  return Math.max(...bucketGoals.map((g) => g.priority)) + 1;
}

// =============================================================================
// Reducer
// =============================================================================

export function goalsReducer(state: GoalsState, action: GoalsAction): GoalsState {
  switch (action.type) {
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload],
      };

    case 'SET_GOALS':
      return {
        ...state,
        goals: action.payload,
      };

    case 'UPDATE_GOAL': {
      const { goalId, updates } = action.payload;
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === goalId ? { ...goal, ...updates } : goal
        ),
      };
    }

    case 'UPDATE_GOAL_PRIORITY': {
      const { goalId, newPriority } = action.payload;
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === goalId ? { ...goal, priority: newPriority } : goal
        ),
      };
    }

    case 'REORDER_GOALS_IN_BUCKET': {
      const { bucket, orderedIds } = action.payload;
      const updatedGoals = state.goals.map((goal) => {
        if (goal.bucket !== bucket) return goal;
        const newPriority = orderedIds.indexOf(goal.id);
        if (newPriority === -1) return goal;
        return { ...goal, priority: newPriority + 1 }; // 1-indexed priority
      });
      return {
        ...state,
        goals: updatedGoals,
      };
    }

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.payload),
      };

    case 'ADD_CHECK_IN': {
      const { goalId, checkIn } = action.payload;
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === goalId
            ? { ...goal, checkIns: [...goal.checkIns, checkIn] }
            : goal
        ),
      };
    }

    case 'DELETE_CHECK_IN': {
      const { goalId, checkInId } = action.payload;
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === goalId
            ? { ...goal, checkIns: goal.checkIns.filter((c) => c.id !== checkInId) }
            : goal
        ),
      };
    }

    default:
      return state;
  }
}
