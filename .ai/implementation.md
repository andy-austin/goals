# Implementation Status

## Recently Completed

### Test Coverage Improvements (analyze-test-coverage)
Introduced Vitest for unit/integration testing and added E2E coverage for previously untested flows.

**New files created:**
- `vitest.config.ts` — Vitest configuration (jsdom environment, `@vitejs/plugin-react`, path aliases via `vite-tsconfig-paths`)
- `vitest.setup.ts` — Global test setup (`@testing-library/jest-dom` matchers)
- `lib/validation.unit.test.ts` — 23 unit tests for `validateSMART()` covering all SMART fields, boundary conditions, and missing inputs
- `context/GoalsContext.unit.test.ts` — 20 unit tests for `goalsReducer` and `getNextPriorityForBucket()` covering all 6 action types
- `lib/storage.unit.test.ts` — 24 unit tests for `loadGoals`, `saveGoals`, `clearGoals`, cache ops, and `isStorageAvailable`
- `types/goal.unit.test.ts` — 25 unit tests for `formatCurrency`, `getCurrencySymbol`, `formatDate`, `getCurrencyName`, `getCurrencyOptions`, `BUCKETS`, `BUCKET_CONFIG`
- `app/api/ai/suggest/route.unit.test.ts` — 15 integration tests for the AI suggestion route covering 503/400/401/429/500 responses and all 5 response-parsing types (description, amount, bucket, whyItMatters, convert)
- `tests/goal-edit-delete.spec.ts` — 13 E2E tests for delete confirmation flow and edit modal (pre-population, validation, persistence)
- `tests/auth.spec.ts` — 20 E2E tests for login/signup page structure, form validation, navigation, and auth guard behaviour

**Modified files:**
- `package.json` — Added `test` and `test:watch` scripts; added devDependencies: `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `vite-tsconfig-paths`
- `context/GoalsContext.tsx` — Exported `goalsReducer` and `getNextPriorityForBucket` for direct unit testing

**Test counts (unit, run via `npm test`):**
- 5 test files, 107 tests, all passing

**Architecture notes:**
- Unit tests use `.unit.test.ts` / `.unit.test.tsx` filename convention (excluded from Playwright, included by Vitest)
- E2E tests remain in `tests/` and run via `npx playwright test`
- AI route tests use `vi.resetModules()` + `vi.doMock()` + dynamic import to isolate module-level env-var initialisation

---

### Spaces Global Layout (follow-up to #65)
All `/spaces/*` routes now render under the global layout with the navbar visible, matching the dashboard/create/timeline feel.

**New files created:**
- `app/spaces/layout.tsx` — SpacesLayout with Header; identical pattern to other route layouts

---

### Family/Group Goal Sharing (#65)
Added public/private visibility for goals and full shared-spaces infrastructure for collaborative financial planning.

**New files created:**
- `supabase/migrations/002_create_shared_spaces.sql` — DB schema: `shared_spaces`, `space_memberships`, `space_invitations` tables; adds `visibility` + `space_id` to goals; updated RLS policies; trigger to auto-add owner as member
- `lib/supabase/spaces.ts` — CRUD operations for spaces, memberships, and invitations
- `context/SpacesContext.tsx` — SpacesProvider + useSpaces() hook for space state management
- `components/Spaces/VisibilityToggle.tsx` — Private/Shared toggle button group
- `components/Spaces/SpaceCard.tsx` — Space list card (links to detail page)
- `components/Spaces/InviteMemberModal.tsx` — Invite-by-email modal with shareable link
- `components/Spaces/MembersList.tsx` — Members list with owner crown, remove/leave actions
- `components/Spaces/CreateSpaceModal.tsx` — Create new space form modal
- `components/Spaces/index.ts` — Barrel export
- `components/GoalForm/StepVisibility.tsx` — Step 6 of goal wizard: visibility + space selector
- `app/spaces/page.tsx` — /spaces: list all user's spaces with create action
- `app/spaces/[id]/page.tsx` — /spaces/[id]: space detail (members, shared goals, invitations)
- `app/spaces/join/[token]/page.tsx` — /spaces/join/[token]: accept invitation flow

**Modified files:**
- `types/goal.ts` — Added `GoalVisibility`, `SpaceRole`, `InvitationStatus` union types; `visibility` + `spaceId` fields to `Goal` and `GoalFormInput`; added `SharedSpace`, `SpaceMembership`, `SpaceInvitation`, `SharedSpaceWithDetails` interfaces
- `lib/supabase/goals.ts` — Updated `GoalRow`, `rowToGoal`, `goalToRow` to handle `visibility` and `space_id`
- `lib/storage.ts` — Updated `deserializeGoal` to default `visibility: 'private'` and `spaceId: null` (backward compat)
- `context/GoalsContext.tsx` — `addGoal` defaults `visibility: 'private'` and `spaceId: null`
- `context/index.ts` — Added `SpacesProvider`, `useSpaces` exports
- `app/providers.tsx` — Added `SpacesProvider` wrapper (inside `GoalsProvider`)
- `components/GoalForm/index.ts` — Added `StepVisibility` export
- `components/index.ts` — Added `Spaces` barrel export
- `app/create/page.tsx` — Added Step 6 (StepVisibility) and passes `visibility`/`spaceId` to `addGoal`
- `components/Dashboard/GoalCard.tsx` — Shows "Shared" badge on goals with `visibility === 'shared'`
- `components/Header.tsx` — Added Spaces nav link
- `messages/en.json` — Added `nav.spaces` and full `spaces` translation section; added `goalForm.steps.visibility`
- `messages/es.json` — Same in Spanish

**Architecture:**
- `GoalVisibility` = `'private' | 'shared'`. Default: `'private'`.
- `SharedSpace` — groups of users that can share goals
- `SpaceMembership` — links users to spaces with `owner` or `member` role
- `SpaceInvitation` — tokenized invite links (7-day expiry) with `pending/accepted/declined/expired` states
- Goals with `visibility === 'shared'` + a valid `space_id` are visible to all space members (enforced by Supabase RLS)
- Owner is auto-added as a member via database trigger `on_space_created`
- Anonymous users skip the spaces step (shown private-only notice)

**Database setup required:** Run `supabase/migrations/002_create_shared_spaces.sql` in Supabase SQL Editor after `001_create_goals_table.sql`.

---

### User Authentication & Account Management (#64)
Added Supabase Auth + Supabase Postgres integration for user authentication and cloud-synced goal persistence.

**New files created:**
- `lib/supabase/browser.ts` — Browser-side Supabase client (singleton)
- `lib/supabase/server.ts` — Server-side Supabase client (for API routes/server components)
- `lib/supabase/middleware.ts` — Middleware client for session refresh
- `lib/supabase/goals.ts` — Supabase CRUD operations for goals (fetch, insert, delete, update, upsert)
- `context/AuthContext.tsx` — AuthProvider + useAuth() hook with session management
- `middleware.ts` — Next.js middleware for auth token refresh
- `app/auth/login/page.tsx` — Login page (email/password + Google OAuth)
- `app/auth/signup/page.tsx` — Registration page (email/password + Google OAuth)
- `app/auth/callback/route.ts` — OAuth callback handler
- `supabase/migrations/001_create_goals_table.sql` — Database schema with RLS
- `.env.local` — Supabase credentials (gitignored)

**Modified files:**
- `context/GoalsContext.tsx` — Auth-aware dual storage (localStorage for anonymous, Supabase for authenticated users, auto-migration on first login)
- `context/index.ts` — Added AuthContext export
- `app/providers.tsx` — Added AuthProvider wrapper (outermost)
- `components/Header.tsx` — Added login button/user menu with sign out
- `messages/en.json` — Added `auth` translation section
- `messages/es.json` — Added `auth` translation section (Spanish)
- `package.json` — Added `@supabase/supabase-js`, `@supabase/ssr`

**Architecture:**
- Anonymous users: Goals in localStorage (unchanged from before)
- Authenticated users: Goals synced to Supabase Postgres with RLS
- On first login: localStorage goals auto-migrate to Supabase if user has no remote goals
- Auth state: React Context (`AuthProvider`) wrapping the entire app

**Database setup required:** Run `supabase/migrations/001_create_goals_table.sql` in Supabase SQL Editor.

### Landing Page Translation (Previous)
All landing page components translated to English/Spanish via `next-intl`.

### Remove Share Step from Create Goal Wizard
Removed the "Sharing" (visibility) step from the goal creation wizard. Goals are now always created as private. Sharing should be done post-creation from the dashboard.

**Modified files:**
- `app/create/page.tsx` — Removed Step 6 (StepVisibility) from wizard steps array and form rendering; goals now always default to `visibility: 'private'` and `spaceId: null`
- `messages/en.json` — Removed `goalForm.steps.visibility` translation key
- `messages/es.json` — Removed `goalForm.steps.visibility` translation key

**Note:** `StepVisibility.tsx` and `VisibilityToggle.tsx` components are intentionally preserved for future use in post-creation sharing from the dashboard.

---

### Goal Share & Edit from Dashboard
Added edit and share buttons to dashboard goal cards with modal dialogs.

**New files created:**
- `components/Dashboard/EditGoalModal.tsx` — Inline edit form modal for all goal fields (title, description, amount, currency, date, bucket, why)
- `components/Dashboard/ShareGoalModal.tsx` — Visibility/sharing modal using `VisibilityToggle` + space selector; auth-gated

**Modified files:**
- `context/GoalsContext.tsx` — Added `UPDATE_GOAL` reducer action, `updateGoal()` callback (syncs to Supabase for authenticated users), and `updateGoalRemote` import
- `components/Dashboard/GoalCard.tsx` — Added edit button (pencil icon) and share button (upload icon); both open respective modals
- `components/Dashboard/index.ts` — Added `EditGoalModal` and `ShareGoalModal` exports
- `messages/en.json` — Added `common.saving`, `common.share`, `dashboard.editModal.*`, `dashboard.shareModal.*` keys
- `messages/es.json` — Same keys in Spanish

**Architecture:**
- `updateGoal(goalId, updates)` — partial update; merges into existing goal; persists to Supabase if authenticated, to localStorage otherwise (via existing effect)
- Edit modal reuses `Input`, `Textarea`, `Select`, `Label` UI primitives + validation mirrors create-form rules
- Share modal reuses `VisibilityToggle` and `SpacesContext`; shows auth gate for anonymous users

---

## Next Steps
- #68: Personal Data Privacy Consent (Legal Compliance) — should ship alongside auth
- #52: Progress Tracking + Savings Calculator
- #66: Goal-to-Investment Vehicle Linking
- #67: Currency Exchange Rate Display
