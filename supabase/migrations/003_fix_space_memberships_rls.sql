-- Fix infinite recursion in space_memberships RLS policy.
--
-- The "Members can read space memberships" SELECT policy contained an EXISTS
-- subquery on space_memberships itself, causing Postgres to recurse infinitely.
-- The solution is a SECURITY DEFINER helper function that runs as the owner
-- (bypassing RLS) so the self-referential check doesn't re-trigger the policy.

-- Helper function: check membership without triggering RLS
CREATE OR REPLACE FUNCTION public.is_space_member(p_space_id TEXT, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.space_memberships
    WHERE space_id = p_space_id
      AND user_id = p_user_id
  );
$$;

-- Replace the recursive policy
DROP POLICY IF EXISTS "Members can read space memberships" ON public.space_memberships;

CREATE POLICY "Members can read space memberships" ON public.space_memberships
  FOR SELECT USING (
    auth.uid() = user_id
    OR public.is_space_member(space_memberships.space_id, auth.uid())
  );
