# Implementation Status

This document tracks the implementation progress of the Investment Goals application.

## Last Updated
2026-01-18

---

## Current Development Status

**Milestone 1: Project Setup & Foundation** - COMPLETE (5/5 issues completed)
**Milestone 2: Goal Creation Flow** - COMPLETE (8/8 issues completed)
**Milestone 3: AI-Powered Suggestions** - COMPLETE (6/6 issues completed)
**Milestone 4: Goal Templates & Examples** - COMPLETE (3/3 issues completed)
**Milestone 5: Prioritization UI** - COMPLETE (3/3 issues completed)

### Completed in This Session
- Issue #33: Implement Copy to Clipboard Functionality ✅ CLOSED
- Issue #36: Refactor Language Selector to use flags ✅ CLOSED
- Refactored `LanguageSwitcher` from a select dropdown to side-by-side flag buttons
- Used emoji flags (🇺🇸, 🇪🇸) for consistent visual representation
- Created reusable `Tooltip` component in `components/ui/Tooltip.tsx`
- Replaced native `title` attribute with custom Tooltip for instant feedback
- Integrated with `next-intl` for localized button titles
- Updated `i18n` config to remove unused `localeNames` constant
- Issue #27: Create Timeline Visualization Component ✅ CLOSED
- Issue #28: Create Goal Detail Modal/Sidebar ✅ CLOSED
- Horizontal scrollable timeline with goals positioned by target date
- Zoom controls (1 Year, 5 Years, 10+ Years, All)
- Goal clustering for close dates
- Click to view goal details modal
- Gantt Chart visualization with horizontal bars from Today to target date
- Cursor-following tooltips with goal info
- 14+ E2E tests for timeline functionality

---

## Completed Features

### Issue #27: Create Timeline Visualization Component
**Status:** ✅ Completed & Closed
**Files:**
- `components/Timeline/Timeline.tsx` - Main container with horizontal scroll
- `components/Timeline/TimelineAxis.tsx` - Grid lines and month/year labels
- `components/Timeline/TimelineGoalMarker.tsx` - Individual goal marker
- `components/Timeline/TimelineGoalCluster.tsx` - Grouped goals indicator
- `components/Timeline/TimelineTodayMarker.tsx` - "Today" vertical line
- `components/Timeline/TimelineZoomControls.tsx` - Zoom level buttons
- `components/Timeline/TimelineGoalTooltip.tsx` - Hover tooltip
- `components/Timeline/TimelineGapMarker.tsx` - Gap indicator for skipped time
- `components/Timeline/GanttChart.tsx` - Gantt chart visualization
- `components/Timeline/GanttRow.tsx` - Individual Gantt row
- `components/Timeline/useTimelineCalculations.ts` - Date-to-position hook
- `components/Timeline/timeline.types.ts` - TypeScript types
- `components/Timeline/index.ts` - Barrel exports
- `app/timeline/page.tsx` - Updated timeline page with modal
- `tests/timeline.spec.ts` - E2E tests (14+ tests)

**Features Implemented:**
- Horizontal scrollable timeline showing goals by target date
- Goals positioned by date with color-coding by bucket
- "Today" marker with label and vertical line
- Zoom levels: 1 Year, 5 Years, 10+ Years, All
- Goal clustering when dates are close (within 40px)
- Gap markers showing skipped time periods
- Click goal to open detail modal
- Hover tooltip with goal info (title, amount, date, days remaining)
- Bucket legend (Safety, Growth, Dream)
- Empty state with CTA to create goals
- Responsive design with horizontal scroll on mobile

**Gantt Chart Features (Bonus):**
- Horizontal bars from Today to target date for each goal
- Fixed left column with goal labels (title, amount, days remaining)
- Scrollable bar area with date labels (Today, months, years)
- Color-coded bars by bucket
- Cursor-following tooltips showing goal title and target date
- First row tooltip shows to the right (avoids top clipping)
- Other rows show tooltip above
- Click bar to open goal detail modal
- Responsive design (narrower labels on mobile)

**Component Architecture:**

| Component | Description |
|-----------|-------------|
| `Timeline` | Main container with scroll, zoom controls, legend |
| `TimelineAxis` | Month/year labels and vertical grid lines |
| `TimelineGoalMarker` | Single goal marker with bucket color |
| `TimelineGoalCluster` | Stacked indicator for close goals |
| `TimelineTodayMarker` | Red vertical line at current date |
| `TimelineZoomControls` | Button group for zoom levels |
| `TimelineGoalTooltip` | Hover info (title, amount, date) |

**Zoom Level Configuration:**

| Level | Time Span | Pixels/Day | Width |
|-------|-----------|------------|-------|
| 1year | 12 months | 3px | ~1,100px |
| 5years | 60 months | 1px | ~1,825px |
| 10years | 120 months | 0.5px | ~1,825px |
| all | Dynamic | Calculated | ~2,000px max |

**Hook API (useTimelineCalculations):**

| Property | Type | Description |
|----------|------|-------------|
| `config` | `TimelineConfig` | Current zoom configuration |
| `goalPositions` | `TimelineGoalPosition[]` | Goals with x positions |
| `clusters` | `GoalCluster[]` | Clustered goals |
| `axisMarks` | `TimelineAxisMark[]` | Month/year labels |
| `todayPosition` | `number` | X position of today marker |

---

### Issue #28: Create Goal Detail Modal/Sidebar
**Status:** ✅ Completed & Closed
**Files:**
- `app/timeline/page.tsx` - Modal implementation (lines 69-128)

**Features Implemented:**
- Modal displays all goal information:
  - Title and description
  - Target amount with currency formatting (Intl.NumberFormat)
  - Target date with locale formatting
  - "Why it matters" statement
- Opens from timeline marker click
- Opens from Gantt chart bar/row click
- Close via X button
- Close by clicking outside (backdrop)
- Responsive design (works on mobile)
- Focus management for accessibility

**Modal Content:**
| Section | Display |
|---------|---------|
| Title | Goal title as h2 heading |
| Description | Full description text |
| Target Amount | Formatted with currency symbol |
| Target Date | Formatted as "Mon DD, YYYY" |
| Why It Matters | Italic quote with border separator |

**Triggers:**
- `onGoalSelect` callback from `Timeline` component
- `onGoalSelect` callback from `GanttChart` component
- Both set `selectedGoal` state to open modal

---

### Issue #30: Create Summary Statistics Component
**Status:** ✅ Completed & Closed
**Files:**
- `components/Dashboard/SummaryStats.tsx` - Summary stats component

**Features Implemented:**
- Total goals count and amount display
- Bucket breakdown with icons (Safety, Growth, Dream)
- Next upcoming goal with days countdown
- Formatted currency display using Intl.NumberFormat
- Responsive design (stacks on mobile)

**Component Props:**

| Prop | Type | Description |
|------|------|-------------|
| `goals` | `Goal[]` | Array of goals to summarize |
| `totalAmount` | `number` | Pre-calculated total amount |

---

### Issue #33: Implement Copy to Clipboard Functionality
**Status:** ✅ Completed & Closed
**Files:**
- `lib/export.ts` - Export utilities (formatGoalsAsText, copyToClipboard)
- `lib/index.ts` - Updated exports
- `components/ui/Toast.tsx` - Toast notification component and provider
- `components/ui/index.ts` - Updated exports
- `components/Dashboard/SummaryStats.tsx` - Added copy button
- `app/providers.tsx` - Added ToastProvider
- `app/globals.css` - Added slide-in animation
- `messages/en.json` - English translations for export
- `messages/es.json` - Spanish translations for export

**Features Implemented:**
- `formatGoalsAsText(goals, locale)` - Formats goals as structured plain text
  - Header with generation date
  - Goals grouped by bucket (Safety, Growth, Dream)
  - Priority numbers, amounts, target dates, time remaining
  - Footer with total goals and amount
  - Full i18n support (English/Spanish)
- `copyToClipboard(text)` - Copies text with browser fallback
  - Uses modern Clipboard API when available
  - Falls back to textarea + execCommand for older browsers
- Toast notification system
  - `ToastProvider` wraps app in providers.tsx
  - `useToast()` hook for showing notifications
  - Auto-dismiss after 3 seconds
  - Slide-in animation
- Copy button in SummaryStats
  - Icon + label (label hidden on mobile)
  - Success/error toast feedback

**Toast API:**

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `showToast(message, type)` | `(string, 'success' \| 'error' \| 'info' \| 'warning') => void` | Show a toast notification |

**Translations Added:**
```json
"export": {
  "copy": "Copy",
  "copySuccess": "Goals copied to clipboard",
  "copyError": "Failed to copy"
}
```

---

### Issue #24: Create Bucket Section Component
**Status:** Completed
**Files:**
- `components/Dashboard/BucketSection.tsx`

**Features Implemented:**
- Collapsible bucket sections with accordion style
- Visual distinction for Safety, Growth, Dream buckets

### Issue #25: Create Goal Card Component
**Status:** Completed
**Files:**
- `components/Dashboard/GoalCard.tsx`

**Features Implemented:**
- Goal card with priority and due date indicators
- Overdue status calculation

### Issue #26: Implement Drag-and-Drop Goal Reordering
**Status:** Completed
**Files:**
- `components/Dashboard/SortableGoalCard.tsx` - New sortable wrapper component
- `components/Dashboard/GoalCard.tsx` - Updated with drag handle support
- `components/Dashboard/BucketSection.tsx` - Updated with DnD context
- `components/Dashboard/index.ts` - Updated exports

**Dependencies Added:**
- `@dnd-kit/core` - Core drag and drop functionality
- `@dnd-kit/sortable` - Sortable list utilities
- `@dnd-kit/utilities` - CSS transform utilities
- `@dnd-kit/modifiers` - Movement restriction modifiers

**Features Implemented:**
- Drag-and-drop reordering within each bucket
- Visual drag handle with 6-dot grip icon
- Smooth animations during drag
- Visual feedback while dragging (shadow, ring)
- Keyboard accessibility for reordering
- Vertical movement restriction
- Priority numbers auto-update after reorder
- Persists order to localStorage

**Component Architecture:**

| Component | Description |
|-----------|-------------|
| `SortableGoalCard` | Wrapper that adds dnd-kit sortable behavior |
| `GoalCard` | Base card with optional drag handle slot |
| `BucketSection` | Contains DndContext and SortableContext |
| `DragHandle` | 6-dot grip button for drag interaction |

**DnD Configuration:**
- `PointerSensor` with 8px activation distance
- `KeyboardSensor` with coordinate getter
- `closestCenter` collision detection
- Vertical axis restriction
- Parent element containment

**Accessibility Features:**
| Feature | Implementation |
|---------|----------------|
| Keyboard navigation | Arrow keys to move items |
| Focus management | Focus ring on drag handle |
| Screen reader | `aria-label` on drag handle |
| Activation | 8px movement threshold prevents accidental drags |

---

### Issue #29: Build Dashboard Page with Bucket View
**Status:** Completed
**Files:**
- `app/page.tsx`
- `components/Dashboard/index.ts`

**Features Implemented:**
- Updated Dashboard to use vertical prioritization layout
- Integrated BucketSection and GoalCard components

### Issue #20: Define Goal Templates Data Structure
**Status:** Completed
**Files:**
- `lib/templates.ts`
- `types/goal.ts`
- `lib/index.ts`

**Features Implemented:**
- Defined comprehensive `GOAL_TEMPLATES` data based on PRD
- 12 templates across Safety, Growth, and Dream buckets
- Full type safety with `GoalTemplate` interface

### Issue #23: Add Template Examples
**Status:** Completed
**Files:**
- `lib/templates.ts`

**Features Implemented:**
- Populated 12 distinct goal templates with seed data

### Issue #21: Create Template Selector Component
**Status:** Completed
**Files:**
- `components/GoalForm/TemplateSelector.tsx`
- `components/GoalForm/index.ts`

**Features Implemented:**
- Interactive template browser with bucket tabs
- Visual cards with hover effects and bucket coloring
- Responsive grid layout

### Issue #22: Integrate Templates into Creation Flow
**Status:** Completed
**Files:**
- `app/create/page.tsx`

**Features Implemented:**
- "Start from Scratch" vs "Choose Template" selection screen
- Smart pre-filling of wizard form data from template

### Issue #14: Setup AI Backend Integration & Multi-provider Support
**Status:** Completed
**Files:**
- `app/api/ai/suggest/route.ts`
- `.env.example`
- `TEST_GEMINI_SETUP.md`
- `scripts/`

**Features Implemented:**
- Configured Gemini and Claude providers
- Implemented robust provider selection logic
- Added verification and documentation
- Set up project structure for AI services

### Issue #23: Implement Bucket Grouping in Dashboard
**Status:** Completed
**Files:**
- `components/Dashboard/BucketSection.tsx`
- `components/Dashboard/GoalCard.tsx`
- `components/Dashboard/index.ts`
- `app/page.tsx`

**Features Implemented:**
- Created modular Dashboard components
- Implemented collapsible bucket sections with accordion style
- Added GoalCard with priority and due date indicators
- Updated Dashboard page to use vertical prioritization layout

### Issue #20: Define Goal Templates Data Structure
**Status:** Completed
**Files:**
- `lib/templates.ts`
- `types/goal.ts`
- `lib/index.ts`

**Features Implemented:**
- Defined comprehensive `GOAL_TEMPLATES` data based on PRD
- 12 templates across Safety, Growth, and Dream buckets
- Full type safety with `GoalTemplate` interface

### Issue #21: Create Template Selector Component
**Status:** Completed
**Files:**
- `components/GoalForm/TemplateSelector.tsx`
- `components/GoalForm/index.ts`

**Features Implemented:**
- Interactive template browser with bucket tabs
- Visual cards with hover effects and bucket coloring
- Responsive grid layout

### Issue #22: Integrate Templates into Creation Flow
**Status:** Completed
**Files:**
- `app/create/page.tsx`

**Features Implemented:**
- "Start from Scratch" vs "Choose Template" selection screen
- Smart pre-filling of wizard form data from template
- Automatic date calculation based on timeline months
- Smooth transition to wizard mode

### Issue #14: Setup AI Backend Integration & Multi-provider Support
**Status:** Completed
**Files:**
- `app/api/ai/suggest/route.ts`
- `.env.example`
- `TEST_GEMINI_SETUP.md`
- `scripts/`

**Features Implemented:**
- Configured Gemini and Claude providers
- Implemented robust provider selection logic
- Added verification and documentation
- Set up project structure for AI services

### Issue #19: Create AI Suggestion Chip Component
**Status:** Completed
**Files:**
- `components/ui/AISuggestionChip.tsx` - Main component with all states
- `components/ui/index.ts` - Updated exports
- `app/globals.css` - Added semantic color foreground tokens
- `messages/en.json` - English translations for AI namespace
- `messages/es.json` - Spanish translations for AI namespace

**Features Implemented:**
- Loading state with pulse animation and skeleton lines
- Ready state with suggestion text and accept/dismiss buttons
- Error state with retry option
- Smooth entrance/exit animations
- Full keyboard accessibility
- Screen reader support with ARIA attributes

**Component Props:**
| Prop | Type | Description |
|------|------|-------------|
| `suggestion` | `string \| null` | The AI-generated suggestion text |
| `isLoading` | `boolean` | Whether AI is generating a suggestion |
| `error` | `string` | Error message if generation failed |
| `onAccept` | `(suggestion: string) => void` | Callback when user accepts |
| `onDismiss` | `() => void` | Callback when user dismisses |
| `onRetry` | `() => void` | Callback to retry after error |
| `acceptLabel` | `string` | Custom label for accept button |
| `dismissLabel` | `string` | Custom label for dismiss button |
| `retryLabel` | `string` | Custom label for retry button |

**Design Tokens Added:**
- `--success-foreground` - Text color on success backgrounds
- `--warning-foreground` - Text color on warning backgrounds
- `--error-foreground` - Text color on error backgrounds
- `--info-foreground` - Text color on info backgrounds

**Accessibility Features:**
| Feature | Implementation |
|---------|----------------|
| Loading state | `role="status"` with `aria-label` |
| Error state | `role="alert"` for screen reader announcement |
| Ready state | `role="region"` with `aria-label` |
| Buttons | Keyboard accessible with focus rings |
| Screen reader | `sr-only` text for loading state |

---

### Issue #15: Implement AI Suggestion for Goal Description Refinement
**Status:** Completed
**Files:**
- `app/api/ai/suggest/route.ts` - API route for AI suggestions (supports multiple types)
- `hooks/useAISuggestion.ts` - Custom hook for fetching AI suggestions
- `hooks/index.ts` - Hooks exports
- `components/GoalForm/StepTitleDescription.tsx` - Updated with AI suggestion integration
- `.env.local.example` - Environment variable template

**Features Implemented:**
- Multi-provider AI support (Anthropic Claude and Google Gemini)
- Automatic provider selection based on available API keys
- AI suggestion API route with prompt engineering
- Custom useAISuggestion hook with loading/error states
- Integration with StepTitleDescription form step
- "AI Suggestion" button appears after user enters title or description
- Graceful degradation when API key not configured

**API Route Features:**
| Type | Description |
|------|-------------|
| `description` | Refines vague descriptions into SMART-compliant goals |
| `amount` | Suggests realistic amounts based on goal type |
| `bucket` | Classifies goals into Safety/Growth/Dream |
| `whyItMatters` | Generates emotionally resonant motivation statements |

**useAISuggestion Hook API:**
| Property/Method | Type | Description |
|-----------------|------|-------------|
| `suggestion` | `string \| null` | The current suggestion |
| `reasoning` | `string \| null` | Additional reasoning (if available) |
| `isLoading` | `boolean` | Whether generating |
| `error` | `string \| null` | Error message |
| `getSuggestion` | `(input, context?) => Promise<void>` | Trigger suggestion |
| `clearSuggestion` | `() => void` | Clear current suggestion |
| `retry` | `() => Promise<void>` | Retry last request |

**Environment Variables:**
```
ANTHROPIC_API_KEY=your-claude-key
# OR
GEMINI_API_KEY=your-gemini-key
# Optional
AI_PROVIDER=anthropic|gemini
```

---

### Issue #16: Implement AI Suggestion for Target Amounts
**Status:** Completed
**Files:**
- `components/GoalForm/StepAmountCurrency.tsx` - Updated with AI suggestion integration

**Features Implemented:**
- AI suggests realistic amounts based on goal type
- Shows formatted currency amount with reasoning
- Integrated with existing quick-select buttons

---

### Issue #17: Implement AI Suggestion for Bucket Classification
**Status:** Completed
**Files:**
- `components/GoalForm/StepBucket.tsx` - Updated with AI suggestion integration

**Features Implemented:**
- AI classifies goals into Safety/Growth/Dream buckets
- Shows bucket name with reasoning explanation
- Suggestion clears when user manually selects a bucket

---

### Issue #18: Implement AI Suggestion for "Why It Matters" Statement
**Status:** Completed
**Files:**
- `components/GoalForm/StepWhyItMatters.tsx` - Updated with AI suggestion integration

**Features Implemented:**
- AI generates emotionally resonant motivation statements
- Personalized based on goal title, description, amount, and bucket
- Works alongside existing example quick-fill buttons

---

### Issue #35: Set Up Internationalization (i18n)
**Status:** Completed
**Files:**
- `messages/en.json` - English translations
- `messages/es.json` - Spanish translations
- `i18n/config.ts` - Locale configuration
- `i18n/request.ts` - Server-side locale detection
- `i18n/index.ts` - i18n exports
- `app/actions/locale.ts` - Server action for changing locale
- `app/layout.tsx` - Updated with NextIntlClientProvider
- `next.config.ts` - Updated with next-intl plugin
- `components/LanguageSwitcher.tsx` - Language selector dropdown
- `components/Header.tsx` - Updated with translations and language switcher
- `app/page.tsx` - Dashboard page with translations

**Features Implemented:**
- Full Spanish and English translation support
- Cookie-based locale persistence (1 year expiry)
- Language switcher in header (desktop and mobile)
- Dashboard page fully translated
- Navigation labels translated
- Bucket names and descriptions translated
- Goal form step translations ready

**Translation Structure:**
| Namespace | Description |
|-----------|-------------|
| `common` | Shared strings (save, cancel, etc.) |
| `nav` | Navigation labels |
| `dashboard` | Dashboard page strings |
| `buckets` | Bucket names and descriptions |
| `goalForm` | Form wizard and step translations |
| `examples` | Goal example templates |
| `language` | Language selector labels |

**Technical Details:**
- Uses `next-intl` for App Router
- Non-URL-based routing (cookie-based locale)
- Server-side locale detection via cookies
- Client-side locale switching without page refresh

---

### Issue #13: Add Form Progress Indicator
**Status:** Completed
**Files:**
- `components/FormWizard/StepIndicator.tsx` - Enhanced with full accessibility support

**Features Implemented:**
- Visual progress indicator with step dots (desktop) and progress bar (mobile)
- Current step number and total display ("Step 2 of 5")
- Completed steps marked with checkmark icon
- Current step highlighted with primary color
- Screen reader live region for step change announcements
- Full ARIA support for accessibility

**Accessibility Features:**
| Feature | Implementation |
|---------|----------------|
| Progress bar | `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Step list | `aria-label` on each step with status (completed/current/upcoming) |
| Live region | `aria-live="polite"` announces step changes to screen readers |
| Current step | `aria-current="step"` marks active step |
| Hidden text | `sr-only` class for screen reader only content |

---

### Issue #12: Add SMART Validation Logic
**Status:** Completed
**Files:**
- `lib/validation.ts` - Centralized SMART validation logic
- `lib/index.ts` - Updated exports
- `components/GoalForm/SMARTValidationSummary.tsx` - Updated to use central validation
- `app/create/page.tsx` - Updated final validation in handleComplete

**Features Implemented:**
- Centralized validation function `validateSMART`
- Consistent validation rules across UI and submission
- Type-safe validation result interface
- Helper for timezone-safe date formatting (in summary component)

### Issue #11: Implement Step 5: Why It Matters
**Status:** Completed
**Files:**
- `components/GoalForm/StepWhyItMatters.tsx` - Step 5 form component
- `components/GoalForm/index.ts` - Updated exports
- `app/create/page.tsx` - Updated to use new step component

**Features Implemented:**
- Text area for emotional anchor statement
- Character count and validation (min 10 chars)
- SMART tip for "Relevant"
- Example buttons to quick-fill motivation text
- Final step integration in wizard

### Issue #10: Implement Step 4: Bucket Selection
**Status:** Completed
**Files:**
- `components/GoalForm/StepBucket.tsx` - Step 4 form component
- `components/GoalForm/index.ts` - Updated exports
- `app/create/page.tsx` - Updated to use new step component

**Features Implemented:**
- Interactive bucket selection cards (Safety, Growth, Dream)
- Dynamic styling based on bucket colors
- Integrated description and icons for each bucket
- Real-time validation (requires selection)
- Educational tip explaining the "Risk Allocation" concept

### Issue #9: Implement Step 3: Target Date Selection
**Status:** Completed
**Files:**
- `components/GoalForm/StepTargetDate.tsx` - Step 3 form component
- `components/GoalForm/index.ts` - Updated exports
- `app/create/page.tsx` - Updated to use new step component

**Features Implemented:**
- Date input with future date validation
- Quick select buttons (1, 3, 5, 10, 20 years)
- Dynamic "Time Horizon" display (e.g., "1 year and 6 months")
- SMART tip explaining the "Time-bound" criterion
- Validation state integrates with FormWizard navigation

### Issue #8: Implement Step 2: Amount and Currency
**Status:** Completed
**Files:**
- `components/GoalForm/StepAmountCurrency.tsx` - Step 2 form component
- `components/GoalForm/index.ts` - Updated exports
- `app/create/page.tsx` - Updated to use new step component

**Features Implemented:**
- Amount input with currency validation
- Currency selection dropdown (defaults to USD)
- Quick select buttons for common amounts
- Real-time validation (amount > 0)
- Visual currency prefix in input
- SMART tip explaining the "Measurable" criterion

### Issue #1: Goal Data Model and TypeScript Types
**Status:** Completed
**Files:**
- `types/goal.ts` - Core type definitions
- `types/index.ts` - Central export

**Types Implemented:**

| Type | Description | Location |
|------|-------------|----------|
| `Bucket` | Union type for goal categories (safety, growth, dream) | `types/goal.ts:16` |
| `Currency` | Supported currencies for goal amounts | `types/goal.ts:22` |
| `Goal` | Main goal interface with all SMART-compliant fields | `types/goal.ts:42` |
| `GoalTemplate` | Pre-defined goal template structure | `types/goal.ts:77` |
| `CreateGoalInput` | Input type for creating goals (excludes auto-generated fields) | `types/goal.ts:113` |
| `GoalFormInput` | Form input type with string dates for form handling | `types/goal.ts:118` |
| `GoalWithMeta` | Goal with computed display metadata | `types/goal.ts:131` |
| `FieldValidation` | Single field validation result | `types/goal.ts:148` |
| `SMARTValidation` | Complete SMART validation state | `types/goal.ts:156` |
| `GoalsByBucket` | Goals organized by bucket for display | `types/goal.ts:168` |

**Constants Implemented:**

| Constant | Description | Location |
|----------|-------------|----------|
| `BUCKET_CONFIG` | Display config for each bucket (label, colorVar, icon) | `types/goal.ts:182` |
| `CURRENCIES` | Array of all supported ISO 4217 currency codes | `types/goal.ts:214` |
| `BUCKETS` | Array of all bucket types | `types/goal.ts:253` |

**Utility Functions (Currency Formatting):**

Uses native `Intl.NumberFormat` - no external library needed.

| Function | Description | Location |
|----------|-------------|----------|
| `formatCurrency()` | Format amount with currency symbol, handles decimals/separators | `types/goal.ts:226` |
| `getCurrencyName()` | Get localized currency display name | `types/goal.ts:236` |
| `getCurrencyOptions()` | Get currency list for dropdowns | `types/goal.ts:243` |

**Supported Currencies:** USD, EUR, GBP, JPY, CAD, AUD, CHF, MXN, BRL, UYU

---

### Issue #2: State Management for Goals
**Status:** Completed
**Files:**
- `context/GoalsContext.tsx` - React Context, Provider, and useGoals hook
- `context/index.ts` - Central export
- `app/providers.tsx` - Client-side providers wrapper
- `app/layout.tsx` - Updated to wrap app with Providers

**State Management Approach:** React Context + useReducer

**Available Operations:**

| Method | Description | Signature |
|--------|-------------|-----------|
| `addGoal` | Add a new goal (auto-generates id, createdAt, priority) | `(input: CreateGoalInput) => Goal` |
| `getGoals` | Get all goals | `() => Goal[]` |
| `getGoalsByBucket` | Get goals filtered by bucket, sorted by priority | `(bucket: Bucket) => Goal[]` |
| `getAllGoalsByBucket` | Get all goals organized by bucket | `() => GoalsByBucket` |
| `updateGoalPriority` | Update a goal's priority | `(goalId: string, newPriority: number) => void` |
| `reorderGoalsInBucket` | Reorder goals by providing ordered IDs | `(bucket: Bucket, orderedIds: string[]) => void` |
| `getGoalById` | Get a single goal by ID | `(goalId: string) => Goal \| undefined` |

**Computed Values:**
- `goals` - All goals array
- `totalGoals` - Count of all goals
- `totalAmount` - Sum of all goal amounts

---

### Issue #3: Create Base Layout and Navigation
**Status:** Completed
**Files:**
- `components/Header.tsx` - Responsive header with navigation
- `components/index.ts` - Component exports
- `app/layout.tsx` - Updated root layout with Header
- `app/page.tsx` - Dashboard home page
- `app/create/page.tsx` - Goal creation page (placeholder)
- `app/timeline/page.tsx` - Timeline view page (placeholder)

**Features Implemented:**
- App header with logo/title
- Navigation between Dashboard, Create Goal, Timeline
- Responsive layout (mobile-first) with hamburger menu
- Active page indicator in navigation
- Consistent header across all pages

**Pages Created:**
| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Dashboard/Home | Functional with empty state |
| `/create` | Goal creation wizard | Placeholder |
| `/timeline` | Timeline visualization | Placeholder |

---

### Issue #4: Set Up Design Tokens and Theme
**Status:** Completed
**Files:**
- `app/globals.css` - Comprehensive CSS variables and Tailwind theme
- `components/ui/Button.tsx` - Button component with variants
- `components/ui/Card.tsx` - Card component with subcomponents
- `components/ui/Input.tsx` - Form input components
- `components/ui/Badge.tsx` - Badge and BucketBadge components
- `components/ui/index.ts` - UI component exports
- `types/goal.ts` - Updated BUCKET_CONFIG to use CSS variables

**Design Tokens (CSS Variables):**

| Category | Variables |
|----------|-----------|
| Colors | `--background`, `--foreground`, `--muted`, `--muted-foreground`, `--border` |
| Primary | `--primary`, `--primary-foreground`, `--primary-hover` |
| Secondary | `--secondary`, `--secondary-foreground`, `--secondary-hover` |
| Destructive | `--destructive`, `--destructive-foreground` |
| Bucket Safety | `--bucket-safety`, `--bucket-safety-light`, `--bucket-safety-dark` |
| Bucket Growth | `--bucket-growth`, `--bucket-growth-light`, `--bucket-growth-dark` |
| Bucket Dream | `--bucket-dream`, `--bucket-dream-light`, `--bucket-dream-dark` |
| Semantic | `--success`, `--warning`, `--error`, `--info` |
| Shadows | `--shadow-sm`, `--shadow`, `--shadow-md`, `--shadow-lg` |
| Radius | `--radius-sm`, `--radius`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full` |
| Ring | `--ring`, `--ring-offset` |

**UI Components Created:**

| Component | Variants | Description |
|-----------|----------|-------------|
| `Button` | primary, secondary, ghost, destructive | Sizes: sm, md, lg |
| `Card` | default, ghost | With CardHeader, CardContent, CardFooter, CardTitle, CardDescription |
| `Input` | - | With error state support |
| `Textarea` | - | With error state support |
| `Label` | - | With required indicator |
| `Select` | - | With error state support |
| `Badge` | default, secondary, success, warning, error, bucket | Sizes: sm, md |
| `BucketBadge` | - | Pre-styled badge with bucket icon |

**Bucket Color Scheme:**

| Bucket | Primary Color | CSS Variable |
|--------|--------------|--------------|
| Safety | Green | `--bucket-safety: #22c55e` |
| Growth | Blue | `--bucket-growth: #3b82f6` |
| Dream | Purple | `--bucket-dream: #a855f7` |

**Dark Mode:** Fully supported with automatic color adjustments via `prefers-color-scheme: dark`

---

### Issue #5: Configure Local Storage Persistence
**Status:** Completed
**Files:**
- `lib/storage.ts` - Storage utilities for localStorage operations
- `lib/index.ts` - Central export for lib utilities
- `context/GoalsContext.tsx` - Updated to load/save from localStorage

**Features Implemented:**
- Goals persist to localStorage on every state change
- Goals load from localStorage on app initialization
- Proper date serialization/deserialization (ISO strings)
- Graceful error handling for storage failures
- Schema versioning for future migrations
- Storage size monitoring (warns at 4MB)

**Storage Implementation:**

| Function | Description | Location |
|----------|-------------|----------|
| `loadGoals()` | Load goals from localStorage, returns empty array on error | `lib/storage.ts:54` |
| `saveGoals()` | Save goals to localStorage, returns success boolean | `lib/storage.ts:98` |
| `clearGoals()` | Remove all goals from localStorage | `lib/storage.ts:128` |
| `isStorageAvailable()` | Check if localStorage is available | `lib/storage.ts:140` |

**Storage Details:**
- Storage key: `investment-goals-v1`
- Schema version: 1 (for migration support)
- Handles SSR gracefully (no-op on server)
- Validates data structure on load
- Skips corrupted goals while preserving valid ones

---

### Issue #6: Create Multi-Step Form Wizard Component
**Status:** Completed
**Files:**
- `components/FormWizard/FormWizardContext.tsx` - Context and state management
- `components/FormWizard/FormWizard.tsx` - Main wrapper component
- `components/FormWizard/FormStep.tsx` - Step wrapper component
- `components/FormWizard/StepIndicator.tsx` - Progress indicator
- `components/FormWizard/FormWizardNav.tsx` - Navigation buttons
- `components/FormWizard/index.ts` - Central exports
- `app/create/page.tsx` - Updated with wizard implementation

**Features Implemented:**
- Step indicator showing current step and total steps
- Navigation (Next, Back buttons)
- Form state preserved across steps via React Context
- Validation support before proceeding to next step
- Responsive design (mobile progress bar, desktop step dots)
- Animated transitions between steps

**Components:**

| Component | Description |
|-----------|-------------|
| `FormWizard` | Main wrapper that provides context and layout |
| `FormStep` | Wrapper for individual step content, handles visibility |
| `StepIndicator` | Visual progress indicator (dots on desktop, bar on mobile) |
| `FormWizardNav` | Navigation buttons with validation support |
| `FormWizardProvider` | Context provider for wizard state |
| `useFormWizard` | Hook to access wizard state and actions |

**Hook API (useFormWizard):**

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `currentStep` | `number` | Current step index (0-based) |
| `totalSteps` | `number` | Total number of steps |
| `data` | `Partial<T>` | Accumulated form data |
| `isFirstStep` | `boolean` | Whether on first step |
| `isLastStep` | `boolean` | Whether on last step |
| `isCurrentStepValid` | `boolean` | Current step validation state |
| `nextStep()` | `() => void` | Go to next step |
| `prevStep()` | `() => void` | Go to previous step |
| `goToStep(n)` | `(n: number) => void` | Go to specific step |
| `updateData(d)` | `(d: Partial<T>) => void` | Update form data |
| `setStepValid(v)` | `(v: boolean) => void` | Set step validation |
| `reset()` | `() => void` | Reset wizard to initial state |

---

### Issue #7: Implement Step 1: Goal Title and Description
**Status:** Completed
**Files:**
- `components/GoalForm/StepTitleDescription.tsx` - Step 1 form component
- `components/GoalForm/index.ts` - GoalForm exports
- `app/create/page.tsx` - Updated to use new step component

**Features Implemented:**
- Title input with 3+ character validation
- Description textarea with 20+ character validation (SMART: Specific)
- Character count display for description
- Real-time validation with error messages
- SMART tip explaining the "Specific" criterion
- Clickable example cards that auto-fill form fields
- Validation state integrates with FormWizard navigation

**Validation Rules:**

| Field | Min Length | Max Length | Error Message |
|-------|-----------|-----------|---------------|
| Title | 3 | 100 | "Please enter a goal title (at least 3 characters)" |
| Description | 20 | 500 | "Please be specific about your goal (at least 20 characters)" |

---

## Project Structure

```
goals/
├── .ai/
│   ├── prd.md                # Product Requirements Document
│   └── implementation.md     # This file - implementation tracking
├── messages/
│   ├── en.json               # English translations
│   └── es.json               # Spanish translations
├── i18n/
│   ├── config.ts             # Locale configuration (locales, defaultLocale)
│   ├── request.ts            # Server-side request config for next-intl
│   └── index.ts              # i18n exports
├── app/
│   ├── actions/
│   │   └── locale.ts         # Server action for locale switching
│   ├── api/
│   │   └── ai/
│   │       └── suggest/
│   │           └── route.ts  # AI suggestion API endpoint
│   ├── create/
│   │   └── page.tsx          # Goal creation page (placeholder)
│   ├── timeline/
│   │   └── page.tsx          # Timeline view page (placeholder)
│   ├── globals.css           # Design tokens and Tailwind theme
│   ├── layout.tsx            # Root layout with Header
│   ├── page.tsx              # Dashboard home page
│   └── providers.tsx         # Client-side providers wrapper
├── hooks/
│   ├── useAISuggestion.ts    # Hook for AI-powered suggestions
│   └── index.ts              # Hooks exports
├── components/
│   ├── Dashboard/
│   │   ├── BucketSection.tsx     # Collapsible bucket section with DnD
│   │   ├── GoalCard.tsx          # Goal card with drag handle support
│   │   ├── SortableGoalCard.tsx  # Sortable wrapper for GoalCard
│   │   └── index.ts              # Dashboard component exports
│   ├── FormWizard/
│   │   ├── FormWizard.tsx        # Main wizard wrapper component
│   │   ├── FormWizardContext.tsx # Context and state management
│   │   ├── FormWizardNav.tsx     # Navigation buttons
│   │   ├── FormStep.tsx          # Step wrapper component
│   │   ├── StepIndicator.tsx     # Progress indicator
│   │   └── index.ts              # FormWizard exports
│   ├── GoalForm/
│   │   ├── StepTitleDescription.tsx  # Step 1: Title and description
│   │   └── index.ts              # GoalForm exports
│   ├── ui/
│   │   ├── AISuggestionChip.tsx # AI suggestion component for forms
│   │   ├── Badge.tsx         # Badge and BucketBadge components
│   │   ├── Button.tsx        # Button component
│   │   ├── Card.tsx          # Card and subcomponents
│   │   ├── Input.tsx         # Form input components
│   │   └── index.ts          # UI component exports
│   ├── Header.tsx            # App header with navigation
│   ├── LanguageSwitcher.tsx  # Language selector dropdown
│   └── index.ts              # Central component exports
├── context/
│   ├── GoalsContext.tsx      # Goals state management with persistence
│   └── index.ts              # Central context exports
├── lib/
│   ├── storage.ts            # localStorage persistence utilities
│   └── index.ts              # Central lib exports
├── types/
│   ├── goal.ts               # Goal-related types and constants
│   └── index.ts              # Central type exports
└── ...
```

---

## Usage Examples

### Importing Types and Utilities
```typescript
import { Goal, Bucket, Currency, BUCKET_CONFIG, formatCurrency } from '@/types';
import { loadGoals, saveGoals, isStorageAvailable } from '@/lib';

// Or import specific items
import { Goal, CreateGoalInput, GoalWithMeta } from '@/types/goal';
```

### Using UI Components
```typescript
import { Button, Card, CardContent, Badge, BucketBadge } from '@/components';

// Button variants
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Card with content
<Card>
  <CardContent>
    <p>Card content here</p>
  </CardContent>
</Card>

// Bucket badges
<BucketBadge bucket="safety" />  // Shows "Safety" with shield icon
<BucketBadge bucket="growth" />  // Shows "Growth" with trending-up icon
<BucketBadge bucket="dream" />   // Shows "Dream" with star icon
```

### Using the AI Suggestion Chip
```typescript
'use client';

import { useState } from 'react';
import { AISuggestionChip } from '@/components';

function MyForm() {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleAccept = (text: string) => {
    // Apply the suggestion to your form
    console.log('User accepted:', text);
  };

  const handleDismiss = () => {
    setSuggestion(null);
    setError(undefined);
  };

  const handleRetry = () => {
    // Retry fetching suggestion
    fetchSuggestion();
  };

  return (
    <AISuggestionChip
      suggestion={suggestion}
      isLoading={isLoading}
      error={error}
      onAccept={handleAccept}
      onDismiss={handleDismiss}
      onRetry={handleRetry}
      acceptLabel="Use this"
      dismissLabel="Dismiss"
      retryLabel="Retry"
    />
  );
}
```

### Using the Form Wizard
```typescript
'use client';

import { FormWizard, FormStep, useFormWizard } from '@/components';

interface MyFormData {
  name: string;
  email: string;
}

const STEPS = [
  { label: 'Name' },
  { label: 'Email' },
];

// Step component with validation
function NameStep() {
  const { data, updateData, setStepValid } = useFormWizard<MyFormData>();

  useEffect(() => {
    setStepValid(data.name?.length >= 2);
  }, [data.name, setStepValid]);

  return (
    <Input
      value={data.name || ''}
      onChange={(e) => updateData({ name: e.target.value })}
    />
  );
}

// Main form
function MyForm() {
  const handleComplete = (data: MyFormData) => {
    console.log('Form completed:', data);
  };

  return (
    <FormWizard<MyFormData>
      steps={STEPS}
      onComplete={handleComplete}
    >
      <FormStep step={0}>
        <NameStep />
      </FormStep>
      <FormStep step={1}>
        <EmailStep />
      </FormStep>
    </FormWizard>
  );
}
```

### Using Design Tokens
```css
/* In CSS/Tailwind */
.my-component {
  background: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}

/* With Tailwind classes */
<div className="bg-background text-foreground border border-border" />
<div className="bg-primary text-primary-foreground" />
<div className="bg-bucket-safety text-bucket-safety-dark" />
```

### Creating a Goal
```typescript
import { Goal, CreateGoalInput } from '@/types';

const newGoalInput: CreateGoalInput = {
  title: 'Emergency Fund',
  description: 'Build a safety net covering 6 months of expenses',
  amount: 15000,
  currency: 'USD',
  targetDate: new Date('2026-06-01'),
  bucket: 'safety',
  whyItMatters: 'Peace of mind for unexpected expenses',
};
```

### Using Bucket Config
```typescript
import { BUCKET_CONFIG, Bucket } from '@/types';

const bucket: Bucket = 'safety';
const config = BUCKET_CONFIG[bucket];

console.log(config.label);      // 'Safety'
console.log(config.colorVar);   // 'var(--bucket-safety)'
console.log(config.bgColorVar); // 'var(--bucket-safety-light)'
```

### Formatting Currency (uses native Intl API)
```typescript
import { formatCurrency, getCurrencyName, getCurrencyOptions } from '@/types';

// Format amount with currency
formatCurrency(15000, 'USD');           // '$15,000.00'
formatCurrency(15000, 'EUR', 'de-DE');  // '15.000,00 €'
formatCurrency(50000, 'UYU', 'es-UY');  // 'UYU 50.000,00'

// Get currency display name
getCurrencyName('USD');                 // 'US Dollar'
getCurrencyName('UYU', 'es');           // 'peso uruguayo'

// Get options for dropdown
getCurrencyOptions();  // [{ code: 'USD', name: 'US Dollar' }, ...]
```

### Using Storage Utilities (optional, auto-managed by context)
```typescript
import { loadGoals, saveGoals, clearGoals, isStorageAvailable } from '@/lib';

// Check if localStorage is available
if (isStorageAvailable()) {
  // Load goals from storage
  const goals = loadGoals();

  // Save goals to storage
  const success = saveGoals(goals);

  // Clear all goals
  clearGoals();
}
```

Note: You typically don't need to call these directly - the GoalsContext handles persistence automatically.

---

### Using the Sortable List Hook

```typescript
'use client';

import { useSortableList } from '@/hooks';

interface Item {
  id: string;
  name: string;
}

function MySortableList({ items }: { items: Item[] }) {
  const handleReorder = (orderedIds: string[]) => {
    console.log('New order:', orderedIds);
  };

  const { sensors, handleDragEnd } = useSortableList({
    items,
    onReorder: handleReorder,
    activationDistance: 8, // optional, default is 8
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(item => item.id)}>
        {items.map(item => (
          <SortableItem key={item.id} item={item} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

---

### Using Goals State (useGoals hook)
```typescript
'use client';

import { useGoals } from '@/context';
import type { CreateGoalInput } from '@/types';

function MyComponent() {
  const {
    goals,
    addGoal,
    getGoalsByBucket,
    reorderGoalsInBucket,
    totalGoals,
    totalAmount,
  } = useGoals();

  // Add a new goal
  const handleAddGoal = () => {
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
    console.log('Created goal:', newGoal.id);
  };

  // Get goals by bucket
  const safetyGoals = getGoalsByBucket('safety');

  // Reorder goals after drag-and-drop
  const handleReorder = (newOrder: string[]) => {
    reorderGoalsInBucket('safety', newOrder);
  };

  return (
    <div>
      <p>Total: {totalGoals} goals, ${totalAmount}</p>
      {/* ... */}
    </div>
  );
}
```

---

## E2E Testing

### Test Setup

The project uses Playwright for end-to-end testing.

**Configuration:** `playwright.config.ts`
- Base URL: `http://localhost:3000`
- Browser: Chromium (Firefox and WebKit available but disabled for faster development)
- Auto-starts dev server before tests

**Test Files:**
| File | Description | Tests |
|------|-------------|-------|
| `tests/dashboard.spec.ts` | Dashboard functionality | 9 tests |
| `tests/goal-creation.spec.ts` | Goal creation wizard flow | 11 tests |
| `tests/drag-and-drop.spec.ts` | DnD reordering | 4 tests |
| `tests/persistence.spec.ts` | localStorage persistence | 6 tests |
| `tests/timeline.spec.ts` | Timeline visualization | 14 tests |

### Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/dashboard.spec.ts

# Run with UI mode
npx playwright test --ui

# Run only Chromium
npx playwright test --project=chromium
```

### Test Coverage

| Feature | Coverage |
|---------|----------|
| Dashboard empty state | ✅ |
| Dashboard with goals | ✅ |
| Navigation | ✅ |
| Goal creation wizard (all steps) | ✅ |
| Template selection | ✅ |
| Drag-and-drop reordering | ✅ |
| localStorage persistence | ✅ |
| Error handling (corrupted data) | ✅ |
| Timeline visualization | ✅ |
| Timeline zoom controls | ✅ |
| Timeline goal clustering | ✅ |

### Key Testing Patterns

1. **localStorage Setup:** Use `page.addInitScript()` to set localStorage before page load
2. **Step Navigation:** Check for step content headings rather than step indicators
3. **Form Fields:** Use proper ARIA roles (`spinbutton` for number inputs)
4. **Button Matching:** Use `{ exact: true }` for buttons with common names like "Next"

---

## Pending Implementation

### Milestone 5: Prioritization UI - COMPLETE (3/3 issues)
- [x] Issue #26: Implement Drag-and-Drop Goal Reordering ✅
- [x] Issue #27: Create Timeline Visualization Component ✅ CLOSED
- [x] Issue #28: Create Goal Detail Modal/Sidebar ✅ CLOSED

### Milestone 6: Goal Summary & Export
- [x] Issue #30: Create Summary Statistics Component ✅ CLOSED
- [ ] Issue #31: Implement PDF Export Functionality
- [ ] Issue #32: Implement Print-Friendly View
- [x] Issue #33: Implement Copy to Clipboard Functionality ✅ CLOSED
- [ ] Issue #34: Create Export Menu Component

See GitHub Issues for full backlog:
- [Milestone 1: Project Setup & Foundation](https://github.com/andy-austin/goals/milestone/1) - 5/5 complete
- [Milestone 2: Goal Creation Flow](https://github.com/andy-austin/goals/milestone/2) - 8/8 complete
- [Milestone 3: AI-Powered Suggestions](https://github.com/andy-austin/goals/milestone/3) - 6/6 complete
- [Milestone 4: Goal Templates & Examples](https://github.com/andy-austin/goals/milestone/4) - 3/3 complete
- [Milestone 5: Prioritization UI](https://github.com/andy-austin/goals/milestone/5)
- [Milestone 6: Goal Summary & Export](https://github.com/andy-austin/goals/milestone/6)

---

## Next Steps (Suggested)

1. **Complete Milestone 2** - Implement form steps (Issues #7-13)
2. **AI Integration** (Milestone 3) - Claude API for suggestions
3. **Templates** (Milestone 4) - Pre-defined goal templates
4. **Prioritization UI** (Milestone 5) - Drag-and-drop reordering

---

## Git History (Recent)

```
0541492 Add form progress indicator accessibility (Issue #13)
8a4d8df Implement Step 1: Goal title and description (Issue #7)
f8906bb Create multi-step form wizard component (Issue #6)
30cbc77 Configure local storage persistence (Issue #5)
c82754a Set up design tokens and theme system (Issue #4)
43c6978 Create base layout and navigation (Issue #3)
db610ed Set up state management for goals (Issue #2)
2d71d2b Define Goal data model and TypeScript types (Issue #1)
```
