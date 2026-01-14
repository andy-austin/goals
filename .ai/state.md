# State Management

## Purpose
Centralized state management for goals using React Context and useReducer. Provides a clean API for components to read and modify goal data.

## Key Files

| File | Description |
|------|-------------|
| `context/GoalsContext.tsx` | Context, Provider, reducer, and useGoals hook |
| `context/index.ts` | Barrel export |
| `app/providers.tsx` | Client-side providers wrapper |
| `app/layout.tsx` | Root layout that wraps app with Providers |

---

## Architecture

```
app/layout.tsx
    └── Providers (app/providers.tsx)
            └── GoalsProvider (context/GoalsContext.tsx)
                    └── App components (can use useGoals hook)
```

### Why Context + useReducer?
- **Simple**: No external dependencies
- **Type-safe**: Full TypeScript support
- **Predictable**: Actions describe state changes
- **Scalable**: Easy to add new actions as needed

---

## GoalsContext API

### State Shape
```typescript
interface GoalsState {
  goals: Goal[];
}
```

### Actions
```typescript
type GoalsAction =
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'UPDATE_GOAL_PRIORITY'; payload: { goalId: string; newPriority: number } }
  | { type: 'REORDER_GOALS_IN_BUCKET'; payload: { bucket: Bucket; orderedIds: string[] } };
```

---

## useGoals Hook

The primary way to interact with goals state.

### Import
```typescript
import { useGoals } from '@/context';
```

### Available Methods & Values

| Name | Type | Description |
|------|------|-------------|
| `goals` | `Goal[]` | All goals array |
| `totalGoals` | `number` | Count of all goals |
| `totalAmount` | `number` | Sum of all goal amounts |
| `addGoal` | `(input: CreateGoalInput) => Goal` | Add a new goal |
| `getGoals` | `() => Goal[]` | Get all goals |
| `getGoalsByBucket` | `(bucket: Bucket) => Goal[]` | Get goals filtered by bucket |
| `getAllGoalsByBucket` | `() => GoalsByBucket` | Get goals organized by bucket |
| `updateGoalPriority` | `(goalId: string, newPriority: number) => void` | Update priority |
| `reorderGoalsInBucket` | `(bucket: Bucket, orderedIds: string[]) => void` | Reorder goals |
| `getGoalById` | `(goalId: string) => Goal \| undefined` | Get single goal |

---

## Usage Examples

### Basic Usage
```typescript
'use client';

import { useGoals } from '@/context';

function GoalsList() {
  const { goals, totalGoals, totalAmount } = useGoals();

  return (
    <div>
      <p>You have {totalGoals} goals totaling ${totalAmount}</p>
      {goals.map(goal => (
        <div key={goal.id}>{goal.title}</div>
      ))}
    </div>
  );
}
```

### Adding a Goal
```typescript
'use client';

import { useGoals } from '@/context';
import type { CreateGoalInput } from '@/types';

function CreateGoalForm() {
  const { addGoal } = useGoals();

  const handleSubmit = () => {
    const input: CreateGoalInput = {
      title: 'Emergency Fund',
      description: 'Build a safety net covering 6 months of expenses',
      amount: 15000,
      currency: 'USD',
      targetDate: new Date('2026-06-01'),
      bucket: 'safety',
      whyItMatters: 'Peace of mind for unexpected expenses',
    };

    const newGoal = addGoal(input);
    console.log('Created goal with ID:', newGoal.id);
  };

  return <button onClick={handleSubmit}>Create Goal</button>;
}
```

### Getting Goals by Bucket
```typescript
'use client';

import { useGoals } from '@/context';

function SafetyGoals() {
  const { getGoalsByBucket } = useGoals();
  const safetyGoals = getGoalsByBucket('safety');

  return (
    <ul>
      {safetyGoals.map(goal => (
        <li key={goal.id}>{goal.title} - ${goal.amount}</li>
      ))}
    </ul>
  );
}
```

### Getting All Goals Organized by Bucket
```typescript
'use client';

import { useGoals } from '@/context';

function BucketOverview() {
  const { getAllGoalsByBucket } = useGoals();
  const { safety, growth, dream } = getAllGoalsByBucket();

  return (
    <div>
      <section>
        <h2>Safety ({safety.length})</h2>
        {/* render safety goals */}
      </section>
      <section>
        <h2>Growth ({growth.length})</h2>
        {/* render growth goals */}
      </section>
      <section>
        <h2>Dream ({dream.length})</h2>
        {/* render dream goals */}
      </section>
    </div>
  );
}
```

### Reordering Goals (for drag-and-drop)
```typescript
'use client';

import { useGoals } from '@/context';

function DraggableGoalList() {
  const { getGoalsByBucket, reorderGoalsInBucket } = useGoals();
  const safetyGoals = getGoalsByBucket('safety');

  const handleDragEnd = (result: { source: number; destination: number }) => {
    // Create new order based on drag result
    const items = Array.from(safetyGoals);
    const [reordered] = items.splice(result.source, 1);
    items.splice(result.destination, 0, reordered);

    // Update state with new order
    const orderedIds = items.map(goal => goal.id);
    reorderGoalsInBucket('safety', orderedIds);
  };

  return (
    // Drag-and-drop implementation
  );
}
```

---

## Auto-Generated Fields

When calling `addGoal()`, these fields are automatically generated:

| Field | Generation |
|-------|------------|
| `id` | `goal_${timestamp}_${random}` |
| `createdAt` | Current date/time |
| `priority` | Next available priority in bucket |

---

## Dependencies

**Depends on:**
- `@/types` - Goal, Bucket, CreateGoalInput, GoalsByBucket types

**Used by:**
- `app/page.tsx` - Dashboard displays goals
- Future: Goal creation form, timeline view, etc.

---

## Future Enhancements

- [ ] Persist goals to localStorage
- [ ] Add `updateGoal` action for editing
- [ ] Add `deleteGoal` action
- [ ] Add undo/redo support
- [ ] Sync with backend API
