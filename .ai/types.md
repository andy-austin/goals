# Type Definitions

## Purpose
Core TypeScript type definitions for the Investment Goals application. Based on SMART framework and 3 Buckets methodology.

## Key Files

| File | Description |
|------|-------------|
| `types/goal.ts` | All goal-related types, interfaces, and utilities |
| `types/index.ts` | Barrel export for types |

---

## Core Types

### Bucket
Goal categorization based on the 3 Buckets methodology.

```typescript
type Bucket = 'safety' | 'growth' | 'dream';
```

| Value | Description | Examples |
|-------|-------------|----------|
| `safety` | Non-negotiable, urgent goals | Emergency Fund, Health |
| `growth` | Goals that improve standard of living | House, Education, Car |
| `dream` | Aspirational goals you can afford to risk | Luxury travel, Business |

### Currency
Supported ISO 4217 currency codes.

```typescript
type Currency =
  | 'USD'  // US Dollar
  | 'EUR'  // Euro
  | 'GBP'  // British Pound
  | 'JPY'  // Japanese Yen
  | 'CAD'  // Canadian Dollar
  | 'AUD'  // Australian Dollar
  | 'CHF'  // Swiss Franc
  | 'MXN'  // Mexican Peso
  | 'BRL'  // Brazilian Real
  | 'UYU'; // Uruguayan Peso
```

---

## Interfaces

### Goal
Main goal interface with all SMART-compliant fields.

```typescript
interface Goal {
  id: string;              // Unique identifier (auto-generated)
  title: string;           // Short name, e.g., "House Down Payment"
  description: string;     // Detailed description (SMART: Specific)
  amount: number;          // Target amount (SMART: Measurable)
  currency: Currency;      // Currency for the amount
  targetDate: Date;        // Target date (SMART: Time-bound)
  bucket: Bucket;          // Category bucket
  whyItMatters: string;    // Emotional anchor (SMART: Relevant)
  priority: number;        // Priority within bucket (1 = highest)
  createdAt: Date;         // Creation timestamp
}
```

### GoalTemplate
Pre-defined goal templates for quick creation.

```typescript
interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  bucket: Bucket;
  suggestedAmountMin: number;
  suggestedAmountMax: number;
  suggestedTimelineMonths: number;
  sampleWhyItMatters: string;
  icon?: string;
}
```

### CreateGoalInput
Input type for creating goals (excludes auto-generated fields).

```typescript
type CreateGoalInput = Omit<Goal, 'id' | 'createdAt' | 'priority'>;
```

### GoalFormInput
Form input type with string dates for form handling.

```typescript
interface GoalFormInput {
  title: string;
  description: string;
  amount: number;
  currency: Currency;
  targetDate: string;  // ISO date string
  bucket: Bucket;
  whyItMatters: string;
}
```

### GoalWithMeta
Goal with computed display metadata.

```typescript
interface GoalWithMeta extends Goal {
  daysRemaining: number;
  monthsRemaining: number;
  isOverdue: boolean;
  timeHorizon: 'short' | 'medium' | 'long';
}
```

### GoalsByBucket
Goals organized by bucket for display.

```typescript
interface GoalsByBucket {
  safety: Goal[];
  growth: Goal[];
  dream: Goal[];
}
```

### Validation Types
```typescript
interface FieldValidation {
  isValid: boolean;
  message?: string;
}

interface SMARTValidation {
  specific: FieldValidation;
  measurable: FieldValidation;
  achievable: FieldValidation;
  relevant: FieldValidation;
  timeBound: FieldValidation;
  isComplete: boolean;
}
```

---

## Constants

### BUCKET_CONFIG
Display configuration for each bucket.

```typescript
const BUCKET_CONFIG: Record<Bucket, {
  label: string;
  colorVar: string;      // CSS variable reference
  bgColorVar: string;    // CSS variable reference
  icon: string;
  description: string;
}>;
```

| Bucket | Label | Color | Icon |
|--------|-------|-------|------|
| safety | Safety | Green | shield |
| growth | Growth | Blue | trending-up |
| dream | Dream | Purple | star |

**Usage:**
```typescript
import { BUCKET_CONFIG } from '@/types';

const config = BUCKET_CONFIG['safety'];
// config.label → 'Safety'
// config.colorVar → 'var(--bucket-safety)'
// config.bgColorVar → 'var(--bucket-safety-light)'
```

### CURRENCIES
Array of all supported currency codes.

```typescript
const CURRENCIES: Currency[] = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'MXN', 'BRL', 'UYU'
];
```

### BUCKETS
Array of all bucket types.

```typescript
const BUCKETS: Bucket[] = ['safety', 'growth', 'dream'];
```

---

## Utility Functions

### formatCurrency
Format amount with currency symbol using native Intl API.

```typescript
function formatCurrency(
  amount: number,
  currency: Currency,
  locale?: string
): string;
```

**Examples:**
```typescript
formatCurrency(15000, 'USD');           // '$15,000.00'
formatCurrency(15000, 'EUR', 'de-DE');  // '15.000,00 €'
formatCurrency(50000, 'JPY');           // '¥50,000'
formatCurrency(1000, 'UYU', 'es-UY');   // 'UYU 1.000,00'
```

### getCurrencyName
Get localized display name for a currency.

```typescript
function getCurrencyName(
  currency: Currency,
  locale?: string
): string;
```

**Examples:**
```typescript
getCurrencyName('USD');           // 'US Dollar'
getCurrencyName('EUR', 'de');     // 'Euro'
getCurrencyName('UYU', 'es');     // 'peso uruguayo'
```

### getCurrencyOptions
Get currency list for dropdown selectors.

```typescript
function getCurrencyOptions(
  locale?: string
): Array<{ code: Currency; name: string }>;
```

**Example:**
```typescript
getCurrencyOptions();
// [
//   { code: 'USD', name: 'US Dollar' },
//   { code: 'EUR', name: 'Euro' },
//   ...
// ]
```

---

## Usage Examples

### Importing Types
```typescript
// Import everything
import { Goal, Bucket, Currency, BUCKET_CONFIG, formatCurrency } from '@/types';

// Import specific items
import type { Goal, CreateGoalInput } from '@/types/goal';
```

### Creating a Goal Input
```typescript
import type { CreateGoalInput } from '@/types';

const newGoal: CreateGoalInput = {
  title: 'Emergency Fund',
  description: 'Build a safety net covering 6 months of expenses',
  amount: 15000,
  currency: 'USD',
  targetDate: new Date('2026-06-01'),
  bucket: 'safety',
  whyItMatters: 'Peace of mind for unexpected expenses',
};
```

### Working with Buckets
```typescript
import { BUCKETS, BUCKET_CONFIG, type Bucket } from '@/types';

// Iterate over all buckets
BUCKETS.forEach((bucket: Bucket) => {
  const config = BUCKET_CONFIG[bucket];
  console.log(`${config.label}: ${config.description}`);
});
```

### Formatting Currency in Components
```typescript
import { formatCurrency, type Goal } from '@/types';

function GoalAmount({ goal }: { goal: Goal }) {
  return <span>{formatCurrency(goal.amount, goal.currency)}</span>;
}
```

### Currency Dropdown
```typescript
import { getCurrencyOptions, type Currency } from '@/types';

function CurrencySelect({ value, onChange }: {
  value: Currency;
  onChange: (c: Currency) => void;
}) {
  const options = getCurrencyOptions();

  return (
    <select value={value} onChange={e => onChange(e.target.value as Currency)}>
      {options.map(opt => (
        <option key={opt.code} value={opt.code}>
          {opt.code} - {opt.name}
        </option>
      ))}
    </select>
  );
}
```

---

## Dependencies

**Depends on:**
- Native `Intl.NumberFormat` and `Intl.DisplayNames` APIs

**Used by:**
- `context/GoalsContext.tsx` - State management
- `components/ui/Badge.tsx` - BucketBadge
- `app/page.tsx` - Dashboard
- All components that work with goals

---

## Adding New Types

1. Add type definition to `types/goal.ts`
2. Export from `types/index.ts`
3. Update this documentation
4. Add usage examples
