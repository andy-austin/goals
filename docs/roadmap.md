# FinGoal Roadmap

Prioritized list of open GitHub issues, organized by execution order.
Check off items as they are completed. Each issue links to its GitHub page.

---

## Phase 1: Bug Fixes & Core UX

Critical bugs and UX gaps affecting every user session.

- [x] **#86** — [Fix dark mode across all pages](https://github.com/andy-austin/goals/issues/86) `bug` `high` — *Done (phase-1/bug-fixes-core-ux branch)*
  - Replaced 70+ hardcoded color classes with design tokens across 20+ components
- [x] **#89** — [Fix hero CTA button flash during auth loading](https://github.com/andy-austin/goals/issues/89) `bug` `high` — *Done (phase-1/bug-fixes-core-ux branch)*
  - CTA renders immediately with default state; updates when auth resolves
- [x] **#87** — [Allow anonymous access to /create and /dashboard](https://github.com/andy-austin/goals/issues/87) `high` — *Done (phase-1/bug-fixes-core-ux branch)*
  - Removed /create and /dashboard from protected routes in middleware
- [x] **#88** — [Add forgot password flow](https://github.com/andy-austin/goals/issues/88) `high` — *Done (phase-1/bug-fixes-core-ux branch)*
  - Added forgot-password and reset-password pages with full i18n support
- [x] **#90** — [Add progress bar to GoalCard on dashboard](https://github.com/andy-austin/goals/issues/90) `high` `design` — *Done (phase-1/bug-fixes-core-ux branch)*
  - Time-elapsed progress bar always visible; fulfillment bar when check-ins exist

---

## Phase 2: Monetization Foundation

Revenue-generating features. Ship compliance (#61) before or alongside recommendations.

- [x] **#58** — [Recommendation Engine: Financial Products by Bucket](https://github.com/andy-austin/goals/issues/58) `high` `monetization` — *Done (phase-2/monetization-foundation branch)*
  - Product catalog with 10 products across all buckets; recommendation engine with bucket+timeline filtering
- [x] **#59** — [Post-Goal Creation Recommendation Screen](https://github.com/andy-austin/goals/issues/59) `high` `monetization` — *Done (phase-2/monetization-foundation branch)*
  - Full recommendation screen after goal creation with primary + alternative products, interest estimates
- [x] **#61** — [Affiliate Disclosure & Compliance](https://github.com/andy-austin/goals/issues/61) `high` `compliance` — *Done (phase-2/monetization-foundation branch)*
  - AffiliateDisclosure component (inline/banner), /disclosure page, footer link, FTC compliant
- [x] **#60** — [Dashboard Recommendations Widget](https://github.com/andy-austin/goals/issues/60) `medium` `monetization` — *Done (phase-2/monetization-foundation branch)*
  - Collapsible widget showing recommended account per goal, dismissible with localStorage persistence
- [x] **#62** — [Affiliate Link Tracking & Analytics](https://github.com/andy-austin/goals/issues/62) `medium` `monetization` — *Done (phase-2/monetization-foundation branch)*
  - UTM parameter builder, event tracking (shown/clicked/skipped/dismissed), Vercel Analytics integration

---

## Phase 3: Feature Completeness

Core features that round out the product.

- [ ] **#52** — [Progress Tracking + Savings Calculator](https://github.com/andy-austin/goals/issues/52) `high`
  - Track savings progress over time with visual indicators
- [ ] **#53** — [Edit Goals](https://github.com/andy-austin/goals/issues/53) `high`
  - Already implemented via EditGoalModal — verify and close if done
- [ ] **#54** — [Goal Completion & Archiving](https://github.com/andy-austin/goals/issues/54) `medium`
  - Mark goals as completed, archive them out of the active dashboard
- [ ] **#55** — [Calendar Reminder Export (.ics)](https://github.com/andy-austin/goals/issues/55) `medium`
  - Export goal milestones as calendar events
- [ ] **#66** — [Goal-to-Investment Vehicle Linking](https://github.com/andy-austin/goals/issues/66) `medium`
  - Link goals to specific investment vehicles with periodic tracking

---

## Phase 4: UX Polish

Design and interaction improvements.

- [x] **#94** — [Promote Timeline and Spaces to top-level navigation](https://github.com/andy-austin/goals/issues/94) `medium` — *Done (create-service-client branch)*
- [ ] **#93** — [Increase GoalCard action button touch targets for mobile](https://github.com/andy-austin/goals/issues/93) `bug` `medium`
  - Action buttons are too small on mobile (below 44px tap target)
- [ ] **#92** — [Redesign empty dashboard state with goal templates](https://github.com/andy-austin/goals/issues/92) `medium` `design`
  - Replace plain empty state with template-driven onboarding
- [ ] **#91** — [Redesign auth pages with split layout and branding](https://github.com/andy-austin/goals/issues/91) `medium` `design`
  - Modern split-screen login/signup with branding panel
- [ ] **#95** — [Convert cookie consent to non-blocking bottom banner](https://github.com/andy-austin/goals/issues/95) `medium`
  - Current modal blocks interaction; switch to a passive bottom bar
- [ ] **#96** — [Improve language switcher with text labels and active state](https://github.com/andy-austin/goals/issues/96) `medium` `design`
  - Add labels ("English" / "Espanol") instead of flag-only buttons
- [ ] **#97** — [Make calculator result sticky on mobile](https://github.com/andy-austin/goals/issues/97) `medium`
  - Results card scrolls out of view on mobile while editing inputs
- [ ] **#98** — [Shorten landing page — consolidate sections](https://github.com/andy-austin/goals/issues/98) `medium` `design`
  - Landing page is too long; merge or remove redundant sections

---

## Phase 5: Nice to Have

Low-priority enhancements for future sprints.

- [ ] **#99** — [Add skeleton loaders for page transitions](https://github.com/andy-austin/goals/issues/99) `low`
- [ ] **#100** — [Improve mobile form wizard step indicator](https://github.com/andy-austin/goals/issues/100) `low`
- [ ] **#101** — [Persist bucket section collapse state](https://github.com/andy-austin/goals/issues/101) `low`
- [ ] **#102** — [Context-aware footer navigation links](https://github.com/andy-austin/goals/issues/102) `low`
- [ ] **#103** — [Add drag-to-reorder onboarding tooltip](https://github.com/andy-austin/goals/issues/103) `low`
- [ ] **#56** — [Investment Instrument Suggestions (Educational)](https://github.com/andy-austin/goals/issues/56) `low`
- [ ] **#57** — [Savings Strategies & Playbooks](https://github.com/andy-austin/goals/issues/57) `low`
- [ ] **#67** — [Currency Exchange Rate Display](https://github.com/andy-austin/goals/issues/67) `low`

---

## Notes

- **Phase 1** is complete on `phase-1/bug-fixes-core-ux` branch (all 5 issues done).
- **#53 (Edit Goals)** may already be complete — EditGoalModal exists and is functional. Verify and close.
- **#94** is implemented but not yet merged to master.
- **Phase 2** is complete on `phase-2/monetization-foundation` branch (all 5 issues done).
