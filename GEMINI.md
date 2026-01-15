# GEMINI.md

This file provides context and guidance for Gemini when working on this repository.

## Project Overview

**Investment Goals** is a guided goal-creation tool helping beginner investors transform vague savings intentions into well-defined, **SMART** financial goals using the **3 Buckets** methodology (Safety, Growth, Dream).

### Core Features
- **Goal Creation Wizard:** Multi-step form with SMART validation.
- **3 Buckets Methodology:** Categorization into Safety (Green), Growth (Blue), and Dream (Purple).
- **AI Integration:** Claude-powered suggestions for goal refinement.
- **Internationalization:** Full English and Spanish support via `next-intl`.
- **Persistence:** Local Storage (MVP).

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16.1.1 (App Router) |
| **Language** | TypeScript |
| **UI** | React 19, Tailwind CSS 4 |
| **State** | React Context + useReducer |
| **I18n** | next-intl |
| **AI** | Anthropic Claude SDK |
| **Fonts** | Geist (Sans & Mono) |

## Development Workflow

### Commands
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure
- `app/` - Next.js App Router (pages, layouts, API routes).
- `components/`
  - `ui/` - Reusable primitives (Button, Card, Input).
  - `FormWizard/` - Logic for the multi-step form.
  - `GoalForm/` - Specific steps for the goal creation wizard.
- `context/` - Global state (GoalsContext).
- `hooks/` - Custom hooks (useAISuggestion).
- `lib/` - Utilities (storage, validation).
- `types/` - TypeScript definitions (Goal, Bucket, Currency).
- `.ai/` - **CRITICAL**: Contains PRD, implementation status, and module docs.

## Critical Conventions

1.  **Documentation First:**
    *   **Read**: Always start by reading `.ai/implementation.md` and `.ai/prd.md`.
    *   **Update**: After completing a task, **YOU MUST** update `.ai/implementation.md` and relevant module docs in `.ai/`.

2.  **Architecture:**
    *   Use **Server Components** by default. Use `'use client'` only when necessary (state, interactivity).
    *   **Path Aliases**: Use `@/` for imports (e.g., `import { Button } from '@/components'`).
    *   **Exports**: Use `index.ts` files for cleaner imports.

3.  **Styling & Theming:**
    *   Use **Tailwind CSS 4**.
    *   Use CSS variables defined in `app/globals.css` for colors.
    *   **Buckets**: Respect bucket-specific themes (`--bucket-safety`, etc.).
    *   **Dark Mode**: Ensure all UI components support dark mode.

4.  **State Management:**
    *   Global data (Goals) lives in `GoalsContext`.
    *   Wizard state lives in `FormWizardContext`.
    *   Persistence is handled automatically via `lib/storage.ts`.

5.  **Internationalization:**
    *   All user-facing text must be in `messages/en.json` (and `es.json`).
    *   Use `useTranslations` hook from `next-intl`.

## Key Files to Reference

*   **`.ai/prd.md`**: The source of truth for features and requirements.
*   **`.ai/implementation.md`**: Tracks what is done and what is next.
*   **`types/goal.ts`**: The core data model (`Goal`, `Bucket`, `Currency`).
*   **`app/globals.css`**: Design tokens and theme variables.
*   **`CLAUDE.md`**: Additional operational guidelines.
