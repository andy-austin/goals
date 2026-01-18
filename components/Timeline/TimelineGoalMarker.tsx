'use client';

import { forwardRef, useState, type HTMLAttributes } from 'react';
import { BUCKET_CONFIG } from '@/types';
import { TimelineGoalTooltip } from './TimelineGoalTooltip';
import type { TimelineGoalMarkerProps } from './timeline.types';

export interface GoalMarkerProps
  extends TimelineGoalMarkerProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {}

/**
 * Individual goal marker on the timeline
 */
export const TimelineGoalMarker = forwardRef<HTMLDivElement, GoalMarkerProps>(
  ({ goal, xPosition, onClick, className = '', ...props }, ref) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const bucketConfig = BUCKET_CONFIG[goal.bucket];

    return (
      <div
        ref={ref}
        className={`absolute flex flex-col items-center ${className}`}
        style={{ left: xPosition, top: '2rem' }}
        {...props}
      >
        {/* Connector line */}
        <div
          className="h-4 w-0.5"
          style={{ backgroundColor: bucketConfig.colorVar }}
        />

        {/* Goal marker button with tooltip */}
        <div className="relative">
          <button
            type="button"
            onClick={() => onClick?.(goal)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            className={`
              relative flex items-center justify-center
              min-w-[44px] min-h-[44px] px-2 py-1
              rounded-lg border-2 shadow-sm
              cursor-pointer transition-all
              hover:scale-105 hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            `}
            style={{
              backgroundColor: bucketConfig.bgColorVar,
              borderColor: bucketConfig.colorVar,
            }}
            aria-label={`Goal: ${goal.title}`}
          >
            {/* Goal title (truncated) */}
            <span
              className="text-xs font-medium max-w-[100px] truncate"
              style={{ color: bucketConfig.colorVar }}
            >
              {goal.title}
            </span>
          </button>

          {/* Tooltip - positioned below the button */}
          {showTooltip && <TimelineGoalTooltip goal={goal} />}
        </div>
      </div>
    );
  }
);

TimelineGoalMarker.displayName = 'TimelineGoalMarker';
