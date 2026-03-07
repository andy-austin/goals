-- Migration: Allow space members to read/insert check-ins on shared goals
-- Run this after 005_add_goal_completion.sql

-- Drop the old blanket policy
DROP POLICY IF EXISTS "Users can manage their own check-ins" ON goal_check_ins;

-- 1. Users can always SELECT their own check-ins,
--    AND check-ins on shared goals in spaces they belong to.
CREATE POLICY "Users can read own and shared check-ins"
  ON goal_check_ins
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1
      FROM goals g
      JOIN space_memberships sm ON sm.space_id = g.space_id
      WHERE g.id = goal_check_ins.goal_id
        AND g.visibility = 'shared'
        AND g.space_id IS NOT NULL
        AND sm.user_id = auth.uid()
    )
  );

-- 2. Users can INSERT check-ins on their own goals,
--    AND on shared goals in spaces they belong to.
CREATE POLICY "Users can insert own and shared check-ins"
  ON goal_check_ins
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      -- Own goal
      EXISTS (
        SELECT 1 FROM goals WHERE goals.id = goal_check_ins.goal_id AND goals.user_id = auth.uid()
      )
      OR
      -- Shared goal in a space the user belongs to
      EXISTS (
        SELECT 1
        FROM goals g
        JOIN space_memberships sm ON sm.space_id = g.space_id
        WHERE g.id = goal_check_ins.goal_id
          AND g.visibility = 'shared'
          AND g.space_id IS NOT NULL
          AND sm.user_id = auth.uid()
      )
    )
  );

-- 3. Users can only UPDATE their own check-ins.
CREATE POLICY "Users can update own check-ins"
  ON goal_check_ins
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Users can only DELETE their own check-ins.
CREATE POLICY "Users can delete own check-ins"
  ON goal_check_ins
  FOR DELETE
  USING (auth.uid() = user_id);
