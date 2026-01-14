# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16.1.1 application using the App Router architecture with React 19, TypeScript, and Tailwind CSS 4. The project is bootstrapped from `create-next-app` and follows Next.js conventions.

**Goal**: A guided tool to help beginner investors create SMART financial goals using the 3 Buckets methodology (Safety, Growth, Dream).

## Important: Documentation Updates

**After completing work on any GitHub issue**, update documentation in the `.ai/` folder:

### 1. Always Update `implementation.md`
- Mark the issue as completed with files changed
- Update project structure if new folders/files were created
- Update "Next Steps" section

### 2. Create/Update Module-Specific Documentation
When working on key architecture pieces, create or update dedicated docs in `.ai/`:

| Module | Doc File | When to Create/Update |
|--------|----------|----------------------|
| UI Components | `.ai/components.md` | Adding/modifying components in `components/` |
| State Management | `.ai/state.md` | Changes to context, hooks, or data flow |
| Design System | `.ai/design-system.md` | Theme tokens, colors, typography changes |
| API/Data | `.ai/api.md` | API routes, data fetching, external integrations |
| Forms | `.ai/forms.md` | Form components, validation, multi-step wizards |
| Types | `.ai/types.md` | Significant type definitions or data models |

### 3. Documentation Standards
Each module doc should include:
- **Purpose**: What this module does
- **Key Files**: List of relevant files with brief descriptions
- **Usage Examples**: Code snippets showing how to use
- **API Reference**: Props, methods, types (if applicable)
- **Dependencies**: What it depends on / what depends on it

### 4. Commit Documentation
Always commit documentation updates as part of the issue completion.

This ensures future sessions have accurate, detailed context for each part of the codebase.

## Development Commands

### Running the Application
```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build production bundle
npm start        # Start production server
npm run lint     # Run ESLint
```

## Architecture

### App Router Structure
- **`app/`** - Next.js App Router directory
  - `layout.tsx` - Root layout with Geist font configuration (sans and mono variants)
  - `page.tsx` - Home page component
  - `globals.css` - Global styles and Tailwind directives

### Styling
- Uses Tailwind CSS 4 with PostCSS plugin (`@tailwindcss/postcss`)
- Dark mode support via `dark:` utility classes
- Custom font variables: `--font-geist-sans` and `--font-geist-mono`

### TypeScript Configuration
- Path alias: `@/*` maps to project root
- Target: ES2017
- JSX mode: `react-jsx` (React 19 automatic runtime)
- Strict mode enabled

### ESLint
- Uses Next.js config presets: `core-web-vitals` and TypeScript
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Key Conventions

- All React components use TypeScript (`.tsx`)
- Server Components by default (App Router)
- Font optimization via `next/font/google`
- Image optimization via `next/image`

## Project-Specific Context

### Key Files to Read First
- `.ai/implementation.md` - Current implementation status, what's done, what's pending
- `.ai/prd.md` - Full product requirements document

### Module Documentation (in `.ai/`)
- `components.md` - UI component API and usage
- `forms.md` - Form components, validation, multi-step wizards
- `state.md` - State management (GoalsContext, useGoals hook)
- `design-system.md` - Design tokens, colors, theming
- `types.md` - TypeScript types and utilities

### Design System
- Design tokens defined in `app/globals.css` using CSS variables
- Bucket colors: Safety (green), Growth (blue), Dream (purple)
- UI components in `components/ui/` (Button, Card, Input, Badge)
- Dark mode supported via `prefers-color-scheme`

### Import Aliases
```typescript
import { Goal, Bucket, formatCurrency } from '@/types';
import { useGoals } from '@/context';
import { Button, Card, BucketBadge } from '@/components';
```