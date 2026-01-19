'use client';

import { forwardRef, useRef, useEffect, useMemo, useState, type HTMLAttributes } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import type { Goal } from '@/types';
import { BUCKET_CONFIG, formatCurrency, formatDate } from '@/types';
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
const LEFT_PADDING = 60; // Padding to avoid cropping "Today" label

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
 * Generate date labels for the Gantt chart header
 */
function generateDateLabels(
  config: TimelineConfig, 
  todayPosition: number, 
  goals: Goal[], 
  tGantt: (key: string) => string, 
  locale: string
): Array<{ label: string; position: number }> {
  const labels: Array<{ label: string; position: number }> = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Add Today label
  labels.push({ label: tGantt('today'), position: todayPosition + LEFT_PADDING });

  // Find the furthest goal target date to ensure labels extend far enough
  let maxTargetDate = new Date(today);
  maxTargetDate.setFullYear(maxTargetDate.getFullYear() + 1); // Minimum 1 year

  for (const goal of goals) {
    const targetDate = new Date(goal.targetDate);
    if (targetDate > maxTargetDate) {
      maxTargetDate = targetDate;
    }
  }
  // Add some buffer beyond the furthest goal
  maxTargetDate.setMonth(maxTargetDate.getMonth() + 6);

  // Calculate interval based on zoom level
  let monthInterval = 1;
  if (config.zoomLevel === '5years') {
    monthInterval = 6;
  } else if (config.zoomLevel === '10years' || config.zoomLevel === 'all') {
    monthInterval = 12;
  } else if (config.zoomLevel === '1year') {
    monthInterval = 2;
  }

  // Generate future date labels
  const currentDate = new Date(today);
  currentDate.setDate(1); // Start from first of month
  currentDate.setMonth(currentDate.getMonth() + monthInterval);

  while (currentDate <= maxTargetDate) {
    const daysFromToday = (currentDate.getTime() - today.getTime()) / MS_PER_DAY;
    const position = todayPosition + (daysFromToday * config.pixelsPerDay) + LEFT_PADDING;

    const label = currentDate.toLocaleDateString(locale, {
      month: 'short',
      year: currentDate.getMonth() === 0 ? 'numeric' : undefined,
    });
    labels.push({ label, position });

    currentDate.setMonth(currentDate.getMonth() + monthInterval);
  }

  return labels;
}

/**
 * Gantt chart showing goals as horizontal bars from today to target date
 */
export const GanttChart = forwardRef<HTMLDivElement, GanttChartProps>(
  ({ goals, config, todayPosition, onGoalSelect, className = '', ...props }, ref) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [hoveredGoalId, setHoveredGoalId] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
    const tGantt = useTranslations('gantt');
    const locale = useLocale();

    // Sort goals by target date
    const sortedGoals = useMemo(() => {
      return [...goals].sort(
        (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
      );
    }, [goals]);

    // Calculate bar data for each goal with left padding
    const goalBars = useMemo(() => {
      return sortedGoals.map((goal) => ({
        goal,
        barStartX: todayPosition + LEFT_PADDING,
        barWidth: calculateBarWidth(goal, config),
      }));
    }, [sortedGoals, config, todayPosition]);

    // Generate date labels based on goals
    const dateLabels = useMemo(() => {
      return generateDateLabels(config, todayPosition, goals, tGantt, locale);
    }, [config, todayPosition, goals, tGantt, locale]);

    // Sync scroll position on initial load
    useEffect(() => {
      if (scrollContainerRef.current) {
        const containerWidth = scrollContainerRef.current.clientWidth;
        const scrollPosition = Math.max(0, todayPosition + LEFT_PADDING - containerWidth * 0.15);
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

    // Calculate total width to extend beyond all bars and date labels
    const maxBarEnd = goalBars.reduce((max, { barStartX, barWidth }) => {
      return Math.max(max, barStartX + barWidth);
    }, 0);
    const maxLabelPosition = dateLabels.length > 0
      ? Math.max(...dateLabels.map(l => l.position))
      : 0;
    const totalWidth = Math.max(config.totalWidth + LEFT_PADDING + 100, maxBarEnd + 100, maxLabelPosition + 100);

    return (
      <div ref={ref} className={`space-y-2 ${className}`} {...props}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            {tGantt('title')}
          </h3>
        </div>

        {/* Gantt chart container */}
        <div className="rounded-lg border border-border bg-background overflow-x-clip overflow-y-visible">
          <div className="flex">
            {/* Fixed left column - Goal labels */}
            <div className="w-[140px] sm:w-[180px] shrink-0 border-r border-border bg-background z-10">
              {/* Header */}
              <div className="h-10 px-2 sm:px-3 flex items-center border-b border-border bg-muted/30">
                <span className="text-xs font-medium text-muted-foreground">{tGantt('goal')}</span>
              </div>
              {/* Goal labels */}
              {sortedGoals.map((goal) => {
                const targetDate = new Date(goal.targetDate);
                const today = new Date();
                const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / MS_PER_DAY);
                const isOverdue = daysRemaining < 0;

                return (
                  <div
                    key={goal.id}
                    className="h-12 px-2 sm:px-3 py-2 border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => onGoalSelect?.(goal)}
                      className="w-full text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded cursor-pointer"
                    >
                      <div className="font-medium text-xs sm:text-sm text-foreground truncate">
                        {goal.title}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                        <span className="hidden sm:inline">{formatCurrency(goal.amount, goal.currency, locale)}</span>
                        <span className="sm:hidden">{formatCurrency(goal.amount, goal.currency, locale).replace('.00', '')}</span>
                        <span className="text-muted-foreground/50">·</span>
                        <span className={isOverdue ? 'text-red-500' : ''}>
                          {isOverdue 
                            ? `${Math.abs(daysRemaining)}${tGantt('days')} ${tGantt('overdue')}` 
                            : `${daysRemaining}${tGantt('days')}`}
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
              className="flex-1 overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div
                className="relative"
                style={{ width: totalWidth, minWidth: '100%' }}
              >
                {/* Header with date labels */}
                <div className="h-10 border-b border-border bg-muted/30 relative">
                  {dateLabels.map(({ label, position }, idx) => (
                    <div
                      key={`${label}-${idx}`}
                      className={`absolute text-xs top-1/2 -translate-y-1/2 whitespace-nowrap ${
                        label === tGantt('today') ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`}
                      style={{ left: position, transform: 'translate(-50%, -50%)' }}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Bars container with top padding for tooltips */}
                <div className="relative pt-12" style={{ height: totalHeight + 48 }}>
                  {/* Today vertical line */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-primary/50 z-10"
                    style={{ left: todayPosition + LEFT_PADDING }}
                  />

                  {/* Vertical grid lines for date markers */}
                  {dateLabels.slice(1).map(({ label, position }, idx) => (
                    <div
                      key={`line-${label}-${idx}`}
                      className="absolute top-0 bottom-0 w-px bg-border/30"
                      style={{ left: position }}
                    />
                  ))}

                  {/* Goal bars */}
                  {goalBars.map(({ goal, barStartX, barWidth }, index) => {
                    const bucketConfig = BUCKET_CONFIG[goal.bucket];
                    const isHovered = hoveredGoalId === goal.id;
                    const targetDate = new Date(goal.targetDate);

                    return (
                      <div
                        key={goal.id}
                        className="absolute left-0 right-0 flex items-center"
                        style={{
                          top: index * ROW_HEIGHT,
                          height: ROW_HEIGHT,
                        }}
                      >
                        {/* Row background with border */}
                        <div className="absolute inset-0 border-b border-border/50" />

                        {/* Bar - vertically centered with flex */}
                        <div
                          className="absolute h-6 rounded cursor-pointer transition-all"
                          style={{
                            left: barStartX,
                            width: barWidth,
                            top: '50%',
                            transform: `translateY(-50%) ${isHovered ? 'scaleY(1.15)' : 'scaleY(1)'}`,
                            backgroundColor: bucketConfig.colorVar,
                            opacity: isHovered ? 1 : 0.85,
                          }}
                          onClick={() => onGoalSelect?.(goal)}
                          onMouseEnter={(e) => {
                            setHoveredGoalId(goal.id);
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top
                            });
                          }}
                          onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top
                            });
                          }}
                          onMouseLeave={() => {
                            setHoveredGoalId(null);
                            setTooltipPosition(null);
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              onGoalSelect?.(goal);
                            }
                          }}
                          aria-label={`${goal.title}: ${formatCurrency(goal.amount, goal.currency, locale)}, target ${formatDate(targetDate, locale)}`}
                        >
                          {/* Hover tooltip - follows cursor position */}
                          {isHovered && tooltipPosition && (
                            index === 0 ? (
                              // First row: show tooltip to the right to avoid top cropping
                              <div
                                className="absolute z-50 whitespace-nowrap pointer-events-none"
                                style={{
                                  left: tooltipPosition.x + 16,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                }}
                              >
                                <div className="bg-white dark:bg-zinc-900 border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
                                  <div className="font-medium text-foreground">{goal.title}</div>
                                  <div className="text-muted-foreground">
                                    {formatDate(targetDate, locale)}
                                  </div>
                                </div>
                                {/* Arrow pointing left */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1">
                                  <div className="h-2 w-2 rotate-45 bg-white dark:bg-zinc-900 border-l border-b border-border" />
                                </div>
                              </div>
                            ) : (
                              // Other rows: show tooltip above
                              <div
                                className="absolute z-50 whitespace-nowrap pointer-events-none -translate-x-1/2"
                                style={{
                                  left: tooltipPosition.x,
                                  bottom: '100%',
                                  marginBottom: '8px',
                                }}
                              >
                                <div className="bg-white dark:bg-zinc-900 border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
                                  <div className="font-medium text-foreground">{goal.title}</div>
                                  <div className="text-muted-foreground">
                                    {formatDate(targetDate, locale)}
                                  </div>
                                </div>
                                {/* Arrow pointing down */}
                                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1">
                                  <div className="h-2 w-2 rotate-45 bg-white dark:bg-zinc-900 border-b border-r border-border" />
                                </div>
                              </div>
                            )
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
