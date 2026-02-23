'use client';

/**
 * SpaceCard — displays a shared space in the spaces list (Issue #65)
 */

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { SharedSpace } from '@/types';
import { Card, CardContent } from '@/components/ui';

interface SpaceCardProps {
  space: SharedSpace;
  isOwner: boolean;
  memberCount?: number;
  goalCount?: number;
}

const UsersIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TargetIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export function SpaceCard({ space, isOwner, memberCount, goalCount }: SpaceCardProps) {
  const t = useTranslations('spaces');
  return (
    <Link href={`/spaces/${space.id}`} className="block group">
      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
            {space.name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-foreground truncate">{space.name}</h3>
              {isOwner && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium flex-shrink-0">
                  {t('owner')}
                </span>
              )}
            </div>
            {space.description && (
              <p className="text-sm text-muted-foreground truncate">{space.description}</p>
            )}
            <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
              {memberCount !== undefined && (
                <span className="flex items-center gap-1">
                  <UsersIcon />
                  {t('members', { count: memberCount })}
                </span>
              )}
              {goalCount !== undefined && (
                <span className="flex items-center gap-1">
                  <TargetIcon />
                  {t('sharedGoals', { count: goalCount })}
                </span>
              )}
            </div>
          </div>

          <ChevronRightIcon />
        </CardContent>
      </Card>
    </Link>
  );
}
