'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import type {
  Goal,
  Bucket,
  CheckIn,
  CreateGoalInput,
  GoalsByBucket,
} from '@/types';
import { loadGoals, saveGoals, clearGoals } from '@/lib';
import { useAuth } from './AuthContext';
import {
  fetchGoals as fetchGoalsRemote,
  insertGoal as insertGoalRemote,
  deleteGoalRemote,
  updateGoalRemote,
  upsertGoals,
  insertCheckInRemote,
  deleteCheckInRemote,
} from '@/lib/supabase/goals';

// =============================================================================
// Types
// =============================================================================

interface GoalsState {
  goals: Goal[];
}

type GoalsAction =
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'UPDATE_GOAL'; payload: { goalId: string; updates: Partial<Omit<Goal, 'id' | 'createdAt'>> } }
  | { type: 'UPDATE_GOAL_PRIORITY'; payload: { goalId: string; newPriority: number } }
  | { type: 'REORDER_GOALS_IN_BUCKET'; payload: { bucket: Bucket; orderedIds: string[] } }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_CHECK_IN'; payload: { goalId: string; checkIn: CheckIn } }
  | { type: 'DELETE_CHECK_IN'; payload: { goalId: string; checkInId: string } };

interface GoalsContextValue {
  /** All goals */
  goals: Goal[];

  /** Add a new goal (auto-generates id, createdAt, and priority) */
  addGoal: (input: CreateGoalInput) => Goal;

  /** Update an existing goal's fields */
  updateGoal: (goalId: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => void;

  /** Delete a goal by ID */
  deleteGoal: (goalId: string) => void;

  /** Get all goals */
  getGoals: () => Goal[];

  /** Get goals filtered by bucket, sorted by priority */
  getGoalsByBucket: (bucket: Bucket) => Goal[];

  /** Get all goals organized by bucket */
  getAllGoalsByBucket: () => GoalsByBucket;

  /** Update a goal's priority within its bucket */
  updateGoalPriority: (goalId: string, newPriority: number) => void;

  /** Reorder goals within a bucket by providing ordered IDs */
  reorderGoalsInBucket: (bucket: Bucket, orderedIds: string[]) => void;

  /** Get a single goal by ID */
  getGoalById: (goalId: string) => Goal | undefined;

  /** Get total count of goals */
  totalGoals: number;

  /** Get total amount across all goals */
  totalAmount: number;

  /** Add a check-in to a goal */
  addCheckIn: (goalId: string, checkIn: CheckIn) => void;

  /** Delete a check-in from a goal */
  deleteCheckIn: (goalId: string, checkInId: string) => void;
}

// =============================================================================
// Helpers
// =============================================================================

function generateId(): string {
  return `goal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

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

// =============================================================================
// Context
// =============================================================================

const GoalsContext = createContext<GoalsContextValue | null>(null);

// =============================================================================
// Provider
// =============================================================================

interface GoalsProviderProps {
  children: ReactNode;
  initialGoals?: Goal[];
}

export function GoalsProvider({ children, initialGoals = [] }: GoalsProviderProps) {
  const [state, dispatch] = useReducer(goalsReducer, { goals: initialGoals });
  const isHydrated = useRef(false);
  const { user } = useAuth();

  // Load goals: from Supabase if authenticated, from localStorage if not
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      if (user) {
        // Authenticated: load from Supabase
        const remoteGoals = await fetchGoalsRemote();
        if (cancelled) return;

        const localGoals = loadGoals();
        if (localGoals.length > 0 && remoteGoals.length === 0) {
          // User has local goals but no remote goals — migrate
          await upsertGoals(localGoals, user.id);
          clearGoals(); // Clear localStorage after migration
          if (cancelled) return;
          dispatch({ type: 'SET_GOALS', payload: localGoals });
        } else {
          if (localGoals.length > 0) {
            // Both exist — remote wins, clear local
            clearGoals();
          }
          dispatch({ type: 'SET_GOALS', payload: remoteGoals });
        }
      } else {
        // Anonymous or logged out: load from localStorage.
        // Always dispatch (even empty) so a previous user's goals are cleared.
        const storedGoals = loadGoals();
        dispatch({ type: 'SET_GOALS', payload: storedGoals });
      }
      isHydrated.current = true;
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Persist goals to localStorage for anonymous users only
  useEffect(() => {
    if (isHydrated.current && !user) {
      saveGoals(state.goals);
    }
  }, [state.goals, user]);

  const addGoal = useCallback((input: CreateGoalInput): Goal => {
    const newGoal: Goal = {
      ...input,
      visibility: input.visibility ?? 'private',
      spaceId: input.spaceId ?? null,
      checkIns: [],
      id: generateId(),
      createdAt: new Date(),
      priority: getNextPriorityForBucket(state.goals, input.bucket),
    };
    dispatch({ type: 'ADD_GOAL', payload: newGoal });

    // Persist to Supabase if authenticated
    if (user) {
      insertGoalRemote(newGoal, user.id);
    }

    return newGoal;
  }, [state.goals, user]);

  const updateGoal = useCallback((goalId: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>): void => {
    dispatch({ type: 'UPDATE_GOAL', payload: { goalId, updates } });

    // Persist to Supabase if authenticated
    if (user) {
      const current = state.goals.find((g) => g.id === goalId);
      if (current) {
        updateGoalRemote({ ...current, ...updates }, user.id);
      }
    }
  }, [state.goals, user]);

  const deleteGoal = useCallback((goalId: string): void => {
    dispatch({ type: 'DELETE_GOAL', payload: goalId });

    // Delete from Supabase if authenticated
    if (user) {
      deleteGoalRemote(goalId);
    }
  }, [user]);

  const getGoals = useCallback((): Goal[] => {
    return state.goals;
  }, [state.goals]);

  const getGoalsByBucket = useCallback((bucket: Bucket): Goal[] => {
    return state.goals
      .filter((goal) => goal.bucket === bucket)
      .sort((a, b) => a.priority - b.priority);
  }, [state.goals]);

  const getAllGoalsByBucket = useCallback((): GoalsByBucket => {
    return {
      safety: getGoalsByBucket('safety'),
      growth: getGoalsByBucket('growth'),
      dream: getGoalsByBucket('dream'),
    };
  }, [getGoalsByBucket]);

  const updateGoalPriority = useCallback((goalId: string, newPriority: number): void => {
    dispatch({ type: 'UPDATE_GOAL_PRIORITY', payload: { goalId, newPriority } });
  }, []);

  const reorderGoalsInBucket = useCallback((bucket: Bucket, orderedIds: string[]): void => {
    dispatch({ type: 'REORDER_GOALS_IN_BUCKET', payload: { bucket, orderedIds } });
  }, []);

  const getGoalById = useCallback((goalId: string): Goal | undefined => {
    return state.goals.find((goal) => goal.id === goalId);
  }, [state.goals]);

  const addCheckIn = useCallback((goalId: string, checkIn: CheckIn): void => {
    dispatch({ type: 'ADD_CHECK_IN', payload: { goalId, checkIn } });

    if (user) {
      insertCheckInRemote(goalId, checkIn, user.id).catch((err) => {
        console.error('[GoalsContext] Failed to sync check-in to Supabase:', err);
      });
    }
  }, [user]);

  const deleteCheckIn = useCallback((goalId: string, checkInId: string): void => {
    dispatch({ type: 'DELETE_CHECK_IN', payload: { goalId, checkInId } });

    if (user) {
      deleteCheckInRemote(checkInId).catch((err) => {
        console.error('[GoalsContext] Failed to delete check-in from Supabase:', err);
      });
    }
  }, [user]);

  const totalGoals = state.goals.length;

  const totalAmount = useMemo(() => {
    return state.goals.reduce((sum, goal) => sum + goal.amount, 0);
  }, [state.goals]);

  const value: GoalsContextValue = useMemo(() => ({
    goals: state.goals,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoals,
    getGoalsByBucket,
    getAllGoalsByBucket,
    updateGoalPriority,
    reorderGoalsInBucket,
    getGoalById,
    totalGoals,
    totalAmount,
    addCheckIn,
    deleteCheckIn,
  }), [
    state.goals,
    addGoal,
    updateGoal,
    deleteGoal,
    getGoals,
    getGoalsByBucket,
    getAllGoalsByBucket,
    updateGoalPriority,
    reorderGoalsInBucket,
    getGoalById,
    totalGoals,
    totalAmount,
    addCheckIn,
    deleteCheckIn,
  ]);

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useGoals(): GoalsContextValue {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
}
