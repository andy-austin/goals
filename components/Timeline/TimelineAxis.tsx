'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import type { TimelineAxisProps } from './timeline.types';

export interface AxisProps
  extends Omit<TimelineAxisProps, 'config'>,
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

/**
 * Timeline axis with month/year labels and grid lines
 */
export const TimelineAxis = forwardRef<HTMLDivElement, AxisProps>(
  ({ marks, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute inset-0 ${className}`}
        aria-hidden="true"
        {...props}
      >
        {/* Grid lines and labels */}
        {marks.map((mark, index) => (
          <div
            key={`${mark.date.toISOString()}-${index}`}
            className="absolute top-0 bottom-0 flex flex-col"
            style={{ left: mark.xPosition }}
          >
            {/* Grid line */}
            <div
              className={`
                absolute top-8 bottom-0 w-px
                ${mark.isMajor ? 'bg-border' : 'bg-border/50'}
              `}
            />
            {/* Label */}
            <div
              className={`
                absolute top-0 -translate-x-1/2 transform
                whitespace-nowrap text-xs
                ${
                  mark.isMajor
                    ? 'font-semibold text-foreground'
                    : 'text-muted-foreground'
                }
              `}
            >
              {mark.label}
            </div>
          </div>
        ))}

        {/* Axis line at top */}
        <div className="absolute left-0 top-6 h-px w-full bg-border" />
      </div>
    );
  }
);

TimelineAxis.displayName = 'TimelineAxis';
