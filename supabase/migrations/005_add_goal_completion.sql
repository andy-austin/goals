-- Migration 005: Add goal completion support
-- Adds status and completed_at fields to the goals table

ALTER TABLE goals ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE goals ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- Add check constraint for valid status values
ALTER TABLE goals ADD CONSTRAINT goals_status_check CHECK (status IN ('active', 'completed'));
