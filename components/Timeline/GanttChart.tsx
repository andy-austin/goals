'use client';

import { forwardRef, useRef, useEffect, useMemo, useState, useCallback, type HTMLAttributes } from 'react';
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
const ROW_HEIGHT_DESKTOP = 48;
const ROW_HEIGHT_MOBILE = 40;
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
    const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
    const [tooltipSide, setTooltipSide] = useState<'above' | 'below' | 'right'>('above');
    const [isMobile, setIsMobile] = useState(false);
    const tGantt = useTranslations('gantt');
    const locale = useLocale();
    const ROW_HEIGHT = isMobile ? ROW_HEIGHT_MOBILE : ROW_HEIGHT_DESKTOP;

    // Detect mobile viewport for compact row heights
    useEffect(() => {
      const mql = window.matchMedia('(max-width: 640px)');
      setIsMobile(mql.matches);
      const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }, []);

    // Close tooltip on scroll or outside click (touch support)
    useEffect(() => {
      if (!activeGoalId) return;
      const handleDismiss = () => { setActiveGoalId(null); setTooltipPosition(null); };
      const container = scrollContainerRef.current;
      container?.addEventListener('scroll', handleDismiss);
      document.addEventListener('pointerdown', handleDismiss);
      return () => {
        container?.removeEventListener('scroll', handleDismiss);
        document.removeEventListener('pointerdown', handleDismiss);
      };
    }, [activeGoalId]);

    // Determine tooltip placement based on viewport collision
    const resolveTooltipSide = useCallback((barRect: DOMRect, rowIndex: number): 'above' | 'below' | 'right' => {
      // First row or near top of viewport → show right or below
      if (rowIndex === 0 || barRect.top < 120) return 'right';
      // Near bottom of viewport → show above
      if (barRect.bottom > window.innerHeight - 100) return 'above';
      return 'above';
    }, []);

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
        {/* Gantt chart container */}
        <div className="rounded-lg border border-border bg-background overflow-x-clip overflow-y-visible">
          <div className="flex">
            {/* Fixed left column - Goal labels */}
            <div className="w-[120px] sm:w-[180px] shrink-0 border-r border-border bg-background z-10">
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
                    className="px-2 sm:px-3 py-1.5 sm:py-2 border-b border-border/50 hover:bg-muted/30 transition-colors"
                    style={{ height: ROW_HEIGHT }}
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
                        <span className={isOverdue ? 'text-error' : ''}>
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
                    const isActive = activeGoalId === goal.id;
                    const targetDate = new Date(goal.targetDate);
                    const tooltipId = `gantt-tooltip-${goal.id}`;

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
                          className={`absolute h-5 sm:h-6 rounded cursor-pointer transition-all ${bucketConfig.classes.bg}`}
                          style={{
                            left: barStartX,
                            width: barWidth,
                            top: '50%',
                            transform: `translateY(-50%) ${isActive ? 'scaleY(1.15)' : 'scaleY(1)'}`,
                            opacity: isActive ? 1 : 0.85,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onGoalSelect?.(goal);
                          }}
                          onPointerEnter={(e) => {
                            // Ignore touch — handled by onPointerUp tap-to-toggle
                            if (e.pointerType === 'touch') return;
                            setActiveGoalId(goal.id);
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipSide(resolveTooltipSide(rect, index));
                            setTooltipPosition({ x: e.clientX - rect.left, y: 0 });
                          }}
                          onPointerMove={(e) => {
                            if (e.pointerType === 'touch') return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltipPosition({ x: e.clientX - rect.left, y: 0 });
                          }}
                          onPointerLeave={(e) => {
                            if (e.pointerType === 'touch') return;
                            setActiveGoalId(null);
                            setTooltipPosition(null);
                          }}
                          onPointerUp={(e) => {
                            // Tap-to-toggle on touch devices
                            if (e.pointerType !== 'touch') return;
                            e.stopPropagation();
                            if (isActive) {
                              setActiveGoalId(null);
                              setTooltipPosition(null);
                            } else {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setActiveGoalId(goal.id);
                              setTooltipSide(resolveTooltipSide(rect, index));
                              setTooltipPosition({ x: rect.width / 2, y: 0 });
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          onFocus={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setActiveGoalId(goal.id);
                            setTooltipSide(resolveTooltipSide(rect, index));
                            setTooltipPosition({ x: rect.width / 2, y: 0 });
                          }}
                          onBlur={() => {
                            setActiveGoalId(null);
                            setTooltipPosition(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onGoalSelect?.(goal);
                            } else if (e.key === 'Escape') {
                              setActiveGoalId(null);
                              setTooltipPosition(null);
                            }
                          }}
                          aria-label={`${goal.title}: ${formatCurrency(goal.amount, goal.currency, locale)}, target ${formatDate(targetDate, locale)}`}
                          aria-describedby={isActive ? tooltipId : undefined}
                        >
                          {/* Tooltip — position resolved by collision detection */}
                          {isActive && tooltipPosition && (
                            tooltipSide === 'right' ? (
                              <div
                                id={tooltipId}
                                role="tooltip"
                                className="absolute z-50 whitespace-nowrap pointer-events-none"
                                style={{
                                  left: tooltipPosition.x + 16,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                }}
                              >
                                <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
                                  <div className="font-medium text-foreground">{goal.title}</div>
                                  <div className="text-muted-foreground">
                                    {formatDate(targetDate, locale)}
                                  </div>
                                </div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1" aria-hidden="true">
                                  <div className="h-2 w-2 rotate-45 bg-card border-l border-b border-border" />
                                </div>
                              </div>
                            ) : tooltipSide === 'below' ? (
                              <div
                                id={tooltipId}
                                role="tooltip"
                                className="absolute z-50 whitespace-nowrap pointer-events-none -translate-x-1/2"
                                style={{
                                  left: tooltipPosition.x,
                                  top: '100%',
                                  marginTop: '8px',
                                }}
                              >
                                <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
                                  <div className="font-medium text-foreground">{goal.title}</div>
                                  <div className="text-muted-foreground">
                                    {formatDate(targetDate, locale)}
                                  </div>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 -top-1" aria-hidden="true">
                                  <div className="h-2 w-2 rotate-45 bg-card border-t border-l border-border" />
                                </div>
                              </div>
                            ) : (
                              <div
                                id={tooltipId}
                                role="tooltip"
                                className="absolute z-50 whitespace-nowrap pointer-events-none -translate-x-1/2"
                                style={{
                                  left: tooltipPosition.x,
                                  bottom: '100%',
                                  marginBottom: '8px',
                                }}
                              >
                                <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
                                  <div className="font-medium text-foreground">{goal.title}</div>
                                  <div className="text-muted-foreground">
                                    {formatDate(targetDate, locale)}
                                  </div>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1" aria-hidden="true">
                                  <div className="h-2 w-2 rotate-45 bg-card border-b border-r border-border" />
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
