/**
 * Supabase CRUD operations for Shared Spaces, Memberships, and Invitations
 * Issue #65: Family/Group Goal Sharing
 */

import { createClient } from './browser';
import type {
  SharedSpace,
  SpaceMembership,
  SpaceInvitation,
  SpaceRole,
  InvitationStatus,
} from '@/types';

// =============================================================================
// Row interfaces (database shape)
// =============================================================================

interface SharedSpaceRow {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
}

interface SpaceMembershipRow {
  space_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

interface SpaceInvitationRow {
  id: string;
  space_id: string;
  invited_email: string;
  invited_by: string;
  token: string;
  status: string;
  created_at: string;
  expires_at: string;
}

// =============================================================================
// Row <-> Domain mappers
// =============================================================================

function rowToSpace(row: SharedSpaceRow): SharedSpace {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    ownerId: row.owner_id,
    createdAt: new Date(row.created_at),
  };
}

function rowToMembership(row: SpaceMembershipRow): SpaceMembership {
  return {
    spaceId: row.space_id,
    userId: row.user_id,
    role: row.role as SpaceRole,
    joinedAt: new Date(row.joined_at),
  };
}

function rowToInvitation(row: SpaceInvitationRow): SpaceInvitation {
  return {
    id: row.id,
    spaceId: row.space_id,
    invitedEmail: row.invited_email,
    invitedBy: row.invited_by,
    token: row.token,
    status: row.status as InvitationStatus,
    createdAt: new Date(row.created_at),
    expiresAt: new Date(row.expires_at),
  };
}

// =============================================================================
// Utility: generate a simple unique ID
// =============================================================================

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// =============================================================================
// Shared Spaces CRUD
// =============================================================================

/**
 * Fetch all spaces the current user belongs to (as owner or member)
 */
export async function fetchSpaces(): Promise<SharedSpace[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('shared_spaces')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[supabase] Failed to fetch spaces:', error.message);
    return [];
  }

  return (data as SharedSpaceRow[]).map(rowToSpace);
}

/**
 * Fetch a single space by ID
 */
export async function fetchSpaceById(spaceId: string): Promise<SharedSpace | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('shared_spaces')
    .select('*')
    .eq('id', spaceId)
    .single();

  if (error) {
    console.error('[supabase] Failed to fetch space:', error.message);
    return null;
  }

  return rowToSpace(data as SharedSpaceRow);
}

/**
 * Create a new shared space. The owner is automatically added as a member
 * via the database trigger `on_space_created`.
 */
export async function createSpace(
  name: string,
  description: string,
  ownerId: string
): Promise<SharedSpace | null> {
  const supabase = createClient();
  const id = generateId('space');
  const { data, error } = await supabase
    .from('shared_spaces')
    .insert({ id, name, description, owner_id: ownerId })
    .select()
    .single();

  if (error) {
    console.error('[supabase] Failed to create space:', error.message);
    return null;
  }

  return rowToSpace(data as SharedSpaceRow);
}

/**
 * Update a shared space name/description (owner only — enforced by RLS)
 */
export async function updateSpace(
  spaceId: string,
  updates: { name?: string; description?: string }
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('shared_spaces')
    .update(updates)
    .eq('id', spaceId);

  if (error) {
    console.error('[supabase] Failed to update space:', error.message);
    return false;
  }
  return true;
}

/**
 * Delete a shared space (owner only — enforced by RLS)
 */
export async function deleteSpace(spaceId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('shared_spaces')
    .delete()
    .eq('id', spaceId);

  if (error) {
    console.error('[supabase] Failed to delete space:', error.message);
    return false;
  }
  return true;
}

// =============================================================================
// Space Memberships
// =============================================================================

/**
 * Fetch all memberships for a given space
 */
export async function fetchMemberships(spaceId: string): Promise<SpaceMembership[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('space_memberships')
    .select('*')
    .eq('space_id', spaceId)
    .order('joined_at', { ascending: true });

  if (error) {
    console.error('[supabase] Failed to fetch memberships:', error.message);
    return [];
  }

  return (data as SpaceMembershipRow[]).map(rowToMembership);
}

/**
 * Remove a member from a space (owner can remove anyone; member removes self)
 */
export async function removeMember(spaceId: string, userId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('space_memberships')
    .delete()
    .eq('space_id', spaceId)
    .eq('user_id', userId);

  if (error) {
    console.error('[supabase] Failed to remove member:', error.message);
    return false;
  }
  return true;
}

// =============================================================================
// Invitations
// =============================================================================

/**
 * Fetch all pending invitations for a space
 */
export async function fetchInvitations(spaceId: string): Promise<SpaceInvitation[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('space_invitations')
    .select('*')
    .eq('space_id', spaceId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[supabase] Failed to fetch invitations:', error.message);
    return [];
  }

  return (data as SpaceInvitationRow[]).map(rowToInvitation);
}

/**
 * Create an invitation for a given email address to join a space.
 * Returns the invitation (including the shareable token).
 */
export async function createInvitation(
  spaceId: string,
  invitedEmail: string,
  invitedBy: string
): Promise<SpaceInvitation | null> {
  const supabase = createClient();
  const id = generateId('inv');
  const token = generateToken();

  const { data, error } = await supabase
    .from('space_invitations')
    .insert({
      id,
      space_id: spaceId,
      invited_email: invitedEmail.toLowerCase().trim(),
      invited_by: invitedBy,
      token,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('[supabase] Failed to create invitation:', error.message);
    return null;
  }

  return rowToInvitation(data as SpaceInvitationRow);
}

/**
 * Look up an invitation by its token (used on the join page — no auth required at DB level
 * but we verify status and expiry here)
 */
export async function fetchInvitationByToken(token: string): Promise<SpaceInvitation | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('space_invitations')
    .select('*')
    .eq('token', token)
    .single();

  if (error) {
    console.error('[supabase] Failed to fetch invitation by token:', error.message);
    return null;
  }

  return rowToInvitation(data as SpaceInvitationRow);
}

/**
 * Accept an invitation: update its status and add the user as a member.
 * Returns true on full success.
 */
export async function acceptInvitation(
  token: string,
  userId: string
): Promise<{ success: boolean; spaceId: string | null }> {
  const supabase = createClient();

  // 1. Fetch the invitation
  const invitation = await fetchInvitationByToken(token);
  if (!invitation) return { success: false, spaceId: null };

  if (invitation.status !== 'pending') {
    console.error('[supabase] Invitation is not pending:', invitation.status);
    return { success: false, spaceId: null };
  }

  if (new Date() > invitation.expiresAt) {
    // Mark as expired
    await supabase
      .from('space_invitations')
      .update({ status: 'expired' })
      .eq('id', invitation.id);
    return { success: false, spaceId: null };
  }

  // 2. Add user as member
  const { error: memberError } = await supabase
    .from('space_memberships')
    .insert({ space_id: invitation.spaceId, user_id: userId, role: 'member' });

  if (memberError && memberError.code !== '23505') {
    // 23505 = unique_violation (already a member)
    console.error('[supabase] Failed to add member:', memberError.message);
    return { success: false, spaceId: null };
  }

  // 3. Mark invitation as accepted
  const { error: updateError } = await supabase
    .from('space_invitations')
    .update({ status: 'accepted' })
    .eq('id', invitation.id);

  if (updateError) {
    console.error('[supabase] Failed to update invitation status:', updateError.message);
    // Membership was added — still a partial success
  }

  return { success: true, spaceId: invitation.spaceId };
}

/**
 * Revoke / delete an invitation (owner or inviter only)
 */
export async function revokeInvitation(invitationId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('space_invitations')
    .update({ status: 'declined' })
    .eq('id', invitationId);

  if (error) {
    console.error('[supabase] Failed to revoke invitation:', error.message);
    return false;
  }
  return true;
}
