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

- [x] **#52** — [Progress Tracking + Savings Calculator](https://github.com/andy-austin/goals/issues/52) `high` — *Done (phase-3/feature-completeness branch)*
  - Monthly savings calculator on goal cards, current vs target display, direct Log Deposit button
- [x] **#53** — [Edit Goals](https://github.com/andy-austin/goals/issues/53) `high` — *Done (previously implemented via EditGoalModal)*
  - Full inline edit modal with all goal fields, Supabase sync, i18n
- [x] **#54** — [Goal Completion & Archiving](https://github.com/andy-austin/goals/issues/54) `medium` — *Done (phase-3/feature-completeness branch)*
  - Mark goals complete, collapsible completed section, reactivate/delete, status field + DB migration
- [x] **#55** — [Calendar Reminder Export (.ics)](https://github.com/andy-austin/goals/issues/55) `medium` — *Done (phase-3/feature-completeness branch)*
  - CalendarExportModal with weekly/biweekly/monthly frequency, .ics download, i18n
- [x] **#66** — [Goal-to-Investment Vehicle Linking](https://github.com/andy-austin/goals/issues/66) `medium` — *Done (previously implemented)*
  - Investment vehicle linking, check-in tracking, fulfillment calculation, TrackingModal + CheckInModal

---

## Phase 4: UX Polish

Design and interaction improvements.

- [x] **#94** — [Promote Timeline and Spaces to top-level navigation](https://github.com/andy-austin/goals/issues/94) `medium` — *Done (create-service-client branch)*
- [x] **#93** — [Increase GoalCard action button touch targets for mobile](https://github.com/andy-austin/goals/issues/93) `bug` `medium` — *Done (phase-4/ux-polish branch)*
  - All 8 action buttons + drag handle now meet 44px minimum tap target standard
- [x] **#92** — [Redesign empty dashboard state with goal templates](https://github.com/andy-austin/goals/issues/92) `medium` `design` — *Done (phase-4/ux-polish branch)*
  - Template-driven onboarding grid with 3 templates (one per bucket) + "start from scratch" option
- [x] **#91** — [Redesign auth pages with split layout and branding](https://github.com/andy-austin/goals/issues/91) `medium` `design` — *Done (phase-4/ux-polish branch)*
  - Split-screen layout: branding panel (left) + form (right); responsive (stacked on mobile)
- [x] **#95** — [Convert cookie consent to non-blocking bottom banner](https://github.com/andy-austin/goals/issues/95) `medium` — *Already done*
  - Was already implemented as a non-blocking fixed bottom bar; no changes needed
- [x] **#96** — [Improve language switcher with text labels and active state](https://github.com/andy-austin/goals/issues/96) `medium` `design` — *Done (phase-4/ux-polish branch)*
  - Text labels ("English" / "Espanol") with active state highlight using primary color
- [x] **#97** — [Make calculator result sticky on mobile](https://github.com/andy-austin/goals/issues/97) `medium` — *Done (phase-4/ux-polish branch)*
  - Results card uses `sticky top-4` on mobile, `static` on desktop
- [x] **#98** — [Shorten landing page — consolidate sections](https://github.com/andy-austin/goals/issues/98) `medium` `design` — *Done (phase-4/ux-polish branch)*
  - Merged MethodologySection + PriorityFeature into GoalFrameworkSection; removed WhyDocumentSection

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
- **#94** is implemented but not yet merged to master.
- **Phase 2** is complete on `phase-2/monetization-foundation` branch (all 5 issues done).
- **Phase 3** is complete on `phase-3/feature-completeness` branch (all 5 issues done). #53 and #66 were previously implemented; #52, #54, #55 implemented in this branch.
- **Phase 4** is complete on `phase-4/ux-polish` branch (all 8 issues done). #95 was already implemented; #91, #92, #93, #96, #97, #98 implemented in this branch.
