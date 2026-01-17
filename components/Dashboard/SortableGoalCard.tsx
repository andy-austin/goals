'use client';

import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Goal } from '@/types';
import { GoalCard } from './GoalCard';

interface SortableGoalCardProps {
  goal: Goal;
}

interface DragHandleProps {
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
}

function DragHandle({ listeners, attributes }: DragHandleProps) {
  return (
    <button
      type="button"
      className="flex h-8 w-6 cursor-grab items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 active:cursor-grabbing dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
      aria-label="Drag to reorder"
      {...attributes}
      {...listeners}
    >
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="9" cy="6" r="1.5" />
        <circle cx="15" cy="6" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="18" r="1.5" />
        <circle cx="15" cy="18" r="1.5" />
      </svg>
    </button>
  );
}

export function SortableGoalCard({ goal }: SortableGoalCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <GoalCard
      ref={setNodeRef}
      goal={goal}
      isDragging={isDragging}
      style={style}
      dragHandle={<DragHandle listeners={listeners} attributes={attributes} />}
    />
  );
}
