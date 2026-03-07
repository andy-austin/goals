-- Migration: Add email column to space_memberships
-- This allows displaying member names instead of truncated user IDs

ALTER TABLE space_memberships ADD COLUMN IF NOT EXISTS email text;

-- Populate existing memberships from invitations where possible
UPDATE space_memberships sm
SET email = si.invited_email
FROM space_invitations si
WHERE si.space_id = sm.space_id
  AND si.status = 'accepted'
  AND sm.email IS NULL;
