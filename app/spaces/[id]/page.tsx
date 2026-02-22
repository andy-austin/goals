'use client';

/**
 * /spaces/[id] — Shared space detail: members, goals, and invitations (Issue #65)
 */

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSpaces } from '@/context';
import { useAuth } from '@/context';
import { useGoals } from '@/context';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MembersList } from '@/components/Spaces/MembersList';
import { InviteMemberModal } from '@/components/Spaces/InviteMemberModal';
import type { SpaceMembership, SpaceInvitation, SharedSpace } from '@/types';
import { formatCurrency } from '@/types';

interface PageParams {
  id: string;
}

const ChevronLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function SpaceDetailPage({ params }: { params: Promise<PageParams> }) {
  const { id } = use(params);
  const t = useTranslations('spaces');
  const tCommon = useTranslations('common');
  const { user } = useAuth();
  const { spaces, getMemberships, getInvitations, inviteMember, removeMember, leaveSpace, deleteSpace } = useSpaces();
  const { goals } = useGoals();
  const router = useRouter();

  const [space, setSpace] = useState<SharedSpace | null>(null);
  const [memberships, setMemberships] = useState<SpaceMembership[]>([]);
  const [invitations, setInvitations] = useState<SpaceInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const isOwner = space?.ownerId === user?.id;
  const spaceGoals = goals.filter((g) => g.spaceId === id && g.visibility === 'shared');

  useEffect(() => {
    const found = spaces.find((s) => s.id === id) ?? null;
    setSpace(found);
  }, [spaces, id]);

  useEffect(() => {
    if (!space) return;
    let cancelled = false;

    async function loadDetails() {
      setLoading(true);
      const [m, inv] = await Promise.all([getMemberships(id), getInvitations(id)]);
      if (!cancelled) {
        setMemberships(m);
        setInvitations(inv.filter((i) => i.status === 'pending'));
        setLoading(false);
      }
    }

    loadDetails();
    return () => { cancelled = true; };
  }, [space, id, getMemberships, getInvitations]);

  async function handleRemoveMember(userId: string): Promise<boolean> {
    const isSelf = userId === user?.id;
    if (isSelf) {
      const ok = await leaveSpace(id);
      if (ok) router.push('/spaces');
      return ok;
    }
    const ok = await removeMember(id, userId);
    if (ok) setMemberships((prev) => prev.filter((m) => m.userId !== userId));
    return ok;
  }

  async function handleInvite(email: string): Promise<{ token: string } | null> {
    if (!space) return null;
    const invitation = await inviteMember(space.id, email);
    if (invitation) {
      setInvitations((prev) => [...prev, invitation]);
    }
    return invitation ? { token: invitation.token } : null;
  }

  async function handleDeleteSpace() {
    const ok = await deleteSpace(id);
    if (ok) router.push('/spaces');
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-muted-foreground">{t('signInToView')}</p>
        <Button className="mt-4" onClick={() => router.push('/auth/login')}>{t('signIn')}</Button>
      </div>
    );
  }

  if (!loading && !space) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-muted-foreground mb-4">{t('spaceNotFound')}</p>
        <Link href="/spaces">
          <Button variant="secondary">{t('backToSpaces')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Back */}
      <Link
        href="/spaces"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeftIcon />
        {t('allSpaces')}
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl flex-shrink-0">
            {space?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{space?.name}</h1>
              {isOwner && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {t('owner')}
                </span>
              )}
            </div>
            {space?.description && (
              <p className="text-muted-foreground mt-0.5">{space.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1.5"
          >
            <PlusIcon />
            {t('invite')}
          </Button>
          {isOwner && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteConfirm(true)}
              className="flex items-center gap-1.5"
            >
              <TrashIcon />
              {t('deleteSpace')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Shared Goals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('sharedGoalsTitle')}</CardTitle>
              <Badge variant="secondary">{spaceGoals.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {spaceGoals.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">
                  {t('noSharedGoals')}
                </p>
                <Link href="/create">
                  <Button size="sm" variant="secondary">{t('createGoal')}</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {spaceGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between py-2 px-1 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{goal.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{goal.bucket}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(goal.amount, goal.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('membersTitle')}</CardTitle>
              <Badge variant="secondary">{memberships.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-12 rounded-md bg-secondary animate-pulse" />
                ))}
              </div>
            ) : (
              <MembersList
                memberships={memberships}
                currentUserId={user.id}
                isOwner={isOwner}
                onRemoveMember={handleRemoveMember}
              />
            )}
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('pendingInvitations')}</CardTitle>
                <Badge variant="warning">{invitations.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between py-2 px-1 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm text-foreground">{inv.invitedEmail}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('expiresOn', { date: inv.expiresAt.toLocaleDateString() })}
                      </p>
                    </div>
                    <Badge variant="warning">{t('pending')}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && space && (
        <InviteMemberModal
          spaceName={space.name}
          onInvite={handleInvite}
          onClose={() => setShowInviteModal(false)}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background border border-border rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('deleteConfirmTitle')}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t('deleteConfirmSharedGoals', { name: space?.name ?? '' })}
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDeleteConfirm(false)}>
                {tCommon('cancel')}
              </Button>
              <Button variant="destructive" onClick={handleDeleteSpace}>
                {tCommon('delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
