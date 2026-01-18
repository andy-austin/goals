'use client';

import { forwardRef, useRef, useEffect, useMemo, useState, type HTMLAttributes } from 'react';
import type { Goal } from '@/types';
import { BUCKET_CONFIG, formatCurrency } from '@/types';
import type { TimelineConfig } from './timeline.types';

export interface GanttChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Goals to display */
  goals: Goal[];
  /** Timeline configuration (shared with marker timeline) */
  config: TimelineConfig;
  /** X position of today marker */
  todayPosition: number;
  /** Callback when a goal is selected */
  onGoalSelect?: (goal: Goal) => void;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const ROW_HEIGHT = 48;

/**
 * Calculate bar width for a goal (from today to target date)
 */
function calculateBarWidth(goal: Goal, config: TimelineConfig): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(goal.targetDate);
  const daysRemaining = (targetDate.getTime() - today.getTime()) / MS_PER_DAY;
  return Math.max(daysRemaining * config.pixelsPerDay, 20); // Minimum 20px
}

/**
 * Gantt chart showing goals as horizontal bars from today to target date
 */
export const GanttChart = forwardRef<HTMLDivElement, GanttChartProps>(
  ({ goals, config, todayPosition, onGoalSelect, className = '', ...props }, ref) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [hoveredGoalId, setHoveredGoalId] = useState<string | null>(null);

    // Sort goals by target date
    const sortedGoals = useMemo(() => {
      return [...goals].sort(
        (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
      );
    }, [goals]);

    // Calculate bar data for each goal
    const goalBars = useMemo(() => {
      return sortedGoals.map((goal) => ({
        goal,
        barStartX: todayPosition,
        barWidth: calculateBarWidth(goal, config),
      }));
    }, [sortedGoals, config, todayPosition]);

    // Sync scroll position on initial load
    useEffect(() => {
      if (scrollContainerRef.current) {
        const containerWidth = scrollContainerRef.current.clientWidth;
        const scrollPosition = Math.max(0, todayPosition - containerWidth * 0.15);
        scrollContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }, [todayPosition]);

    if (goals.length === 0) {
      return null;
    }

    const totalHeight = sortedGoals.length * ROW_HEIGHT;

    return (
      <div ref={ref} className={`space-y-2 ${className}`} {...props}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Gantt View
          </h3>
        </div>

        {/* Gantt chart container */}
        <div className="rounded-lg border border-border bg-background overflow-hidden">
          <div className="flex">
            {/* Fixed left column - Goal labels */}
            <div className="w-[180px] shrink-0 border-r border-border bg-background z-10">
              {/* Header */}
              <div className="h-8 px-3 flex items-center border-b border-border bg-muted/30">
                <span className="text-xs font-medium text-muted-foreground">Goal</span>
              </div>
              {/* Goal labels */}
              {sortedGoals.map((goal) => {
                const bucketConfig = BUCKET_CONFIG[goal.bucket];
                const targetDate = new Date(goal.targetDate);
                const today = new Date();
                const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / MS_PER_DAY);
                const isOverdue = daysRemaining < 0;

                return (
                  <div
                    key={goal.id}
                    className="h-12 px-3 py-2 border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => onGoalSelect?.(goal)}
                      className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
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
                );
              })}
            </div>

            {/* Scrollable right area - Bars */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div
                className="relative"
                style={{ width: config.totalWidth + 100, minWidth: '100%' }}
              >
                {/* Header with Today label */}
                <div className="h-8 border-b border-border bg-muted/30 relative">
                  <div
                    className="absolute text-xs text-primary font-medium top-1/2 -translate-y-1/2"
                    style={{ left: todayPosition - 15 }}
                  >
                    Today
                  </div>
                </div>

                {/* Bars container */}
                <div className="relative" style={{ height: totalHeight }}>
                  {/* Today vertical line */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-primary/50 z-10"
                    style={{ left: todayPosition }}
                  />

                  {/* Goal bars */}
                  {goalBars.map(({ goal, barStartX, barWidth }, index) => {
                    const bucketConfig = BUCKET_CONFIG[goal.bucket];
                    const isHovered = hoveredGoalId === goal.id;
                    const targetDate = new Date(goal.targetDate);

                    return (
                      <div
                        key={goal.id}
                        className="absolute left-0 right-0"
                        style={{
                          top: index * ROW_HEIGHT,
                          height: ROW_HEIGHT,
                        }}
                      >
                        {/* Row background with border */}
                        <div className="absolute inset-0 border-b border-border/50" />

                        {/* Bar */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-6 rounded cursor-pointer transition-all"
                          style={{
                            left: barStartX,
                            width: barWidth,
                            backgroundColor: bucketConfig.colorVar,
                            opacity: isHovered ? 1 : 0.85,
                            transform: `translateY(-50%) ${isHovered ? 'scaleY(1.1)' : 'scaleY(1)'}`,
                          }}
                          onClick={() => onGoalSelect?.(goal)}
                          onMouseEnter={() => setHoveredGoalId(goal.id)}
                          onMouseLeave={() => setHoveredGoalId(null)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              onGoalSelect?.(goal);
                            }
                          }}
                          aria-label={`${goal.title}: ${formatCurrency(goal.amount, goal.currency)}, target ${targetDate.toLocaleDateString()}`}
                        >
                          {/* Hover tooltip */}
                          {isHovered && (
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 whitespace-nowrap pointer-events-none">
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
                              <div className="absolute left-1/2 -translate-x-1/2 top-full">
                                <div className="h-2 w-2 rotate-45 -translate-y-1 bg-background border-b border-r border-border" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

GanttChart.displayName = 'GanttChart';
