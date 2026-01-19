'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { useTranslations } from 'next-intl';
import type { TimelineGap } from './timeline.types';

export interface TimelineGapMarkerProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap data */
  gap: TimelineGap;
}

/**
 * Visual marker for compressed time gaps in the timeline
 * Displays ellipsis (...) to indicate skipped time
 */
export const TimelineGapMarker = forwardRef<HTMLDivElement, TimelineGapMarkerProps>(
  ({ gap, className = '', ...props }, ref) => {
    const t = useTranslations('timeline.gap');

    return (
      <div
        ref={ref}
        className={`absolute top-0 bottom-0 flex flex-col items-center justify-center ${className}`}
        style={{ left: gap.xPosition }}
        aria-hidden="true"
        {...props}
      >
        {/* Vertical dashed line */}
        <div className="absolute top-0 bottom-0 w-px border-l-2 border-dashed border-muted-foreground/30" />

        {/* Ellipsis indicator */}
        <div className="relative z-10 flex items-center justify-center bg-background px-1">
          <span className="text-lg font-bold text-muted-foreground tracking-widest">
            •••
          </span>
        </div>

        {/* Years skipped label */}
        {gap.yearsSkipped > 0 && (
          <div className="absolute bottom-4 bg-background px-2 py-0.5 rounded text-xs text-muted-foreground whitespace-nowrap">
            {t('yearsSkipped', { count: gap.yearsSkipped })}
          </div>
        )}
      </div>
    );
  }
);

TimelineGapMarker.displayName = 'TimelineGapMarker';
