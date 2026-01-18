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
  TimelineGap,
} from './timeline.types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const CLUSTER_THRESHOLD_PX = 40; // Minimum pixels between goals before clustering
const FIT_VIEW_WIDTH = 900; // Target width for fit view (fits most screens)
const MIN_GOAL_SPACING = 150; // Minimum pixels between goals in fit view
const GAP_THRESHOLD_DAYS = 365; // Days between goals to show a gap (1 year)

/**
 * Get timeline configuration based on zoom level and goals
 */
/**
 * Calculate compressed "fit" view configuration
 * Places goals with even spacing and adds gap markers for large time gaps
 */
function getFitConfig(goals: Goal[]): TimelineConfig {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (goals.length === 0) {
    const oneYear = new Date(today);
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    return {
      zoomLevel: 'all',
      startDate: today,
      endDate: oneYear,
      pixelsPerDay: 3,
      totalWidth: FIT_VIEW_WIDTH,
      isCompressed: true,
      gaps: [],
    };
  }

  // Sort goals by target date
  const sortedGoals = [...goals].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  const lastGoalDate = new Date(sortedGoals[sortedGoals.length - 1].targetDate);

  // Find large gaps between goals
  const gaps: TimelineGap[] = [];
  let totalGapDays = 0;

  for (let i = 0; i < sortedGoals.length - 1; i++) {
    const currentDate = new Date(sortedGoals[i].targetDate);
    const nextDate = new Date(sortedGoals[i + 1].targetDate);
    const daysBetween = (nextDate.getTime() - currentDate.getTime()) / MS_PER_DAY;

    if (daysBetween > GAP_THRESHOLD_DAYS) {
      // This is a large gap - we'll compress it
      const gapDays = daysBetween - GAP_THRESHOLD_DAYS / 2; // Keep some visible gap
      totalGapDays += gapDays;

      const yearsSkipped = Math.floor(daysBetween / 365);
      gaps.push({
        xPosition: 0, // Will be calculated later
        startDate: currentDate,
        endDate: nextDate,
        yearsSkipped,
      });
    }
  }

  // Calculate effective time span (compressed)
  const totalDays = (lastGoalDate.getTime() - today.getTime()) / MS_PER_DAY;
  const effectiveDays = Math.max(totalDays - totalGapDays, 60); // Minimum 60 days

  // Add padding: 50px left for Today marker, 50px right for end
  const availableWidth = FIT_VIEW_WIDTH - 100;
  const pixelsPerDay = availableWidth / effectiveDays;

  // Calculate gap positions based on compressed spacing
  let currentOffset = 0;
  let gapIndex = 0;

  for (let i = 0; i < sortedGoals.length - 1 && gapIndex < gaps.length; i++) {
    const currentDate = new Date(sortedGoals[i].targetDate);
    const nextDate = new Date(sortedGoals[i + 1].targetDate);
    const daysBetween = (nextDate.getTime() - currentDate.getTime()) / MS_PER_DAY;

    if (daysBetween > GAP_THRESHOLD_DAYS) {
      // Position the gap between the goals
      const currentGoalDays = (currentDate.getTime() - today.getTime()) / MS_PER_DAY;
      const xPos = 50 + (currentGoalDays - currentOffset) * pixelsPerDay + MIN_GOAL_SPACING / 2;
      gaps[gapIndex].xPosition = xPos;

      // Add the compressed days to offset
      const gapDays = daysBetween - GAP_THRESHOLD_DAYS / 2;
      currentOffset += gapDays;
      gapIndex++;
    }
  }

  return {
    zoomLevel: 'all',
    startDate: today,
    endDate: lastGoalDate,
    pixelsPerDay,
    totalWidth: FIT_VIEW_WIDTH,
    isCompressed: true,
    gaps,
  };
}

export function getTimelineConfig(zoomLevel: ZoomLevel, goals: Goal[]): TimelineConfig {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (zoomLevel) {
    case 'all':
      return getFitConfig(goals);
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
 * Calculate compressed positions for fit view
 * Distributes goals evenly with gaps compressed
 */
function calculateCompressedPositions(
  goals: Goal[],
  config: TimelineConfig
): TimelineGoalPosition[] {
  if (goals.length === 0) return [];

  const today = config.startDate;
  const sortedGoals = [...goals].sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  // Calculate cumulative gap compression offset for each goal
  const gaps = config.gaps || [];
  const result: TimelineGoalPosition[] = [];

  for (const goal of sortedGoals) {
    const goalDate = new Date(goal.targetDate);
    const daysFromStart = (goalDate.getTime() - today.getTime()) / MS_PER_DAY;

    // Calculate how much gap compression applies before this goal
    let compressionOffset = 0;
    for (const gap of gaps) {
      if (goalDate > gap.endDate) {
        // This goal is after this gap - apply full compression
        const gapDays = (gap.endDate.getTime() - gap.startDate.getTime()) / MS_PER_DAY;
        compressionOffset += gapDays - GAP_THRESHOLD_DAYS / 2;
      } else if (goalDate > gap.startDate) {
        // Goal is within the gap - partial compression
        const daysIntoGap = (goalDate.getTime() - gap.startDate.getTime()) / MS_PER_DAY;
        compressionOffset += Math.max(0, daysIntoGap - GAP_THRESHOLD_DAYS / 4);
      }
    }

    const effectiveDays = daysFromStart - compressionOffset;
    const xPosition = 50 + effectiveDays * config.pixelsPerDay;

    result.push({
      goal,
      xPosition: Math.max(50, Math.round(xPosition)),
      isVisible: true,
    });
  }

  return result;
}

/**
 * Calculate positions for all goals on the timeline
 */
export function calculateGoalPositions(
  goals: Goal[],
  config: TimelineConfig
): TimelineGoalPosition[] {
  // Use compressed calculation for fit view
  if (config.isCompressed) {
    return calculateCompressedPositions(goals, config);
  }

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
 * Generate axis marks for compressed fit view
 * Shows only year markers at goal positions
 */
function generateCompressedAxisMarks(
  goals: Goal[],
  goalPositions: TimelineGoalPosition[]
): TimelineAxisMark[] {
  if (goals.length === 0) return [];

  const marks: TimelineAxisMark[] = [];
  const seenYears = new Set<number>();

  // Add year markers at each goal position
  for (const pos of goalPositions) {
    const goalDate = new Date(pos.goal.targetDate);
    const year = goalDate.getFullYear();

    if (!seenYears.has(year)) {
      seenYears.add(year);
      marks.push({
        date: goalDate,
        xPosition: pos.xPosition,
        label: year.toString(),
        isYearStart: true,
        isMajor: true,
      });
    }
  }

  return marks;
}

/**
 * Generate axis marks for the timeline (months and years)
 */
export function generateAxisMarks(
  config: TimelineConfig,
  goalPositions?: TimelineGoalPosition[]
): TimelineAxisMark[] {
  // For compressed view, use simplified axis
  if (config.isCompressed && goalPositions) {
    return generateCompressedAxisMarks(
      goalPositions.map((p) => p.goal),
      goalPositions
    );
  }

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
