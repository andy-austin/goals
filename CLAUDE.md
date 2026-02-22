# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Investment Goals Tool** — A guided tool that helps beginner investors create SMART financial goals using the 3 Buckets methodology (Safety, Growth, Dream).

**Stack:**
- **Framework:** Next.js 16.1.1 with App Router
- **UI:** React 19, TypeScript 5.9.3, Tailwind CSS 4
- **Backend:** Supabase (Auth + PostgreSQL with RLS policies)
- **AI:** Anthropic Claude SDK + Google Gemini (switchable via env)
- **i18n:** next-intl (English / Spanish)
- **Testing:** Playwright (E2E)

## Key Files to Read First

Before starting any work, read these files for current project context:
- `.ai/implementation.md` — What's done, what's pending, files changed per issue
- `.ai/prd.md` — Full product requirements document
- `.ai/components.md` — UI component API and usage
- `.ai/forms.md` — Form components, validation, multi-step wizards
- `.ai/state.md` — State management (contexts, hooks, data flow)
- `.ai/design-system.md` — Design tokens, colors, theming

## Development Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build production bundle
npm start        # Start production server
npm run lint     # Run ESLint
npx playwright test  # Run E2E tests
```

## Architecture

### App Router Structure

```
app/
├── layout.tsx              # Root layout — fonts, i18n, providers, analytics
├── page.tsx                # Landing page
├── globals.css             # Design tokens, Tailwind theme, animations, print styles
├── providers.tsx           # Client-side provider tree (Auth → Goals → Spaces → Toast)
├── middleware.ts           # Supabase auth token refresh
├── dashboard/page.tsx      # Goal list/management
├── create/page.tsx         # Multi-step goal creation wizard
├── timeline/page.tsx       # Gantt chart timeline visualization
├── spaces/                 # Shared goals / family planning
│   ├── page.tsx            # List user's spaces
│   ├── [id]/page.tsx       # Space detail (members, shared goals)
│   └── join/[token]/page.tsx  # Accept invitation flow
├── auth/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── callback/route.ts   # OAuth callback handler
├── api/ai/suggest/route.ts # AI suggestion endpoint
├── privacy/page.tsx
└── terms/page.tsx
```

### Provider Tree (outermost → innermost)

```
AuthProvider (context/AuthContext.tsx)
  └── GoalsProvider (context/GoalsContext.tsx)
      └── SpacesProvider (context/SpacesContext.tsx)
          └── ToastProvider (components/ui/Toast.tsx)
              └── App Components
```

### State Management

Three React Contexts, all exposed via custom hooks:

| Context | Hook | Responsibility |
|---------|------|----------------|
| `AuthContext` | `useAuth()` | User session, signIn/signOut/signUp/Google OAuth |
| `GoalsContext` | `useGoals()` | Goal CRUD, ordering, dual storage (localStorage ↔ Supabase) |
| `SpacesContext` | `useSpaces()` | Space CRUD, memberships, invitations |

**Dual Storage Strategy (`GoalsContext`):**
- Anonymous users → `localStorage` (key: `investment-goals-v1`)
- Authenticated users → Supabase PostgreSQL with RLS
- On first login: localStorage goals auto-migrate to Supabase (if no remote goals exist)

### Database (Supabase)

**Tables:**
- `goals` — id, user_id, title, description, amount, currency, target_date, bucket, why_it_matters, priority, created_at, visibility, space_id
- `shared_spaces` — id, name, description, owner_id, created_at
- `space_memberships` — space_id, user_id, role (`owner`|`member`), joined_at
- `space_invitations` — id, space_id, invited_email, invited_by, token, status, created_at, expires_at

**RLS Policies:** Users see/modify only their own goals. Space members see shared goals within their space. Owner auto-added as member via database trigger.

**Migrations:** `supabase/migrations/` — run these in order in the Supabase SQL Editor:
1. `001_create_goals_table.sql`
2. `002_create_shared_spaces.sql`
3. `003_fix_space_memberships_rls.sql`

### Environment Variables

Required in `.env.local` (gitignored):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=          # For AI suggestions via Claude
GOOGLE_GEMINI_API_KEY=      # Optional alternative AI provider
AI_PROVIDER=anthropic       # 'anthropic' (default) or 'gemini'
```

### AI Integration

Route: `app/api/ai/suggest/route.ts`

- Auto-detects provider from `AI_PROVIDER` env var; falls back to whichever key exists
- **Anthropic:** Claude Sonnet 4 (default)
- **Gemini:** Gemini 2 Flash (alternative)

**Suggestion types:**
- `description` — Refine goal description
- `amount` — Suggest target amount
- `bucket` — Classify into Safety/Growth/Dream
- `whyItMatters` — Generate motivation statement
- `convert` — Currency conversion hint

### Internationalization

- **Provider:** `next-intl` 4.x
- **Locales:** `en` (English), `es` (Spanish) — Spanish is default
- **Translation files:** `messages/en.json`, `messages/es.json`
- **Config:** `i18n/config.ts`, `i18n/request.ts`
- **Next.js integration:** `next.config.ts` wraps config with `createNextIntlPlugin`

All user-facing strings must use `useTranslations()` hook — no hardcoded English text.

### Component Organization

```
components/
├── ui/                     # Base primitives
│   ├── Button.tsx          # variants: primary, secondary, destructive; sizes: sm, md, lg
│   ├── Card.tsx            # Card, CardHeader, CardContent, CardFooter
│   ├── Input.tsx           # Input, Textarea, Label, Select
│   ├── Badge.tsx           # Badge, BucketBadge (colored by bucket)
│   ├── Toast.tsx           # Toast notification system
│   ├── Tooltip.tsx         # Hover tooltip
│   ├── ConfirmationModal.tsx
│   └── AISuggestionChip.tsx
├── Dashboard/              # Goal list, cards, modals
├── FormWizard/             # Multi-step form framework
├── GoalForm/               # Goal creation steps (title/desc, amount, date, bucket, why)
├── Timeline/               # Gantt chart visualization
├── Spaces/                 # Shared spaces UI
├── landing/                # Marketing landing page sections
├── Header.tsx
├── LanguageSwitcher.tsx
├── ConsentBanner.tsx
└── ConditionalAnalytics.tsx
```

### Form Wizard Architecture

Goal creation uses a custom multi-step wizard (`components/FormWizard/`):
1. `FormWizard.tsx` — Orchestrates steps with FormWizardContext state
2. `FormWizardContext.tsx` — Form data, current step, navigation
3. Steps in `components/GoalForm/`: title/description → amount/currency → target date → bucket → why it matters

**SMART Validation:** `lib/validation.ts` — real-time field validation mirroring the SMART framework.

### Routing and Navigation

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | All goals, grouped by bucket, with drag-and-drop |
| `/create` | Multi-step goal wizard |
| `/timeline` | Gantt chart of all goals |
| `/spaces` | User's shared spaces list |
| `/spaces/[id]` | Space detail: members, shared goals |
| `/spaces/join/[token]` | Invitation acceptance |
| `/auth/login` | Login (email + Google OAuth) |
| `/auth/signup` | Registration |

### Design System

Design tokens live in `app/globals.css` as CSS variables (`@theme inline` block).

**Bucket colors:**
- Safety → Green (`#22c55e`)
- Growth → Blue (`#3b82f6`)
- Dream → Purple (`#a855f7`)

**Dark mode:** Automatic via `@media (prefers-color-scheme: dark)` — no manual toggle needed.

**Utility:** `lib/utils.ts` exports `cn()` (clsx + tailwind-merge) for conditional class merging.

### TypeScript Configuration

- Path alias: `@/*` maps to project root
- Target: ES2017
- JSX mode: `react-jsx` (React 19 automatic runtime)
- Strict mode enabled

### Key Import Aliases

```typescript
import { Goal, Bucket, GoalVisibility, formatCurrency, BUCKET_CONFIG } from '@/types';
import { useGoals, useAuth, useSpaces } from '@/context';
import { Button, Card, BucketBadge, Toast } from '@/components';
import { cn } from '@/lib/utils';
```

## Key Conventions

- All React components use TypeScript (`.tsx`)
- Server Components by default; add `'use client'` only when needed (hooks, browser APIs)
- `cn()` for all className composition
- All user-facing strings via `useTranslations()` — never hardcode English
- Goal `visibility` defaults to `'private'`; sharing is post-creation via dashboard modals
- `useGoals()` is the single source of truth for goal state — never read/write storage directly
- `useAuth()` for all authentication state and operations

## Documentation Updates (Required After Issue Completion)

**After completing work on any GitHub issue**, update documentation in the `.ai/` folder:

### 1. Always update `implementation.md`
- Mark the issue as completed with files changed
- Update "Next Steps" section

### 2. Create/Update module-specific docs

| Module | Doc File | When to Update |
|--------|----------|----------------|
| UI Components | `.ai/components.md` | Adding/modifying `components/` |
| State Management | `.ai/state.md` | Changes to contexts, hooks, data flow |
| Design System | `.ai/design-system.md` | Theme tokens, colors, typography |
| API/Data | `.ai/api.md` | API routes, data fetching, external integrations |
| Forms | `.ai/forms.md` | Form components, validation, wizards |
| Types | `.ai/types.md` | Significant type definitions or data models |

### 3. Documentation standards

Each module doc should include:
- **Purpose** — What this module does
- **Key Files** — Relevant files with brief descriptions
- **Usage Examples** — Code snippets
- **API Reference** — Props, methods, types
- **Dependencies** — What it depends on / what depends on it

Always commit documentation updates as part of the issue PR.

## Pending Work (from `.ai/implementation.md`)

- **#68** — Personal Data Privacy Consent (Legal Compliance)
- **#52** — Progress Tracking + Savings Calculator
- **#66** — Goal-to-Investment Vehicle Linking
- **#67** — Currency Exchange Rate Display
