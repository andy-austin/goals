'use client';

/**
 * SpacesContext — state management for shared spaces (Issue #65)
 *
 * Provides:
 * - List of spaces the current user belongs to
 * - CRUD operations for spaces, memberships, and invitations
 * - Active space selection for cross-page context
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import type {
  SharedSpace,
  SpaceMembership,
  SpaceInvitation,
} from '@/types';
import { useAuth } from './AuthContext';
import {
  fetchSpaces,
  createSpace as createSpaceRemote,
  updateSpace as updateSpaceRemote,
  deleteSpace as deleteSpaceRemote,
  fetchMemberships,
  removeMember as removeMemberRemote,
  fetchInvitations,
  createInvitation as createInvitationRemote,
  revokeInvitation as revokeInvitationRemote,
} from '@/lib/supabase/spaces';

// =============================================================================
// Types
// =============================================================================

interface SpacesContextValue {
  /** All spaces the user belongs to */
  spaces: SharedSpace[];
  /** Whether spaces are loading */
  loading: boolean;

  /** Create a new shared space */
  createSpace: (name: string, description: string) => Promise<SharedSpace | null>;
  /** Update a space's name/description */
  updateSpace: (spaceId: string, updates: { name?: string; description?: string }) => Promise<boolean>;
  /** Delete a space (owner only) */
  deleteSpace: (spaceId: string) => Promise<boolean>;
  /** Reload spaces from the server */
  refreshSpaces: () => Promise<void>;

  /** Fetch memberships for a space */
  getMemberships: (spaceId: string) => Promise<SpaceMembership[]>;
  /** Remove a member from a space */
  removeMember: (spaceId: string, userId: string) => Promise<boolean>;
  /** Leave a space (current user removes themselves) */
  leaveSpace: (spaceId: string) => Promise<boolean>;

  /** Fetch invitations for a space */
  getInvitations: (spaceId: string) => Promise<SpaceInvitation[]>;
  /** Invite someone by email */
  inviteMember: (spaceId: string, email: string) => Promise<SpaceInvitation | null>;
  /** Revoke an invitation */
  revokeInvitation: (invitationId: string) => Promise<boolean>;
  /** Accept an invitation by token */
  acceptInvitation: (token: string) => Promise<{ success: boolean; spaceId: string | null }>;
}

// =============================================================================
// Context
// =============================================================================

const SpacesContext = createContext<SpacesContextValue | null>(null);

// =============================================================================
// Provider
// =============================================================================

interface SpacesProviderProps {
  children: ReactNode;
}

export function SpacesProvider({ children }: SpacesProviderProps) {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState<SharedSpace[]>([]);
  const [loading, setLoading] = useState(false);

  // Load spaces when user changes
  useEffect(() => {
    if (!user) {
      setSpaces([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      const fetched = await fetchSpaces();
      if (!cancelled) {
        setSpaces(fetched);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [user]);

  const refreshSpaces = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const fetched = await fetchSpaces();
    setSpaces(fetched);
    setLoading(false);
  }, [user]);

  const createSpace = useCallback(async (
    name: string,
    description: string
  ): Promise<SharedSpace | null> => {
    if (!user) return null;
    const space = await createSpaceRemote(name, description, user.id);
    if (space) {
      setSpaces((prev) => [...prev, space]);
    }
    return space;
  }, [user]);

  const updateSpace = useCallback(async (
    spaceId: string,
    updates: { name?: string; description?: string }
  ): Promise<boolean> => {
    const ok = await updateSpaceRemote(spaceId, updates);
    if (ok) {
      setSpaces((prev) =>
        prev.map((s) => s.id === spaceId ? { ...s, ...updates } : s)
      );
    }
    return ok;
  }, []);

  const deleteSpace = useCallback(async (spaceId: string): Promise<boolean> => {
    const ok = await deleteSpaceRemote(spaceId);
    if (ok) {
      setSpaces((prev) => prev.filter((s) => s.id !== spaceId));
    }
    return ok;
  }, []);

  const getMemberships = useCallback(async (spaceId: string): Promise<SpaceMembership[]> => {
    return fetchMemberships(spaceId);
  }, []);

  const removeMember = useCallback(async (
    spaceId: string,
    userId: string
  ): Promise<boolean> => {
    return removeMemberRemote(spaceId, userId);
  }, []);

  const leaveSpace = useCallback(async (spaceId: string): Promise<boolean> => {
    if (!user) return false;
    const ok = await removeMemberRemote(spaceId, user.id);
    if (ok) {
      setSpaces((prev) => prev.filter((s) => s.id !== spaceId));
    }
    return ok;
  }, [user]);

  const getInvitations = useCallback(async (spaceId: string): Promise<SpaceInvitation[]> => {
    return fetchInvitations(spaceId);
  }, []);

  const inviteMember = useCallback(async (
    spaceId: string,
    email: string
  ): Promise<SpaceInvitation | null> => {
    if (!user) return null;
    return createInvitationRemote(spaceId, email, user.id);
  }, [user]);

  const revokeInvitation = useCallback(async (invitationId: string): Promise<boolean> => {
    return revokeInvitationRemote(invitationId);
  }, []);

  const acceptInvitation = useCallback(async (
    token: string
  ): Promise<{ success: boolean; spaceId: string | null }> => {
    if (!user) return { success: false, spaceId: null };
    try {
      const res = await fetch(`/api/invitations/${encodeURIComponent(token)}/accept`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        await refreshSpaces();
        return { success: true, spaceId: data.spaceId };
      }
      return { success: false, spaceId: null };
    } catch {
      return { success: false, spaceId: null };
    }
  }, [user, refreshSpaces]);

  const value: SpacesContextValue = useMemo(() => ({
    spaces,
    loading,
    createSpace,
    updateSpace,
    deleteSpace,
    refreshSpaces,
    getMemberships,
    removeMember,
    leaveSpace,
    getInvitations,
    inviteMember,
    revokeInvitation,
    acceptInvitation,
  }), [
    spaces,
    loading,
    createSpace,
    updateSpace,
    deleteSpace,
    refreshSpaces,
    getMemberships,
    removeMember,
    leaveSpace,
    getInvitations,
    inviteMember,
    revokeInvitation,
    acceptInvitation,
  ]);

  return (
    <SpacesContext.Provider value={value}>
      {children}
    </SpacesContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useSpaces(): SpacesContextValue {
  const context = useContext(SpacesContext);
  if (!context) {
    throw new Error('useSpaces must be used within a SpacesProvider');
  }
  return context;
}
