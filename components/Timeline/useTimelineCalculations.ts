/**
 * Hook for timeline date-to-pixel calculations and goal clustering
 */

import { useMemo } from 'react';
import type { Goal } from '@/types';
import type {
  ZoomLevel,
  TimelineConfig,
  TimelineGoalPosition,
  GoalCluster,
  TimelineAxisMark,
} from './timeline.types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const CLUSTER_THRESHOLD_PX = 40; // Minimum pixels between goals before clustering

/**
 * Get timeline configuration based on zoom level and goals
 */
export function getTimelineConfig(zoomLevel: ZoomLevel, goals: Goal[]): TimelineConfig {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (zoomLevel) {
    case '1year': {
      const endDate = new Date(today);
      endDate.setFullYear(endDate.getFullYear() + 1);
      return {
        zoomLevel,
        startDate: today,
        endDate,
        pixelsPerDay: 3,
        totalWidth: 365 * 3, // ~1095px
      };
    }
    case '5years': {
      const endDate = new Date(today);
      endDate.setFullYear(endDate.getFullYear() + 5);
      return {
        zoomLevel,
        startDate: today,
        endDate,
        pixelsPerDay: 1,
        totalWidth: 365 * 5, // ~1825px
      };
    }
    case '10years': {
      const endDate = new Date(today);
      endDate.setFullYear(endDate.getFullYear() + 10);
      return {
        zoomLevel,
        startDate: today,
        endDate,
        pixelsPerDay: 0.5,
        totalWidth: Math.round(365 * 10 * 0.5), // ~1825px
      };
    }
    case 'all': {
      // Calculate based on furthest goal, with minimum of 2 years
      const twoYearsFromNow = new Date(today);
      twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);

      const furthestDate = goals.reduce((max, goal) => {
        const targetDate = new Date(goal.targetDate);
        return targetDate > max ? targetDate : max;
      }, twoYearsFromNow);

      // Add 10% buffer at the end
      const bufferDays = Math.ceil(
        (furthestDate.getTime() - today.getTime()) / MS_PER_DAY * 0.1
      );
      const endDate = new Date(furthestDate);
      endDate.setDate(endDate.getDate() + bufferDays);

      const totalDays = Math.ceil((endDate.getTime() - today.getTime()) / MS_PER_DAY);
      // Target width of ~2000px, calculate pixels per day
      const targetWidth = 2000;
      const pixelsPerDay = Math.max(0.3, targetWidth / totalDays);

      return {
        zoomLevel,
        startDate: today,
        endDate,
        pixelsPerDay,
        totalWidth: Math.round(totalDays * pixelsPerDay),
      };
    }
  }
}

/**
 * Calculate the x position for a date on the timeline
 */
export function dateToPosition(date: Date, config: TimelineConfig): number {
  const targetTime = new Date(date).getTime();
  const startTime = config.startDate.getTime();
  const daysDiff = (targetTime - startTime) / MS_PER_DAY;
  return Math.round(daysDiff * config.pixelsPerDay);
}

/**
 * Calculate positions for all goals on the timeline
 */
export function calculateGoalPositions(
  goals: Goal[],
  config: TimelineConfig
): TimelineGoalPosition[] {
  return goals.map((goal) => {
    const xPosition = dateToPosition(new Date(goal.targetDate), config);
    const isVisible = xPosition >= 0 && xPosition <= config.totalWidth;

    return {
      goal,
      xPosition,
      isVisible,
    };
  });
}

/**
 * Cluster goals that are close together on the timeline
 */
export function clusterGoals(
  positions: TimelineGoalPosition[],
  threshold: number = CLUSTER_THRESHOLD_PX
): GoalCluster[] {
  // Filter to visible goals and sort by x position
  const visibleSorted = positions
    .filter((p) => p.isVisible)
    .sort((a, b) => a.xPosition - b.xPosition);

  if (visibleSorted.length === 0) {
    return [];
  }

  const clusters: GoalCluster[] = [];
  let currentGroup: TimelineGoalPosition[] = [visibleSorted[0]];

  for (let i = 1; i < visibleSorted.length; i++) {
    const current = visibleSorted[i];
    const lastInGroup = currentGroup[currentGroup.length - 1];
    const distance = current.xPosition - lastInGroup.xPosition;

    if (distance <= threshold) {
      // Add to current group
      currentGroup.push(current);
    } else {
      // Finalize current group and start new one
      clusters.push(createCluster(currentGroup));
      currentGroup = [current];
    }
  }

  // Don't forget the last group
  if (currentGroup.length > 0) {
    clusters.push(createCluster(currentGroup));
  }

  return clusters;
}

/**
 * Create a cluster from a group of goal positions
 */
function createCluster(positions: TimelineGoalPosition[]): GoalCluster {
  const goals = positions.map((p) => p.goal);
  const avgPosition =
    positions.reduce((sum, p) => sum + p.xPosition, 0) / positions.length;

  const dates = goals.map((g) => new Date(g.targetDate).getTime());
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  return {
    id: `cluster_${goals.map((g) => g.id).join('_')}`,
    goals,
    xPosition: Math.round(avgPosition),
    startDate: minDate,
    endDate: maxDate,
  };
}

/**
 * Generate axis marks for the timeline (months and years)
 */
export function generateAxisMarks(config: TimelineConfig): TimelineAxisMark[] {
  const marks: TimelineAxisMark[] = [];
  const { startDate, endDate } = config;

  // Start from the first day of the next month
  const current = new Date(startDate);
  current.setDate(1);
  current.setMonth(current.getMonth() + 1);
  current.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    const xPosition = dateToPosition(current, config);
    const isYearStart = current.getMonth() === 0;

    // Determine label based on zoom level and whether it's a year start
    let label: string;
    if (isYearStart) {
      label = current.getFullYear().toString();
    } else if (config.zoomLevel === '1year' || config.zoomLevel === '5years') {
      // Show month names for closer zoom levels
      label = current.toLocaleDateString('en-US', { month: 'short' });
    } else {
      // For 10+ years and 'all', only show labels for January and July
      if (current.getMonth() === 0 || current.getMonth() === 6) {
        label = current.toLocaleDateString('en-US', { month: 'short' });
      } else {
        // Skip this month (but still add mark for gridline if needed)
        current.setMonth(current.getMonth() + 1);
        continue;
      }
    }

    marks.push({
      date: new Date(current),
      xPosition,
      label,
      isYearStart,
      isMajor: isYearStart,
    });

    current.setMonth(current.getMonth() + 1);
  }

  return marks;
}

/**
 * Hook that provides all timeline calculations
 */
export function useTimelineCalculations(goals: Goal[], zoomLevel: ZoomLevel) {
  const config = useMemo(
    () => getTimelineConfig(zoomLevel, goals),
    [zoomLevel, goals]
  );

  const goalPositions = useMemo(
    () => calculateGoalPositions(goals, config),
    [goals, config]
  );

  const clusters = useMemo(
    () => clusterGoals(goalPositions),
    [goalPositions]
  );

  const axisMarks = useMemo(
    () => generateAxisMarks(config),
    [config]
  );

  const todayPosition = useMemo(
    () => dateToPosition(new Date(), config),
    [config]
  );

  return {
    config,
    goalPositions,
    clusters,
    axisMarks,
    todayPosition,
  };
}
