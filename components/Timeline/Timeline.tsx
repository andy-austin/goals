'use client';

import { forwardRef, useRef, useEffect, type HTMLAttributes } from 'react';
import { useTranslations } from 'next-intl';
import type { Goal } from '@/types';
import { TimelineAxis } from './TimelineAxis';
import { TimelineTodayMarker } from './TimelineTodayMarker';
import { TimelineGoalMarker } from './TimelineGoalMarker';
import { TimelineGoalCluster } from './TimelineGoalCluster';
import { TimelineGapMarker } from './TimelineGapMarker';
import { TimelineZoomControls } from './TimelineZoomControls';
import { useTimelineCalculations } from './useTimelineCalculations';
import type { TimelineProps, ZoomLevel } from './timeline.types';

export interface Props
  extends Omit<TimelineProps, 'goals' | 'zoomLevel' | 'onZoomChange' | 'onGoalSelect'>,
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  goals: Goal[];
  zoomLevel: ZoomLevel;
  onZoomChange: (level: ZoomLevel) => void;
  onGoalSelect?: (goal: Goal) => void;
}

/**
 * Main Timeline component - horizontal scrollable view of goals by target date
 */
export const Timeline = forwardRef<HTMLDivElement, Props>(
  ({ goals, zoomLevel, onZoomChange, onGoalSelect, className = '', ...props }, ref) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('timeline');
    const tBuckets = useTranslations('buckets');
    const { config, clusters, axisMarks, todayPosition } = useTimelineCalculations(
      goals,
      zoomLevel
    );

    // Scroll to show "today" marker on initial load and zoom change
    useEffect(() => {
      if (scrollContainerRef.current) {
        // Center the "today" marker in view (with some offset to show content ahead)
        const containerWidth = scrollContainerRef.current.clientWidth;
        const scrollPosition = Math.max(0, todayPosition - containerWidth * 0.15);
        scrollContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }, [todayPosition, zoomLevel]);

    const handleGoalClick = (goal: Goal) => {
      onGoalSelect?.(goal);
    };

    const handleClusterClick = (goals: Goal[]) => {
      // If cluster click returns single goal, select it
      if (goals.length === 1) {
        onGoalSelect?.(goals[0]);
      }
    };

    return (
      <div ref={ref} className={`space-y-4 ${className}`} {...props}>
        {/* Controls bar */}
        <div className="flex items-center justify-between">
          <TimelineZoomControls
            currentLevel={zoomLevel}
            onChange={onZoomChange}
          />
          <div className="text-sm text-muted-foreground">
            {t('goalsCount', { count: goals.length })}
          </div>
        </div>

        {/* Timeline container */}
        <div
          className="
            rounded-lg border border-border bg-background
            overflow-hidden
          "
        >
          {/* Scrollable area */}
          <div
            ref={scrollContainerRef}
            className="
              overflow-x-auto overflow-y-visible
              scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent
            "
            style={{
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Timeline content */}
            <div
              className="relative min-h-[280px] py-4"
              style={{
                width: config.totalWidth + 100, // Extra padding at end
                minWidth: '100%',
              }}
            >
              {/* Axis with gridlines */}
              <TimelineAxis marks={axisMarks} />

              {/* Today marker */}
              <TimelineTodayMarker xPosition={todayPosition} />

              {/* Gap markers for compressed view */}
              {config.gaps?.map((gap, index) => (
                <TimelineGapMarker key={`gap-${index}`} gap={gap} />
              ))}

              {/* Goal markers or clusters */}
              {clusters.map((cluster) =>
                cluster.goals.length === 1 ? (
                  <TimelineGoalMarker
                    key={cluster.goals[0].id}
                    goal={cluster.goals[0]}
                    xPosition={cluster.xPosition}
                    onClick={handleGoalClick}
                  />
                ) : (
                  <TimelineGoalCluster
                    key={cluster.id}
                    cluster={cluster}
                    onClick={handleClusterClick}
                  />
                )
              )}

              {/* Empty state message if no visible goals */}
              {clusters.length === 0 && goals.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    {t('noVisible')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-bucket-safety" />
            <span>{tBuckets('safety.name')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-bucket-growth" />
            <span>{tBuckets('growth.name')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-bucket-dream" />
            <span>{tBuckets('dream.name')}</span>
          </div>
        </div>
      </div>
    );
  }
);

Timeline.displayName = 'Timeline';
