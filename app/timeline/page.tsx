'use client';

import { useState } from 'react';
import { useGoals } from '@/context';
import { Timeline, Card } from '@/components';
import { GanttChart, useTimelineCalculations } from '@/components/Timeline';
import type { ZoomLevel } from '@/components/Timeline/timeline.types';
import type { Goal } from '@/types';

export default function TimelinePage() {
  const { goals } = useGoals();
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('all');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Get timeline calculations for the Gantt chart
  const { config, todayPosition } = useTimelineCalculations(goals, zoomLevel);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Timeline
        </h1>
        <p className="mt-2 text-muted-foreground">
          Visualize your goals and milestones over time.
        </p>
      </div>

      {/* Timeline or Empty State */}
      {goals.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="mx-auto max-w-sm">
            <div className="mb-4 text-4xl">📅</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No goals yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first financial goal to see it on the timeline.
            </p>
            <a
              href="/create"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
            >
              Create a Goal
            </a>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          <Timeline
            goals={goals}
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            onGoalSelect={setSelectedGoal}
          />

          {/* Gantt Chart View */}
          <GanttChart
            goals={goals}
            config={config}
            todayPosition={todayPosition}
            onGoalSelect={setSelectedGoal}
          />
        </div>
      )}

      {/* Goal Detail Modal/Sidebar - Simple version for now */}
      {selectedGoal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedGoal(null)}
        >
          <Card
            className="relative max-w-lg w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedGoal(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Goal details */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground pr-8">
                {selectedGoal.title}
              </h2>
              <p className="text-muted-foreground">
                {selectedGoal.description}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-sm text-muted-foreground">Target Amount</div>
                  <div className="text-lg font-semibold text-foreground">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: selectedGoal.currency,
                    }).format(selectedGoal.amount)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Target Date</div>
                  <div className="text-lg font-semibold text-foreground">
                    {new Date(selectedGoal.targetDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
              {selectedGoal.whyItMatters && (
                <div className="pt-2 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-1">Why it matters</div>
                  <p className="text-foreground italic">&quot;{selectedGoal.whyItMatters}&quot;</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
