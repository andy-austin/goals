'use client';

/**
 * /spaces/join/[token] — Accept a shared space invitation (Issue #65)
 */

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context';
import { useSpaces } from '@/context';
import { Button } from '@/components/ui/Button';
import { fetchInvitationByToken } from '@/lib/supabase/spaces';
import type { SpaceInvitation } from '@/types';

interface PageParams {
  token: string;
}

const CheckCircleIcon = () => (
  <svg className="w-16 h-16 text-success block mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-16 h-16 text-error block mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-16 h-16 text-warning block mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

type PageState = 'loading' | 'preview' | 'success' | 'error' | 'expired' | 'login-required';

export default function JoinSpacePage({ params }: { params: Promise<PageParams> }) {
  const { token } = use(params);
  const { user } = useAuth();
  const { acceptInvitation } = useSpaces();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [invitation, setInvitation] = useState<SpaceInvitation | null>(null);
  const [joinedSpaceId, setJoinedSpaceId] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  // Fetch invitation details to show a preview
  useEffect(() => {
    let cancelled = false;

    async function fetchDetails() {
      const inv = await fetchInvitationByToken(token);

      if (cancelled) return;

      if (!inv) {
        // If the user isn't logged in, RLS may have blocked the lookup.
        // Prompt them to sign in first rather than showing a generic error.
        setPageState(user ? 'error' : 'login-required');
        return;
      }

      if (inv.status === 'expired' || new Date() > inv.expiresAt) {
        setInvitation(inv);
        setPageState('expired');
        return;
      }

      if (inv.status === 'accepted') {
        setInvitation(inv);
        setPageState('success');
        setJoinedSpaceId(inv.spaceId);
        return;
      }

      setInvitation(inv);
      setPageState(user ? 'preview' : 'login-required');
    }

    fetchDetails();
    return () => { cancelled = true; };
  }, [token, user]);

  async function handleAccept() {
    if (!user) {
      router.push(`/auth/login?redirect=/spaces/join/${token}`);
      return;
    }

    setJoining(true);
    const result = await acceptInvitation(token);
    setJoining(false);

    if (result.success) {
      setJoinedSpaceId(result.spaceId);
      setPageState('success');
    } else {
      setPageState('error');
    }
  }

  if (pageState === 'loading') {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary animate-pulse mx-auto mb-4" />
        <p className="text-muted-foreground">Loading invitation…</p>
      </div>
    );
  }

  if (pageState === 'login-required') {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-4xl">
          {invitation?.invitedEmail?.charAt(0)?.toUpperCase() ?? '?'}
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">You&apos;ve been invited!</h1>
        <p className="text-muted-foreground mb-8">
          Sign in or create an account to join this shared space and collaborate on financial goals.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={() => router.push(`/auth/login?redirect=/spaces/join/${token}`)}>
            Sign In
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push(`/auth/signup?redirect=/spaces/join/${token}`)}
          >
            Create Account
          </Button>
        </div>
      </div>
    );
  }

  if (pageState === 'preview') {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Join Shared Space</h1>
        <p className="text-muted-foreground mb-2">
          You&apos;ve been invited to collaborate on shared financial goals.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Invitation sent to <strong>{invitation?.invitedEmail}</strong>
          &nbsp;&middot;&nbsp; Expires {invitation?.expiresAt.toLocaleDateString()}
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={handleAccept} disabled={joining}>
            {joining ? 'Joining…' : 'Accept Invitation'}
          </Button>
          <Link href="/dashboard">
            <Button variant="secondary" className="w-full">Decline</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (pageState === 'success') {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <CheckCircleIcon />
        <h1 className="mt-4 text-2xl font-bold text-foreground mb-2">You&apos;re in!</h1>
        <p className="text-muted-foreground mb-8">
          You&apos;ve successfully joined the shared space. You can now collaborate on goals together.
        </p>
        <div className="flex flex-col gap-3">
          {joinedSpaceId && (
            <Link href={`/spaces/${joinedSpaceId}`}>
              <Button className="w-full">View Space</Button>
            </Link>
          )}
          <Link href="/spaces">
            <Button variant="secondary" className="w-full">All Spaces</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (pageState === 'expired') {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <ClockIcon />
        <h1 className="mt-4 text-2xl font-bold text-foreground mb-2">Invitation Expired</h1>
        <p className="text-muted-foreground mb-8">
          This invitation has expired. Please ask the space owner to send a new one.
        </p>
        <Link href="/dashboard">
          <Button variant="secondary">Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // error state
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <XCircleIcon />
      <h1 className="mt-4 text-2xl font-bold text-foreground mb-2">Invalid Invitation</h1>
      <p className="text-muted-foreground mb-8">
        This invitation link is invalid or has already been used.
      </p>
      <Link href="/dashboard">
        <Button variant="secondary">Go to Dashboard</Button>
      </Link>
    </div>
  );
}
