# Forms & Wizards

## Purpose
Documentation for multi-step forms and complex input flows, primarily the Goal Creation Wizard.

## Key Files

| File | Description |
|------|-------------|
| `components/FormWizard/FormWizard.tsx` | Main wizard container and logic |
| `components/FormWizard/FormWizardContext.tsx` | Context for wizard state |
| `components/GoalForm/index.ts` | Exports for goal form steps |
| `lib/validation.ts` | Centralized SMART validation logic |

---

## Goal Creation Wizard

A multi-step form for creating new investment goals, implementing the SMART framework.

### Steps

1. **Details:** Title and Description
2. **Amount:** Target Amount and Currency
3. **Date:** Target Date
4. **Category:** Bucket Selection (Safety, Growth, Dream)
5. **Why:** Motivation ("Why it matters")

### Components

#### StepTitleDescription
**File:** `components/GoalForm/StepTitleDescription.tsx`
- **Fields:** Title (text), Description (textarea)
- **Validation:** Title > 3 chars, Description > 20 chars
- **Features:** "SMART Tip" for Specificity, Example cards

#### StepAmountCurrency
**File:** `components/GoalForm/StepAmountCurrency.tsx`
- **Fields:** Amount (number), Currency (buttons + select)
- **Validation:** Amount > 0
- **Features:** Quick currency access (USD, UYU, UI), Currency formatting preview, Quick amount select buttons, "SMART Tip" for Measurability

#### StepTargetDate
**File:** `components/GoalForm/StepTargetDate.tsx`
- **Fields:** Target Date (date input)
- **Validation:** Future date required
- **Features:** Time horizon calculation (e.g., "5 years"), Quick select buttons (1y, 3y, etc.), "SMART Tip" for Time-bound

#### StepBucket
**File:** `components/GoalForm/StepBucket.tsx`
- **Fields:** Bucket (selection cards)
- **Validation:** Selection required
- **Features:** Visual cards with icons and descriptions for Safety, Growth, Dream buckets

#### StepWhyItMatters
**File:** `components/GoalForm/StepWhyItMatters.tsx`
- **Fields:** Why It Matters (textarea)
- **Validation:** > 10 chars
- **Features:** Character counter, Example motivations, "SMART Tip" for Relevance
- **Integration:** Displays `SMARTValidationSummary` when valid

#### SMARTValidationSummary
**File:** `components/GoalForm/SMARTValidationSummary.tsx`
- **Purpose:** Final review before submission
- **Features:** Checklist for SMART criteria, Goal Preview Card
- **Logic:** Uses `validateSMART` from `lib/validation.ts`

---

## Validation Logic

**File:** `lib/validation.ts`

Centralized validation function `validateSMART(data)` ensures data integrity.

```typescript
import { validateSMART } from '@/lib';

const result = validateSMART(formData);

if (result.isComplete) {
  // Proceed with submission
} else {
  // Show errors
  console.log(result.specific.message);
}
```

**Criteria:**
- **Specific:** Title (3+) & Description (20+)
- **Measurable:** Amount > 0
- **Achievable:** (Placeholder for AI check)
- **Relevant:** Why It Matters (10+)
- **Time-bound:** Date in future
- **Complete:** All required fields present (including Bucket & Currency)

---

## Usage Example

```tsx
import { FormWizard, FormStep, StepTitleDescription, StepAmountCurrency } from '@/components';

// In app/create/page.tsx
<FormWizard onComplete={handleSave}>
  <FormStep step={0}>
    <StepTitleDescription />
  </FormStep>
  <FormStep step={1}>
    <StepAmountCurrency />
  </FormStep>
  {/* ... other steps */}
</FormWizard>
```
