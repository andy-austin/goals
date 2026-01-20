# Product Roadmap & Opportunity Analysis

**Created:** 2026-01-19
**Status:** Planning

---

## Current State Summary

### What's Built (MVP Complete)
- Goal creation with SMART validation
- 12 goal templates across 3 buckets (Safety, Growth, Dream)
- Dashboard with bucket grouping & drag-and-drop prioritization
- Timeline visualization with Gantt chart
- Full i18n (English/Spanish)
- localStorage persistence
- Print export

### The Gap
The app excels at *goal planning* but stops there. Users define goals, then... nothing. There's no support for *goal execution*.

```
CURRENT APP                    THE GAP                 REAL NEED
─────────────────────────────────────────────────────────────────
Define Goal → Prioritize → ??? → Actually save → Invest → Achieve
     ✅           ✅       ❌           ❌          ❌        ❌
```

Once goals are created, users need:
1. **Actionable guidance** — "What do I do now?"
2. **Regular reinforcement** — "Stay on track"
3. **Progress visibility** — "How am I doing?"
4. **Next steps** — "Where should I put this money?"

---

## Feature Roadmap

### Phase 2A: Core Execution (High Impact, Medium Effort)

| Feature | Value | Description |
|---------|-------|-------------|
| **Progress Tracking** | High | Shows users their journey, creates satisfaction loop |
| **Savings Calculator** | High | "Save $X/month to reach goal" — instant actionability |
| **Edit Goals** | Medium | Required for real usage, life changes |
| **Goal Completion** | Medium | Celebrate wins, archive completed goals |

### Phase 2B: Retention & Engagement

| Feature | Value | Description |
|---------|-------|-------------|
| **Email/Push Notifications** | High | "Deposit $200 this week for your House Fund" |
| **Calendar Integration** | Medium | Add recurring deposit reminders to Google/Apple Calendar |
| **Monthly Summary** | Medium | Progress report email keeps users engaged |
| **Streak/Consistency Tracking** | Medium | Gamification for regular savers |

### Phase 3: Education & Guidance

| Feature | Value | Description |
|---------|-------|-------------|
| **Investment Instrument Suggestions** | High | "For 5-year goals, consider: CDs, bonds, index funds" |
| **Risk Education** | Medium | Help users understand bucket-to-risk mapping |
| **Savings Strategies** | Medium | "Snowball" vs "Avalanche", automation tips |
| **Benchmark Comparison** | Low | "Others save avg $X/month for similar goals" |

---

## Detailed Feature Specifications

### 1. Progress Tracking + Savings Calculator

**Priority:** P0 (Do First)

This unlocks the execution loop. Goal card would show:

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 House Down Payment                                      │
│  ━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░░░░░░░░  42%          │
│                                                             │
│  💰 $21,000 / $50,000                                       │
│  📅 Target: March 2028 (26 months away)                     │
│                                                             │
│  ⚡ To stay on track: Save $1,115/month                     │
│                                                             │
│  [+ Log Deposit]  [Set Reminder]                           │
└─────────────────────────────────────────────────────────────┘
```

**Data Model Addition:**
```typescript
interface Deposit {
  id: string;
  goalId: string;
  amount: number;
  date: Date;
  note?: string;
}

interface Goal {
  // ... existing fields
  currentAmount: number;  // Sum of deposits
  deposits: Deposit[];
}
```

**Why first:** Without this, the app is a one-time planning tool, not a recurring engagement tool.

---

### 2. Edit Goals

**Priority:** P0

Users need to modify goals as life changes:
- Income changes → adjust amounts or timelines
- Priorities shift → change bucket
- Goals become clearer → refine description

**Implementation:**
- Reuse existing multi-step form
- Pre-fill with current goal data
- Add "Edit" button to goal cards
- Preserve deposit history when editing

---

### 3. Goal Completion & Archiving

**Priority:** P1

When users achieve goals:
- Mark as completed (checkbox or button)
- Move to "Completed" section
- Celebration animation/confetti
- Option to delete or archive
- Completed goals section in dashboard

---

### 4. Notifications/Reminders

**Priority:** P1

Start simple, no backend required:

**Option A: Calendar Export**
- "Add to Calendar" button on each goal
- Generates .ics file with recurring monthly reminder
- Works with Google Calendar, Apple Calendar, Outlook

**Option B: Browser Notifications (later)**
- Requires user permission
- Service worker for background notifications
- Only works when browser is open

**Option C: Email Notifications (Phase 3)**
- Requires authentication
- Backend infrastructure
- Most reliable but highest effort

---

### 5. Investment Instrument Suggestions

**Priority:** P2

Educational content mapped to buckets. **Must include disclaimers** to avoid compliance issues.

**Safety Bucket (0-2 years):**
- High-Yield Savings Account (1-5% APY)
- Money Market Funds
- Short-term CDs (3-12 month)
- Treasury Bills (T-Bills)

**Growth Bucket (2-10 years):**
- Bond Funds / Bond ETFs
- Balanced Funds (60/40)
- Index Funds (conservative allocation)
- Target Date Funds

**Dream Bucket (10+ years):**
- Stock Index Funds (S&P 500, Total Market)
- Growth ETFs
- Individual Stocks (with education)
- Alternative investments

**UI:** Educational cards per bucket, links to resources, clear disclaimers.

---

### 6. Savings Strategies & Playbooks

**Priority:** P2

Content-driven feature:
- "The 3-Bucket Execution Playbook"
- "How to Automate Your Savings"
- "Snowball Method: Knock Out Goals One by One"
- "What to Do When Life Disrupts Your Plan"
- "Setting Up Automatic Transfers"

---

## Quick Wins (Ship in a Week)

| Feature | Effort | Impact |
|---------|--------|--------|
| Show monthly savings needed on goal cards | Low | High |
| "Remind me" button → Downloads .ics | Low | Medium |
| Completion checkbox | Low | Medium |
| Goal editing (reuse form) | Medium | High |

---

## Technical Considerations

### Progress Tracking
- Extend Goal type with `currentAmount` and `deposits[]`
- New Deposit type for tracking contributions
- Update localStorage schema (migration needed)
- New UI components: ProgressBar, DepositModal, DepositHistory

### Notifications
- Calendar: Generate .ics files client-side
- Browser: Service worker + Notification API
- Email: Requires auth + backend (Supabase, Firebase, or custom)

### Investment Content
- Static content, no API needed
- MDX or JSON for content management
- Links to external educational resources

---

## Success Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Return Rate | % of users who return within 7 days | > 50% |
| Deposit Logging | % of goals with at least 1 deposit logged | > 40% |
| Goal Completion | % of goals marked as completed | > 20% |
| Notification Opt-in | % of users who set reminders | > 30% |

---

## Implementation Order

1. **Sprint 1:** Progress tracking + savings calculator
2. **Sprint 2:** Edit goals + mark complete
3. **Sprint 3:** Calendar reminder export
4. **Sprint 4:** Investment instrument educational content
5. **Sprint 5:** Savings strategies content
6. **Sprint 6:** Email notifications (requires auth)
