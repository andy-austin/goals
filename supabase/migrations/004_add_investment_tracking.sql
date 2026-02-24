-- Migration: Add investment vehicle tracking and check-ins (Issue #66)
-- Run this after 003_fix_space_memberships_rls.sql

-- Add investment vehicle columns to goals table
ALTER TABLE goals
  ADD COLUMN IF NOT EXISTS investment_vehicle_name text,
  ADD COLUMN IF NOT EXISTS investment_vehicle_institution text,
  ADD COLUMN IF NOT EXISTS investment_vehicle_type text,
  ADD COLUMN IF NOT EXISTS tracking_cadence text;

-- Create goal_check_ins table
CREATE TABLE IF NOT EXISTS goal_check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  current_amount numeric(15, 2) NOT NULL,
  note text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on goal_check_ins
ALTER TABLE goal_check_ins ENABLE ROW LEVEL SECURITY;

-- Users can only access their own check-ins
CREATE POLICY "Users can manage their own check-ins"
  ON goal_check_ins
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for fast look-up by goal
CREATE INDEX IF NOT EXISTS idx_goal_check_ins_goal_id ON goal_check_ins(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_check_ins_user_id ON goal_check_ins(user_id);
