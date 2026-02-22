# Implementation Status

## Recently Completed

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

## Next Steps
- #68: Personal Data Privacy Consent (Legal Compliance) — should ship alongside auth
- #53: Edit Goals — add edit button to goal cards
- #52: Progress Tracking + Savings Calculator
- #66: Goal-to-Investment Vehicle Linking
- #67: Currency Exchange Rate Display
