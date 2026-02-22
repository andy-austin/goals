'use client';

/**
 * MembersList — displays space members with remove actions (Issue #65)
 */

import { useState } from 'react';
import type { SpaceMembership } from '@/types';
import { Button } from '@/components/ui/Button';

interface MembersListProps {
  memberships: SpaceMembership[];
  currentUserId: string;
  isOwner: boolean;
  onRemoveMember: (userId: string) => Promise<boolean>;
}

const CrownIcon = () => (
  <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.7-2h8.6l1.1-6-3.4 3.7-2.3-3.9-2.3 3.9-3.4-3.7 1.7 6z"/>
  </svg>
);

const UserIcon = () => (
  <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

interface MemberRowProps {
  membership: SpaceMembership;
  isSelf: boolean;
  canRemove: boolean;
  onRemove: (userId: string) => void;
  removing: boolean;
}

function MemberRow({ membership, isSelf, canRemove, onRemove, removing }: MemberRowProps) {
  const initials = (membership.displayName ?? membership.userId)
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 py-2.5">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground flex-shrink-0">
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground truncate">
            {membership.displayName ?? `User ${membership.userId.slice(0, 8)}`}
          </span>
          {isSelf && <span className="text-xs text-muted-foreground">(you)</span>}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {membership.role === 'owner' ? <CrownIcon /> : <UserIcon />}
          <span className="capitalize">{membership.role}</span>
        </div>
      </div>

      {/* Remove button */}
      {canRemove && (
        <Button
          variant="ghost"
          size="sm"
          disabled={removing}
          onClick={() => onRemove(membership.userId)}
          className="text-muted-foreground hover:text-error hover:bg-error/10"
        >
          {isSelf ? 'Leave' : 'Remove'}
        </Button>
      )}
    </div>
  );
}

export function MembersList({
  memberships,
  currentUserId,
  isOwner,
  onRemoveMember,
}: MembersListProps) {
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleRemove(userId: string) {
    setRemovingId(userId);
    await onRemoveMember(userId);
    setRemovingId(null);
  }

  if (memberships.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">No members yet.</p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {memberships.map((membership) => {
        const isSelf = membership.userId === currentUserId;
        const isOwnerRow = membership.role === 'owner';
        // Owner can remove non-owner members; members can leave (remove themselves)
        const canRemove = (isOwner && !isOwnerRow) || (isSelf && !isOwner);

        return (
          <MemberRow
            key={membership.userId}
            membership={membership}
            isSelf={isSelf}
            canRemove={canRemove}
            onRemove={handleRemove}
            removing={removingId === membership.userId}
          />
        );
      })}
    </div>
  );
}
