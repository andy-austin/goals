'use client';

/**
 * StepVisibility — step 6 of the goal wizard: choose visibility and space (Issue #65)
 */

import { useEffect } from 'react';
import { useFormWizard } from '@/components/FormWizard';
import { useSpaces } from '@/context';
import { useAuth } from '@/context';
import { VisibilityToggle } from '@/components/Spaces/VisibilityToggle';
import { Select, Label } from '@/components/ui/Input';
import type { GoalFormInput, GoalVisibility } from '@/types';

const LockIcon = () => (
  <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export function StepVisibility() {
  const { data, updateData, setStepValid } = useFormWizard<Partial<GoalFormInput>>();
  const { user } = useAuth();
  const { spaces } = useSpaces();

  const visibility = (data.visibility ?? 'private') as GoalVisibility;
  const spaceId = data.spaceId ?? null;

  // Step is always valid (defaults are fine)
  useEffect(() => {
    // If visibility is 'shared', a space must be selected (if the user has spaces)
    const isValid =
      visibility === 'private' ||
      (visibility === 'shared' && (spaceId !== null || spaces.length === 0));
    setStepValid(isValid);
  }, [visibility, spaceId, spaces, setStepValid]);

  function handleVisibilityChange(v: GoalVisibility) {
    updateData({
      visibility: v,
      spaceId: v === 'private' ? null : (spaceId ?? (spaces[0]?.id ?? null)),
    });
  }

  function handleSpaceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateData({ spaceId: e.target.value || null });
  }

  // If not authenticated, just show a note
  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Visibility</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose who can see this goal.</p>
        </div>

        <div className="rounded-lg border border-border bg-secondary/50 p-4 flex items-start gap-3">
          <LockIcon />
          <div>
            <p className="text-sm font-medium text-foreground">This goal will be private</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Sign in to share goals with family or a group.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Visibility</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose who can see this goal. Private goals are only visible to you.
        </p>
      </div>

      {/* Visibility toggle */}
      <div>
        <Label className="mb-2 block">Who can see this goal?</Label>
        <VisibilityToggle value={visibility} onChange={handleVisibilityChange} />
      </div>

      {/* Visibility explanation cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          className={[
            'rounded-lg border p-4 transition-colors',
            visibility === 'private'
              ? 'border-primary bg-primary/5'
              : 'border-border bg-background',
          ].join(' ')}
        >
          <div className="flex items-center gap-2 mb-1">
            <LockIcon />
            <span className="text-sm font-medium text-foreground">Private</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Only you can see this goal. Best for personal savings targets.
          </p>
        </div>

        <div
          className={[
            'rounded-lg border p-4 transition-colors',
            visibility === 'shared'
              ? 'border-primary bg-primary/5'
              : 'border-border bg-background',
          ].join(' ')}
        >
          <div className="flex items-center gap-2 mb-1">
            <UsersIcon />
            <span className="text-sm font-medium text-foreground">Shared</span>
          </div>
          <p className="text-xs text-muted-foreground">
            All members of your chosen space can see this goal. Great for joint objectives.
          </p>
        </div>
      </div>

      {/* Space selector (only when shared) */}
      {visibility === 'shared' && (
        <div>
          {spaces.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                You don&apos;t have any shared spaces yet.
              </p>
              <a
                href="/spaces"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                Create a space first →
              </a>
            </div>
          ) : (
            <div>
              <Label htmlFor="space-select" className="mb-1 block">
                Share with which space?
              </Label>
              <Select
                id="space-select"
                value={spaceId ?? ''}
                onChange={handleSpaceChange}
              >
                <option value="">Select a space…</option>
                {spaces.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
