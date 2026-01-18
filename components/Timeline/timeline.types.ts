/**
 * Timeline Visualization Types
 * Types for the horizontal timeline component showing goals by target date
 */

import type { Goal } from '@/types';

/**
 * Available zoom levels for the timeline
 * - 'fit': Compresses gaps to fit all goals in view with ellipsis for large gaps
 */
export type ZoomLevel = '1year' | '5years' | '10years' | 'all';

/**
 * Configuration for the timeline based on zoom level
 */
/**
 * A gap/break in the timeline shown as ellipsis
 */
export interface TimelineGap {
  /** X position of the gap */
  xPosition: number;
  /** Start date of the gap */
  startDate: Date;
  /** End date of the gap */
  endDate: Date;
  /** Years skipped in this gap */
  yearsSkipped: number;
}

export interface TimelineConfig {
  /** Current zoom level */
  zoomLevel: ZoomLevel;
  /** Start date of the visible timeline (typically today) */
  startDate: Date;
  /** End date of the visible timeline */
  endDate: Date;
  /** Pixels per day for positioning */
  pixelsPerDay: number;
  /** Total width of the timeline in pixels */
  totalWidth: number;
  /** Whether this is a compressed "fit" view */
  isCompressed?: boolean;
  /** Gap markers for compressed view */
  gaps?: TimelineGap[];
}

/**
 * A goal with its calculated position on the timeline
 */
export interface TimelineGoalPosition {
  /** The goal data */
  goal: Goal;
  /** X position in pixels from left edge */
  xPosition: number;
  /** Whether this goal is visible in the current zoom level */
  isVisible: boolean;
}

/**
 * A cluster of goals that are close together on the timeline
 */
export interface GoalCluster {
  /** Unique ID for this cluster */
  id: string;
  /** Goals in this cluster */
  goals: Goal[];
  /** X position of the cluster center */
  xPosition: number;
  /** Earliest target date in the cluster */
  startDate: Date;
  /** Latest target date in the cluster */
  endDate: Date;
}

/**
 * A mark on the timeline axis (month or year label)
 */
export interface TimelineAxisMark {
  /** Date of this mark */
  date: Date;
  /** X position in pixels */
  xPosition: number;
  /** Display label (e.g., "Jan", "2027") */
  label: string;
  /** Whether this is a year start (for major gridlines) */
  isYearStart: boolean;
  /** Whether this is a major mark (years are major, months are minor) */
  isMajor: boolean;
}

/**
 * Props for the main Timeline component
 */
export interface TimelineProps {
  /** Goals to display on the timeline */
  goals: Goal[];
  /** Current zoom level */
  zoomLevel: ZoomLevel;
  /** Callback when zoom level changes */
  onZoomChange: (level: ZoomLevel) => void;
  /** Callback when a goal is selected */
  onGoalSelect?: (goal: Goal) => void;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Props for the TimelineGoalMarker component
 */
export interface TimelineGoalMarkerProps {
  /** Goal to display */
  goal: Goal;
  /** X position in pixels */
  xPosition: number;
  /** Callback when clicked */
  onClick?: (goal: Goal) => void;
}

/**
 * Props for the TimelineGoalCluster component
 */
export interface TimelineGoalClusterProps {
  /** Cluster data */
  cluster: GoalCluster;
  /** Callback when cluster is clicked */
  onClick?: (goals: Goal[]) => void;
}

/**
 * Props for the TimelineZoomControls component
 */
export interface TimelineZoomControlsProps {
  /** Current zoom level */
  currentLevel: ZoomLevel;
  /** Callback when zoom level changes */
  onChange: (level: ZoomLevel) => void;
}

/**
 * Props for the TimelineAxis component
 */
export interface TimelineAxisProps {
  /** Axis marks to display */
  marks: TimelineAxisMark[];
  /** Timeline configuration */
  config: TimelineConfig;
}

/**
 * Props for the TimelineTodayMarker component
 */
export interface TimelineTodayMarkerProps {
  /** X position of today marker */
  xPosition: number;
}

/**
 * Props for the TimelineGoalTooltip component
 */
export interface TimelineGoalTooltipProps {
  /** Goal to show info for */
  goal: Goal;
}

/**
 * Zoom level display configuration
 */
export const ZOOM_LEVELS: Record<ZoomLevel, { label: string; months: number }> = {
  'all': { label: 'All', months: 0 }, // Compresses to fit all goals
  '1year': { label: '1 Year', months: 12 },
  '5years': { label: '5 Years', months: 60 },
  '10years': { label: '10+ Years', months: 120 },
};
