/**
 * Local storage persistence for goals
 * Handles serialization/deserialization of Goal data with proper date handling
 */

import type { Goal } from '@/types';

// =============================================================================
// Constants
// =============================================================================

const STORAGE_KEY = 'investment-goals-v1';

/**
 * Schema version for migration support
 * Increment when Goal structure changes
 */
const SCHEMA_VERSION = 1;

interface StorageData {
  version: number;
  goals: SerializedGoal[];
}

/**
 * Goal with dates serialized as ISO strings for JSON storage
 */
interface SerializedGoal extends Omit<Goal, 'targetDate' | 'createdAt'> {
  targetDate: string;
  createdAt: string;
}

// =============================================================================
// Serialization
// =============================================================================

/**
 * Convert a Goal to a JSON-serializable format
 */
function serializeGoal(goal: Goal): SerializedGoal {
  return {
    ...goal,
    targetDate: goal.targetDate.toISOString(),
    createdAt: goal.createdAt.toISOString(),
  };
}

/**
 * Convert a serialized goal back to a Goal with proper Date objects
 */
function deserializeGoal(serialized: SerializedGoal): Goal {
  return {
    ...serialized,
    targetDate: new Date(serialized.targetDate),
    createdAt: new Date(serialized.createdAt),
  };
}

// =============================================================================
// Storage Operations
// =============================================================================

/**
 * Load goals from localStorage
 * Returns empty array if no data exists or on error
 */
export function loadGoals(): Goal[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const data: StorageData = JSON.parse(raw);

    // Validate storage data structure
    if (!data || typeof data !== 'object') {
      console.warn('[storage] Invalid storage data structure, returning empty');
      return [];
    }

    // Check version for potential migrations
    if (data.version !== SCHEMA_VERSION) {
      console.warn(`[storage] Schema version mismatch: expected ${SCHEMA_VERSION}, got ${data.version}`);
      // For now, try to use the data anyway. Add migrations here if needed.
    }

    if (!Array.isArray(data.goals)) {
      console.warn('[storage] Goals is not an array, returning empty');
      return [];
    }

    // Deserialize and validate each goal
    const goals: Goal[] = [];
    for (const serialized of data.goals) {
      try {
        const goal = deserializeGoal(serialized as SerializedGoal);
        // Basic validation
        if (goal.id && goal.title && goal.bucket) {
          goals.push(goal);
        }
      } catch (e) {
        console.warn('[storage] Failed to deserialize goal:', e);
        // Skip invalid goals, continue with the rest
      }
    }

    return goals;
  } catch (e) {
    console.error('[storage] Failed to load goals from localStorage:', e);
    return [];
  }
}

/**
 * Save goals to localStorage
 * Returns true on success, false on error
 */
export function saveGoals(goals: Goal[]): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const data: StorageData = {
      version: SCHEMA_VERSION,
      goals: goals.map(serializeGoal),
    };

    const serialized = JSON.stringify(data);

    // Check storage limit (approximate)
    // localStorage typically has a 5MB limit
    const sizeInMB = new Blob([serialized]).size / (1024 * 1024);
    if (sizeInMB > 4) {
      console.warn(`[storage] Data size (${sizeInMB.toFixed(2)}MB) approaching localStorage limit`);
    }

    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (e) {
    // Handle QuotaExceededError and other storage errors
    if (e instanceof Error) {
      if (e.name === 'QuotaExceededError') {
        console.error('[storage] localStorage quota exceeded');
      } else {
        console.error('[storage] Failed to save goals:', e.message);
      }
    }
    return false;
  }
}

/**
 * Clear all goals from localStorage
 */
export function clearGoals(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('[storage] Failed to clear goals:', e);
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
