'use client';

import { forwardRef, useState, type HTMLAttributes } from 'react';
import { BUCKET_CONFIG, formatCurrency } from '@/types';
import type { Goal } from '@/types';

export interface GanttRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Goal to display */
  goal: Goal;
  /** X position where the bar starts (today position) */
  barStartX: number;
  /** Width of the bar in pixels */
  barWidth: number;
  /** Total width of the timeline */
  totalWidth: number;
  /** Callback when row is clicked */
  onClick?: (goal: Goal) => void;
}

/**
 * A single row in the Gantt chart showing a goal as a horizontal bar
 */
export const GanttRow = forwardRef<HTMLDivElement, GanttRowProps>(
  ({ goal, barStartX, barWidth, totalWidth, onClick, className = '', ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const bucketConfig = BUCKET_CONFIG[goal.bucket];

    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;

    return (
      <div
        ref={ref}
        className={`flex items-center h-12 border-b border-border/50 ${className}`}
        {...props}
      >
        {/* Fixed label section */}
        <div className="w-[180px] shrink-0 px-3 py-2 border-r border-border/50 bg-background">
          <button
            type="button"
            onClick={() => onClick?.(goal)}
            className="w-full text-left hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
          >
            <div className="font-medium text-sm text-foreground truncate">
              {goal.title}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatCurrency(goal.amount, goal.currency)}</span>
              <span className="text-muted-foreground/50">·</span>
              <span className={isOverdue ? 'text-red-500' : ''}>
                {isOverdue ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d`}
              </span>
            </div>
          </button>
        </div>

        {/* Scrollable bar section */}
        <div
          className="relative flex-1 h-full overflow-hidden"
          style={{ minWidth: totalWidth }}
        >
          {/* Bar container */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-6 rounded cursor-pointer transition-all"
            style={{
              left: barStartX,
              width: Math.max(barWidth, 20), // Minimum 20px width
              backgroundColor: bucketConfig.colorVar,
              opacity: isHovered ? 1 : 0.85,
              transform: `translateY(-50%) ${isHovered ? 'scale(1.02)' : 'scale(1)'}`,
            }}
            onClick={() => onClick?.(goal)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClick?.(goal);
              }
            }}
            aria-label={`${goal.title}: ${formatCurrency(goal.amount, goal.currency)}, ${daysRemaining} days remaining`}
          >
            {/* Target date marker at the end */}
            <div
              className="absolute right-0 top-0 bottom-0 w-1 rounded-r"
              style={{ backgroundColor: bucketConfig.colorVar, filter: 'brightness(0.8)' }}
            />

            {/* Hover tooltip */}
            {isHovered && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 whitespace-nowrap">
                <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
                  <div className="font-medium text-foreground">{goal.title}</div>
                  <div className="text-muted-foreground">
                    {targetDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                {/* Arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full">
                  <div className="h-2 w-2 rotate-45 -translate-y-1 bg-background border-b border-r border-border" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

GanttRow.displayName = 'GanttRow';
