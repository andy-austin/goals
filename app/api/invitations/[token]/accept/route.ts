import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

/**
 * POST /api/invitations/[token]/accept
 *
 * Accept a space invitation. Requires an authenticated user.
 * Uses the service role client to read/update the invitation (RLS blocks
 * invitees from reading invitations since they're not yet space members).
 * Uses the session client to insert the membership (RLS allows users to
 * insert their own membership row).
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  // Verify the user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const service = createServiceClient();

  // 1. Fetch invitation (service client bypasses RLS)
  const { data: inv, error: fetchError } = await service
    .from('space_invitations')
    .select('id, space_id, status, expires_at')
    .eq('token', token)
    .single();

  if (fetchError || !inv) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
  }

  if (inv.status !== 'pending') {
    return NextResponse.json({ error: 'Invitation is no longer pending', status: inv.status }, { status: 400 });
  }

  if (new Date() > new Date(inv.expires_at)) {
    // Mark as expired
    await service
      .from('space_invitations')
      .update({ status: 'expired' })
      .eq('id', inv.id);
    return NextResponse.json({ error: 'Invitation has expired' }, { status: 400 });
  }

  // 2. Add user as member (use session client — RLS allows self-insert)
  const { error: memberError } = await supabase
    .from('space_memberships')
    .insert({ space_id: inv.space_id, user_id: user.id, role: 'member' });

  if (memberError && memberError.code !== '23505') {
    // 23505 = unique_violation (already a member)
    return NextResponse.json({ error: 'Failed to join space' }, { status: 500 });
  }

  // 3. Mark invitation as accepted (service client — RLS blocks invitee)
  await service
    .from('space_invitations')
    .update({ status: 'accepted' })
    .eq('id', inv.id);

  return NextResponse.json({ success: true, spaceId: inv.space_id });
}
