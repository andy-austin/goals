# FinGoal

A guided tool that helps beginner investors turn vague intentions like "save money" into concrete, SMART financial goals using the **3 Buckets methodology** (Safety, Growth, Dream).

**Live:** [investment-goals.vercel.app](https://investment-goals.vercel.app/)

## What it does

- **SMART Goal Creation** — Multi-step wizard that walks you through defining Specific, Measurable, Achievable, Relevant, and Time-bound financial goals
- **3 Buckets Classification** — Categorize goals into Safety (emergency fund, health), Growth (house, education), and Dream (travel, business)
- **AI Suggestions** — Get help refining goal descriptions, amounts, and motivation statements powered by Claude or Gemini
- **Dashboard** — View all goals grouped by bucket with drag-and-drop prioritization
- **Progress Tracking** — Log deposits, track fulfillment percentage, and see monthly savings needed
- **Timeline** — Gantt chart visualization of all goals over time
- **Shared Spaces** — Invite family or friends to collaborate on shared financial goals
- **Goal Completion** — Mark goals complete, archive them, or reactivate
- **Calendar Reminders** — Export .ics files with recurring savings reminders
- **Investment Education** — Browse instruments by bucket with risk levels, pros/cons
- **Savings Strategies** — Curated playbooks (3-bucket, snowball, automate, and more)
- **Currency Support** — Multiple currencies with live exchange rates
- **Bilingual** — Full English and Spanish support

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript 5.9 |
| Styling | Tailwind CSS 4 |
| Backend | Supabase (Auth + PostgreSQL with RLS) |
| AI | Anthropic Claude / Google Gemini (switchable) |
| i18n | next-intl (EN / ES) |
| Testing | Playwright (E2E), Vitest (unit) |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- An [Anthropic](https://console.anthropic.com) or [Google AI](https://aistudio.google.com) API key

### Setup

```bash
git clone https://github.com/andy-austin/goals.git
cd goals
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_key       # optional if using Gemini
GOOGLE_GEMINI_API_KEY=your_gemini_key      # optional if using Claude
AI_PROVIDER=anthropic                       # or 'gemini'
```

Run the database migrations in your Supabase SQL Editor (in order):

1. `supabase/migrations/001_create_goals_table.sql`
2. `supabase/migrations/002_create_shared_spaces.sql`
3. `supabase/migrations/003_fix_space_memberships_rls.sql`
4. `supabase/migrations/004_add_investment_tracking.sql`
5. `supabase/migrations/005_add_goal_completion.sql`

Start the dev server:

```bash
npm run dev
```

### Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # ESLint
npm test           # Unit tests (Vitest)
npx playwright test  # E2E tests
```

## Project Structure

```
app/
  dashboard/       # Goal list, grouped by bucket
  create/          # Multi-step goal creation wizard
  timeline/        # Gantt chart visualization
  spaces/          # Shared spaces & invitations
  auth/            # Login, signup, password reset
  api/             # AI suggestions, exchange rates, invitations
components/
  ui/              # Button, Card, Input, Badge, Toast, Tooltip
  Dashboard/       # GoalCard, BucketSection, EditGoalModal, TrackingModal
  FormWizard/      # Multi-step form framework
  GoalForm/        # Goal creation steps
  Timeline/        # Gantt chart components
  Spaces/          # Shared spaces UI
  Recommendations/ # Affiliate product cards
  Education/       # Investment instrument guides
  Strategies/      # Savings strategy playbooks
  landing/         # Marketing page sections
context/           # AuthContext, GoalsContext, SpacesContext
lib/               # Validation, storage, tracking, calendar, exchange rates
types/             # TypeScript type definitions
messages/          # i18n translation files (en.json, es.json)
supabase/          # Database migrations
tests/             # Playwright E2E tests
```

## How it was built

This project was planned and built entirely with AI-assisted development using [Claude Code](https://claude.ai/code) — from the PRD and architecture through implementation, testing, and documentation. 45+ issues shipped across 8 phases.

See [docs/roadmap.md](docs/roadmap.md) for the full development timeline.

## Contributing

Contributions are welcome. Feel free to open an issue or submit a PR.

1. Fork the repo
2. Create a branch (`git checkout -b my-feature`)
3. Commit your changes
4. Push and open a Pull Request

## License

MIT — see [LICENSE](LICENSE) for details.
