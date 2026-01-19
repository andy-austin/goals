'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { useTranslations } from 'next-intl';
import type { TimelineTodayMarkerProps } from './timeline.types';

export interface TodayMarkerProps
  extends TimelineTodayMarkerProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

/**
 * Vertical line marker indicating "Today" on the timeline
 */
export const TimelineTodayMarker = forwardRef<HTMLDivElement, TodayMarkerProps>(
  ({ xPosition, className = '', ...props }, ref) => {
    const t = useTranslations('gantt');

    return (
      <div
        ref={ref}
        className={`absolute top-0 bottom-0 z-10 flex flex-col items-center ${className}`}
        style={{ left: xPosition }}
        aria-label={t('today')}
        {...props}
      >
        {/* Today label */}
        <div className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
          {t('today')}
        </div>
        {/* Vertical line */}
        <div className="w-0.5 flex-1 bg-primary opacity-70" />
      </div>
    );
  }
);


TimelineTodayMarker.displayName = 'TimelineTodayMarker';
