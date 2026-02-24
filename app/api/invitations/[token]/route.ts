import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

/**
 * GET /api/invitations/[token]
 *
 * Public endpoint that returns limited invitation details so the join page
 * can show a preview to both authenticated and unauthenticated users.
 * Uses the server-side Supabase client which bypasses RLS.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Fetch invitation with the space name via a join
  const { data, error } = await supabase
    .from('space_invitations')
    .select('id, space_id, invited_email, invited_by, token, status, created_at, expires_at, shared_spaces(name)')
    .eq('token', token)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
  }

  // Return only the fields the join page needs — no sensitive data
  const spaces = data.shared_spaces as { name: string }[] | { name: string } | null;
  const spaceName = Array.isArray(spaces) ? spaces[0]?.name ?? null : spaces?.name ?? null;

  return NextResponse.json({
    id: data.id,
    spaceId: data.space_id,
    invitedEmail: data.invited_email,
    invitedBy: data.invited_by,
    token: data.token,
    status: data.status,
    createdAt: data.created_at,
    expiresAt: data.expires_at,
    spaceName,
  });
}
