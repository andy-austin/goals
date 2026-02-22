import { createClient } from './browser';
import type { Goal, Bucket, Currency, GoalVisibility } from '@/types';

interface GoalRow {
  id: string;
  user_id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  target_date: string;
  bucket: string;
  why_it_matters: string;
  priority: number;
  created_at: string;
  visibility: string;
  space_id: string | null;
}

function rowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    amount: Number(row.amount),
    currency: row.currency as Currency,
    targetDate: new Date(row.target_date),
    bucket: row.bucket as Bucket,
    whyItMatters: row.why_it_matters,
    priority: row.priority,
    createdAt: new Date(row.created_at),
    visibility: (row.visibility ?? 'private') as GoalVisibility,
    spaceId: row.space_id ?? null,
  };
}

function goalToRow(goal: Goal, userId: string): Omit<GoalRow, 'user_id'> & { user_id: string } {
  return {
    id: goal.id,
    user_id: userId,
    title: goal.title,
    description: goal.description,
    amount: goal.amount,
    currency: goal.currency,
    target_date: goal.targetDate.toISOString(),
    bucket: goal.bucket,
    why_it_matters: goal.whyItMatters,
    priority: goal.priority,
    created_at: goal.createdAt.toISOString(),
    visibility: goal.visibility ?? 'private',
    space_id: goal.spaceId ?? null,
  };
}

export async function fetchGoals(): Promise<Goal[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[supabase] Failed to fetch goals:', error.message);
    return [];
  }

  return (data as GoalRow[]).map(rowToGoal);
}

export async function insertGoal(goal: Goal, userId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('goals')
    .insert(goalToRow(goal, userId));

  if (error) {
    console.error('[supabase] Failed to insert goal:', error.message);
    return false;
  }
  return true;
}

export async function deleteGoalRemote(goalId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);

  if (error) {
    console.error('[supabase] Failed to delete goal:', error.message);
    return false;
  }
  return true;
}

export async function updateGoalRemote(goal: Goal, userId: string): Promise<boolean> {
  const supabase = createClient();
  const row = goalToRow(goal, userId);
  const { error } = await supabase
    .from('goals')
    .update(row)
    .eq('id', goal.id);

  if (error) {
    console.error('[supabase] Failed to update goal:', error.message);
    return false;
  }
  return true;
}

export async function upsertGoals(goals: Goal[], userId: string): Promise<boolean> {
  if (goals.length === 0) return true;

  const supabase = createClient();
  const rows = goals.map((g) => goalToRow(g, userId));
  const { error } = await supabase
    .from('goals')
    .upsert(rows, { onConflict: 'id' });

  if (error) {
    console.error('[supabase] Failed to upsert goals:', error.message);
    return false;
  }
  return true;
}
