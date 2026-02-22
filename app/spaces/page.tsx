'use client';

/**
 * /spaces — List all shared spaces the user belongs to (Issue #65)
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSpaces } from '@/context';
import { useAuth } from '@/context';
import { Button } from '@/components/ui/Button';
import { SpaceCard } from '@/components/Spaces/SpaceCard';
import { CreateSpaceModal } from '@/components/Spaces/CreateSpaceModal';

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const UsersGroupIcon = () => (
  <svg className="w-12 h-12 text-muted-foreground/40 block mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default function SpacesPage() {
  const { user } = useAuth();
  const { spaces, loading, createSpace } = useSpaces();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <UsersGroupIcon />
        <h2 className="mt-4 text-xl font-semibold text-foreground">Sign in to use Shared Spaces</h2>
        <p className="mt-2 text-muted-foreground mb-6">
          Shared Spaces let you collaborate on financial goals with family or a group.
        </p>
        <Button onClick={() => router.push('/auth/login')}>Sign In</Button>
      </div>
    );
  }

  async function handleCreateSpace(name: string, description: string): Promise<boolean> {
    const space = await createSpace(name, description);
    return space !== null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Shared Spaces</h1>
          <p className="mt-1 text-muted-foreground">
            Collaborate on financial goals with family or a group
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 self-start sm:self-auto">
          <PlusIcon />
          New Space
        </Button>
      </div>

      {/* Spaces list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-secondary animate-pulse" />
          ))}
        </div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <UsersGroupIcon />
          <h2 className="mt-4 text-lg font-semibold text-foreground">No spaces yet</h2>
          <p className="mt-2 text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Create a space to collaborate on shared financial goals with your family or group.
          </p>
          <Button onClick={() => setShowCreateModal(true)} variant="secondary">
            Create Your First Space
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              space={space}
              isOwner={space.ownerId === user.id}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateSpaceModal
          onCreateSpace={handleCreateSpace}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
