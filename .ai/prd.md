# Product Requirements Document (PRD)
# Investment Goals Definition & Prioritization Tool

## Document Info
- **Version:** 1.0
- **Status:** Draft
- **Last Updated:** 2026-01-13

---

## 1. Executive Summary

### Problem Statement
People starting their investment journey struggle to define proper financial goals. They often have vague intentions like "save money" or "invest for the future" without concrete, actionable targets. This lack of clarity leads to:
- Inconsistent saving behavior
- Early withdrawals due to weak emotional commitment
- Misaligned risk profiles for different goal types
- Difficulty prioritizing when resources are limited

### Solution
A guided goal-creation tool that helps beginner investors transform vague savings intentions into well-defined, SMART financial goals. The tool provides AI-powered suggestions, enforces proven frameworks, and offers intuitive visualization for prioritization.

### Target Users
- **Primary:** First-time investors taking personal finance courses
- **Characteristics:**
  - New to structured financial planning
  - Need guidance and examples
  - Struggling to articulate concrete goals
  - Want to organize multiple competing financial priorities

---

## 2. Core Frameworks

### 2.1 SMART Framework (Financial Adaptation)
Every goal must pass this validation filter:

| Criterion | Description | Example |
|-----------|-------------|---------|
| **Specific** | Not just "saving," but a clear purpose | "Down payment for a 2-bedroom apartment" |
| **Measurable** | Exact target amount | $50,000 |
| **Achievable** | Realistic based on user's situation | AI flags unrealistic goals |
| **Relevant** | Emotional "Why" that prevents early withdrawal | "To provide stability for my growing family" |
| **Time-bound** | Concrete target date | December 2028 |

### 2.2 Mental Accounting (Richard Thaler)
People naturally divide money into mental "buckets." The app leverages this by:

**Segmentation by Time Horizon:**
- **Short-term:** 0-2 years (vacations, emergency fund)
- **Medium-term:** 2-10 years (car, house down payment)
- **Long-term:** 10+ years (retirement, children's education)

**Risk Allocation Principle:**
- Short-term goals → Conservative/low-risk investments
- Long-term goals → Can tolerate higher risk/aggressive investments

### 2.3 The "3 Buckets" Methodology
Used for goal categorization and prioritization:

| Bucket | Type | Description | Examples |
|--------|------|-------------|----------|
| **Safety** | Static | Non-negotiable, urgent goals | Emergency Fund, Health expenses |
| **Growth** | Dynamic | Goals that improve standard of living | House, Education, Car |
| **Dream** | Speculative | Money you can afford to risk | Luxury travel, Starting a business |

---

## 3. MVP Scope

### 3.1 In Scope (MVP)
- Goal creation with guided multi-step form
- AI-powered suggestions for goal refinement
- SMART validation during creation
- User-assigned bucket classification
- Goal templates and examples
- Prioritization UI with:
  - Grouping by bucket
  - Drag-and-drop ranking within buckets
  - Visual timeline view
- Goal summary/dashboard
- Basic export (PDF, print, clipboard)

### 3.2 Out of Scope (MVP)
- Edit/Update existing goals
- Delete goals
- Progress tracking (savings progress bars)
- Bank/account integration
- Investment recommendations
- Multi-user/household support
- Mobile native app (web-responsive only)

---

## 4. Feature Requirements

### 4.1 Goal Creation Flow

**User Story:**
> As a beginner investor, I want to create a financial goal by answering guided questions, so that I define a complete and actionable goal.

**Multi-Step Form Fields:**

| Step | Field | Type | Required | Description |
|------|-------|------|----------|-------------|
| 1 | Goal Title | Text | Yes | Brief name (e.g., "House Down Payment") |
| 1 | Goal Description | Text | Yes | Specific description of the goal |
| 2 | Target Amount | Number | Yes | Exact amount needed |
| 2 | Currency | Select | Yes | Currency for the goal (USD, EUR, etc.) |
| 3 | Target Date | Date | Yes | When the money is needed |
| 4 | Bucket | Select | Yes | Safety / Growth / Dream |
| 5 | Why It Matters | Text | Yes | Emotional anchor statement |

**AI-Powered Assistance:**
- Suggest goal refinements (vague → specific)
- Recommend realistic amounts based on goal type
- Flag potentially unrealistic timelines
- Suggest appropriate bucket based on time horizon
- Provide example "why it matters" statements

**SMART Validation Rules:**
- **Specific:** Description must be > 20 characters
- **Measurable:** Amount must be > 0
- **Achievable:** AI provides feasibility feedback (non-blocking)
- **Relevant:** "Why it matters" must be > 10 characters
- **Time-bound:** Date must be in the future

**Acceptance Criteria:**
- [ ] User cannot proceed to next step without completing required fields
- [ ] AI provides at least one suggestion per field where applicable
- [ ] Validation errors are displayed inline with clear messaging
- [ ] Goal is only saved after passing all SMART criteria
- [ ] Form state is preserved if user navigates back

---

### 4.2 Goal Templates & Examples

**User Story:**
> As a beginner investor, I want to see example goals, so that I understand what a well-formed goal looks like and get ideas.

**Template Categories:**

**Safety Bucket Templates:**
| Template | Typical Amount | Typical Timeline |
|----------|---------------|------------------|
| Emergency Fund | 3-6 months expenses | 6-12 months |
| Health Insurance Deductible | $1,000 - $5,000 | 3-6 months |
| Job Loss Buffer | 6-12 months expenses | 1-2 years |

**Growth Bucket Templates:**
| Template | Typical Amount | Typical Timeline |
|----------|---------------|------------------|
| House Down Payment | $20,000 - $100,000 | 3-7 years |
| New Car | $15,000 - $40,000 | 2-4 years |
| Wedding | $10,000 - $50,000 | 1-3 years |
| Education/Certification | $5,000 - $50,000 | 1-5 years |
| Home Renovation | $10,000 - $50,000 | 1-3 years |

**Dream Bucket Templates:**
| Template | Typical Amount | Typical Timeline |
|----------|---------------|------------------|
| Luxury Vacation | $5,000 - $20,000 | 1-3 years |
| Sabbatical Year | $20,000 - $50,000 | 3-5 years |
| Starting a Business | $10,000 - $100,000 | 2-5 years |
| Early Retirement Boost | Variable | 10+ years |

**Template Data Structure:**
Each template includes:
- Pre-filled title and description
- Suggested amount range
- Suggested timeline
- Pre-assigned bucket
- Sample "why it matters" statement

**Acceptance Criteria:**
- [ ] User can browse templates by bucket category
- [ ] Selecting a template pre-fills the goal creation form
- [ ] All template values are editable by user
- [ ] Templates show typical ranges, not fixed values

---

### 4.3 Prioritization UI

**User Story:**
> As a user with multiple goals, I want to visualize and prioritize my goals, so that I can focus on what matters most.

#### 4.3.1 Bucket-Based Grouping

**Requirements:**
- Goals displayed in three distinct sections: Safety, Growth, Dream
- Each bucket has visual distinction (color, icon, header)
- Sections are collapsible/expandable
- Each section shows count of goals within
- Empty buckets show helpful placeholder text

**Visual Design:**
| Bucket | Color Theme | Icon |
|--------|-------------|------|
| Safety | Green | Shield |
| Growth | Blue | TrendingUp |
| Dream | Purple | Star |

#### 4.3.2 Drag-and-Drop Ranking

**Requirements:**
- Within each bucket, goals can be reordered via drag-and-drop
- Priority number auto-updates based on position (1 = highest)
- Visual feedback during drag (shadow, placeholder)
- Smooth animation on drop
- Touch-friendly for mobile devices

**Acceptance Criteria:**
- [ ] Drag handle is clearly visible
- [ ] Dragging shows visual feedback
- [ ] Drop updates priority numbers immediately
- [ ] Order persists after page refresh
- [ ] Works on touch devices

#### 4.3.3 Visual Timeline View

**Requirements:**
- Horizontal timeline showing all goals by target date
- Goals represented as cards/markers on timeline
- Color-coded by bucket
- Click/tap goal to see details in modal/sidebar
- Zoom controls: 1 year, 5 years, 10+ years, All
- Today marker clearly visible
- Goals cluster appropriately when dates are close

**Acceptance Criteria:**
- [ ] Timeline accurately positions goals by date
- [ ] Bucket colors are consistent with list view
- [ ] Zoom levels work correctly
- [ ] Goal details accessible from timeline
- [ ] Responsive on mobile (horizontal scroll)

---

### 4.4 Goal Summary & Export

**User Story:**
> As a user who has defined my goals, I want to see a summary and export my prioritized goals for my investment planning.

**Dashboard View:**
- Summary statistics:
  - Total number of goals
  - Goals per bucket
  - Total amount across all goals
  - Nearest upcoming goal
- Goal cards showing:
  - Title and description
  - Amount and currency
  - Target date
  - Days remaining
  - Bucket indicator
  - Priority within bucket

**Export Options:**
| Format | Description |
|--------|-------------|
| PDF | Formatted document with all goal details |
| Print | Print-optimized view |
| Clipboard | Copy formatted text summary |

**Acceptance Criteria:**
- [ ] Dashboard loads with all user goals
- [ ] Statistics are accurate and update in real-time
- [ ] PDF export includes all goal details
- [ ] Print view is properly formatted
- [ ] Clipboard copy includes structured goal list

---

## 5. Technical Requirements

### 5.1 Data Model

```typescript
interface Goal {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: Currency;
  targetDate: Date;
  bucket: Bucket;
  whyItMatters: string;
  priority: number; // Within bucket, 1 = highest
  createdAt: Date;
}

type Bucket = 'safety' | 'growth' | 'dream';

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'MXN' | 'BRL' | 'OTHER';

interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  bucket: Bucket;
  suggestedAmountMin: number;
  suggestedAmountMax: number;
  suggestedTimelineMonths: number;
  sampleWhyItMatters: string;
}
```

### 5.2 AI Integration

**Purpose:** Provide intelligent suggestions during goal creation

**Capabilities Required:**
- Goal description refinement (vague → specific)
- Amount suggestions based on goal type
- Timeline reasonableness assessment
- "Why it matters" statement suggestions
- Bucket recommendation based on inputs

**Integration Approach:**
- Use Claude API or similar LLM
- Asynchronous calls (don't block form progression)
- Suggestions displayed as dismissible chips/cards
- User can accept, modify, or ignore suggestions

**Prompt Contexts:**
- Goal type and description provided by user
- Typical ranges from template data
- User's other goals (for context)

### 5.3 Tech Stack (Aligned with CLAUDE.md)

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1.1 (App Router) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| State | React Context or Zustand |
| Drag-and-Drop | @dnd-kit or react-beautiful-dnd |
| Timeline | Custom or react-chrono |
| AI | Anthropic Claude API |
| Storage | Local Storage (MVP) / Database (future) |
| Export | jsPDF, html2canvas |

### 5.4 UI Components Needed

| Component | Purpose |
|-----------|---------|
| `MultiStepForm` | Wizard-style goal creation |
| `FormStep` | Individual step container |
| `AIsuggestionChip` | Display AI suggestions |
| `BucketSection` | Collapsible goal group |
| `GoalCard` | Individual goal display |
| `DraggableGoalList` | Sortable goal list |
| `TimelineView` | Horizontal timeline visualization |
| `GoalModal` | Goal detail view |
| `TemplateSelector` | Browse and select templates |
| `ExportMenu` | Export options dropdown |

---

## 6. User Flows

### 6.1 Goal Creation Flow

```
[Landing Page]
      │
      ▼
[Start New Goal] ──or── [Choose Template]
      │                        │
      ▼                        ▼
[Step 1: What & Why]    [Template Selected]
   - Title                     │
   - Description               │
   - AI suggestions ───────────┘
      │
      ▼
[Step 2: How Much]
   - Amount
   - Currency
   - AI amount suggestions
      │
      ▼
[Step 3: When]
   - Target date
   - AI timeline feedback
      │
      ▼
[Step 4: Categorize]
   - Select bucket
   - AI bucket suggestion
      │
      ▼
[Step 5: Commit]
   - Why it matters
   - AI statement suggestions
   - SMART validation summary
      │
      ▼
[Goal Created] → [Dashboard]
```

### 6.2 Prioritization Flow

```
[Dashboard]
      │
      ├─── [Bucket View]
      │       - See goals grouped by bucket
      │       - Drag to reorder within bucket
      │       - Collapse/expand sections
      │
      ├─── [Timeline View]
      │       - See goals on timeline
      │       - Zoom in/out
      │       - Click for details
      │
      └─── [Export]
              - Generate PDF
              - Print
              - Copy to clipboard
```

---

## 7. Success Metrics (Future Consideration)

| Metric | Description | Target |
|--------|-------------|--------|
| Goal Completion Rate | % of users who finish creating a goal | > 80% |
| Goals per User | Average number of goals created | > 3 |
| AI Suggestion Acceptance | % of AI suggestions accepted | > 40% |
| Template Usage | % of goals started from templates | > 30% |
| Return Rate | % of users who return within 7 days | > 50% |

---

## 8. Future Considerations (Post-MVP)

### Phase 2
- Edit and delete goals
- Progress tracking with savings updates
- Goal sharing (with advisor/partner)

### Phase 3
- Bank account integration
- Automatic progress updates
- Investment recommendations per goal
- Notifications and reminders

### Phase 4
- Multi-user/household support
- Goal collaboration
- Mobile native apps
- Advanced analytics

---

## 9. Open Questions

1. **Data Persistence:** Should MVP use local storage only, or implement a simple backend from the start?
2. **Authentication:** Is user login required for MVP, or anonymous usage with optional account creation?
3. **Currency Handling:** Should we support currency conversion or just display in user's chosen currency?
4. **AI Costs:** How to handle AI API costs - rate limiting, caching responses, or user-pays model?

---

## Appendix A: Competitive Analysis

| Product | Strengths | Gaps Our App Fills |
|---------|-----------|-------------------|
| Mint Goals | Bank integration | No SMART framework, limited guidance |
| YNAB | Envelope budgeting | Complex for beginners, no AI |
| Personal Capital | Investment focus | Not goal-creation focused |
| Spreadsheets | Flexible | No guidance, no visualization |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| SMART | Specific, Measurable, Achievable, Relevant, Time-bound |
| Mental Accounting | Cognitive tendency to categorize money into separate "accounts" |
| Bucket | Category for goals based on priority and risk tolerance |
| Time Horizon | Duration between now and when money is needed |
| Emotional Anchor | The personal "why" that motivates goal adherence |
