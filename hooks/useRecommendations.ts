import { useMemo } from 'react';
import type { Goal } from '@/types';
import { getRecommendations } from '@/lib/recommendations';
import type { Recommendation } from '@/lib/recommendations';

export function useRecommendations(goal: Goal | null): Recommendation | null {
  return useMemo(() => {
    if (!goal) return null;
    return getRecommendations(goal);
  }, [goal]);
}

export function useRecommendationsForGoals(goals: Goal[]): Map<string, Recommendation> {
  return useMemo(() => {
    const map = new Map<string, Recommendation>();
    for (const goal of goals) {
      const rec = getRecommendations(goal);
      if (rec) map.set(goal.id, rec);
    }
    return map;
  }, [goals]);
}
