'use client';

import { useCallback } from 'react';
import {
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

interface UseSortableListOptions<T extends { id: string }> {
  items: T[];
  onReorder: (orderedIds: string[]) => void;
  activationDistance?: number;
}

interface UseSortableListResult {
  sensors: ReturnType<typeof useSensors>;
  handleDragEnd: (event: DragEndEvent) => void;
}

/**
 * Custom hook for managing sortable list functionality with @dnd-kit
 * Extracts common DnD logic for reusability across different sortable components
 */
export function useSortableList<T extends { id: string }>({
  items,
  onReorder,
  activationDistance = 8,
}: UseSortableListOptions<T>): UseSortableListResult {
  // Configure sensors for both pointer and keyboard interactions
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: activationDistance, // Prevents accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end - compute new order and call callback
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          // Create new ordered array
          const newOrder = [...items];
          const [movedItem] = newOrder.splice(oldIndex, 1);
          newOrder.splice(newIndex, 0, movedItem);

          // Call callback with new order
          onReorder(newOrder.map((item) => item.id));
        }
      }
    },
    [items, onReorder]
  );

  return {
    sensors,
    handleDragEnd,
  };
}
