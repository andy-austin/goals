-- Migration 002: Family/Group Goal Sharing with Public/Private Visibility
-- Issue #65

-- ============================================================
-- 1. Create shared_spaces table (must exist before goals FK)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.shared_spaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shared_spaces_owner_id_idx ON public.shared_spaces(owner_id);

ALTER TABLE public.shared_spaces ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. Create space_memberships table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.space_memberships (
  space_id TEXT NOT NULL REFERENCES public.shared_spaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (space_id, user_id)
);

CREATE INDEX IF NOT EXISTS space_memberships_user_id_idx ON public.space_memberships(user_id);
CREATE INDEX IF NOT EXISTS space_memberships_space_id_idx ON public.space_memberships(space_id);

ALTER TABLE public.space_memberships ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. Create space_invitations table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.space_invitations (
  id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES public.shared_spaces(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

CREATE INDEX IF NOT EXISTS space_invitations_space_id_idx ON public.space_invitations(space_id);
CREATE INDEX IF NOT EXISTS space_invitations_token_idx ON public.space_invitations(token);
CREATE INDEX IF NOT EXISTS space_invitations_email_idx ON public.space_invitations(invited_email);

ALTER TABLE public.space_invitations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. Add visibility and space_id columns to goals table
-- ============================================================
ALTER TABLE public.goals
  ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'private'
    CHECK (visibility IN ('private', 'shared')),
  ADD COLUMN IF NOT EXISTS space_id TEXT REFERENCES public.shared_spaces(id) ON DELETE SET NULL;

-- ============================================================
-- RLS POLICIES: shared_spaces
-- ============================================================

-- Members can read spaces they belong to (as owner or member)
CREATE POLICY "Members can read their spaces" ON public.shared_spaces
  FOR SELECT USING (
    auth.uid() = owner_id
    OR EXISTS (
      SELECT 1 FROM public.space_memberships
      WHERE space_memberships.space_id = shared_spaces.id
        AND space_memberships.user_id = auth.uid()
    )
  );

-- Authenticated users can create spaces (must set themselves as owner)
CREATE POLICY "Authenticated users can create spaces" ON public.shared_spaces
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Only owners can update their spaces
CREATE POLICY "Owners can update their spaces" ON public.shared_spaces
  FOR UPDATE USING (auth.uid() = owner_id);

-- Only owners can delete their spaces
CREATE POLICY "Owners can delete their spaces" ON public.shared_spaces
  FOR DELETE USING (auth.uid() = owner_id);

-- ============================================================
-- RLS POLICIES: space_memberships
-- ============================================================

-- Members can see who is in spaces they belong to
CREATE POLICY "Members can read space memberships" ON public.space_memberships
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.space_memberships sm2
      WHERE sm2.space_id = space_memberships.space_id
        AND sm2.user_id = auth.uid()
    )
  );

-- Users can insert their own membership (via invitation acceptance flow)
CREATE POLICY "Users can join spaces" ON public.space_memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Owners can remove any member; members can remove themselves
CREATE POLICY "Owners and members can remove memberships" ON public.space_memberships
  FOR DELETE USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.shared_spaces
      WHERE shared_spaces.id = space_memberships.space_id
        AND shared_spaces.owner_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES: space_invitations
-- ============================================================

-- Space members can read invitations for their spaces; inviter can also read
CREATE POLICY "Space members can read invitations" ON public.space_invitations
  FOR SELECT USING (
    auth.uid() = invited_by
    OR EXISTS (
      SELECT 1 FROM public.space_memberships
      WHERE space_memberships.space_id = space_invitations.space_id
        AND space_memberships.user_id = auth.uid()
    )
  );

-- Space members can create invitations
CREATE POLICY "Space members can create invitations" ON public.space_invitations
  FOR INSERT WITH CHECK (
    auth.uid() = invited_by
    AND EXISTS (
      SELECT 1 FROM public.space_memberships
      WHERE space_memberships.space_id = space_invitations.space_id
        AND space_memberships.user_id = auth.uid()
    )
  );

-- Inviter or space members can update invitation status
CREATE POLICY "Update invitation status" ON public.space_invitations
  FOR UPDATE USING (
    auth.uid() = invited_by
    OR EXISTS (
      SELECT 1 FROM public.space_memberships
      WHERE space_memberships.space_id = space_invitations.space_id
        AND space_memberships.user_id = auth.uid()
    )
  );

-- ============================================================
-- RLS POLICIES: goals (updated to allow space members to see shared goals)
-- ============================================================

-- Drop existing SELECT policy and recreate with space awareness
DROP POLICY IF EXISTS "Users can read own goals" ON public.goals;

-- Users can read their own goals OR shared goals in spaces they belong to
CREATE POLICY "Users can read own and shared goals" ON public.goals
  FOR SELECT USING (
    auth.uid() = user_id
    OR (
      visibility = 'shared'
      AND space_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.space_memberships
        WHERE space_memberships.space_id = goals.space_id
          AND space_memberships.user_id = auth.uid()
      )
    )
  );

-- Drop and recreate INSERT policy to validate space membership
DROP POLICY IF EXISTS "Users can insert own goals" ON public.goals;

CREATE POLICY "Users can insert own goals" ON public.goals
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND (
      space_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.space_memberships
        WHERE space_memberships.space_id = goals.space_id
          AND space_memberships.user_id = auth.uid()
      )
    )
  );

-- ============================================================
-- Trigger: auto-add space owner as member on space creation
-- ============================================================
CREATE OR REPLACE FUNCTION public.add_owner_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.space_memberships (space_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner')
  ON CONFLICT (space_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_space_created
  AFTER INSERT ON public.shared_spaces
  FOR EACH ROW EXECUTE FUNCTION public.add_owner_as_member();
