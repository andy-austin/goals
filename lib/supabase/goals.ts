import { createClient } from './browser';
import type { Goal, Bucket, Currency, GoalVisibility, TrackingCadence, InvestmentVehicle, CheckIn } from '@/types';

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
  investment_vehicle_name: string | null;
  investment_vehicle_institution: string | null;
  investment_vehicle_type: string | null;
  tracking_cadence: string | null;
}

interface CheckInRow {
  id: string;
  goal_id: string;
  user_id: string;
  date: string;
  current_amount: number;
  note: string | null;
  created_at: string;
}

function rowToGoal(row: GoalRow, checkIns: CheckIn[] = []): Goal {
  let investmentVehicle: InvestmentVehicle | undefined;
  if (row.investment_vehicle_name) {
    investmentVehicle = {
      name: row.investment_vehicle_name,
      institution: row.investment_vehicle_institution ?? undefined,
      type: row.investment_vehicle_type ?? undefined,
    };
  }

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
    investmentVehicle,
    trackingCadence: (row.tracking_cadence as TrackingCadence) ?? undefined,
    checkIns,
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
    investment_vehicle_name: goal.investmentVehicle?.name ?? null,
    investment_vehicle_institution: goal.investmentVehicle?.institution ?? null,
    investment_vehicle_type: goal.investmentVehicle?.type ?? null,
    tracking_cadence: goal.trackingCadence ?? null,
  };
}

function rowToCheckIn(row: CheckInRow): CheckIn {
  return {
    id: row.id,
    date: row.date,
    currentAmount: Number(row.current_amount),
    note: row.note ?? undefined,
    createdAt: row.created_at,
  };
}

export async function fetchGoals(): Promise<Goal[]> {
  const supabase = createClient();

  const [goalsResult, checkInsResult] = await Promise.all([
    supabase.from('goals').select('*').order('created_at', { ascending: true }),
    supabase.from('goal_check_ins').select('*').order('date', { ascending: true }),
  ]);

  if (goalsResult.error) {
    console.error('[supabase] Failed to fetch goals:', goalsResult.error.message);
    return [];
  }

  // Group check-ins by goal_id
  const checkInsByGoalId = new Map<string, CheckIn[]>();
  if (!checkInsResult.error && checkInsResult.data) {
    for (const row of checkInsResult.data as CheckInRow[]) {
      const checkIn = rowToCheckIn(row);
      const list = checkInsByGoalId.get(row.goal_id) ?? [];
      list.push(checkIn);
      checkInsByGoalId.set(row.goal_id, list);
    }
  }

  return (goalsResult.data as GoalRow[]).map((row) =>
    rowToGoal(row, checkInsByGoalId.get(row.id) ?? [])
  );
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

export async function insertCheckInRemote(
  goalId: string,
  checkIn: CheckIn,
  userId: string
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from('goal_check_ins').insert({
    id: checkIn.id,
    goal_id: goalId,
    user_id: userId,
    date: checkIn.date,
    current_amount: checkIn.currentAmount,
    note: checkIn.note ?? null,
    created_at: checkIn.createdAt,
  });

  if (error) {
    console.error('[supabase] Failed to insert check-in:', error.message);
    return false;
  }
  return true;
}

export async function deleteCheckInRemote(checkInId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('goal_check_ins')
    .delete()
    .eq('id', checkInId);

  if (error) {
    console.error('[supabase] Failed to delete check-in:', error.message);
    return false;
  }
  return true;
}
