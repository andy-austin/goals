# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16.1.1 application using the App Router architecture with React 19, TypeScript, and Tailwind CSS 4. The project is bootstrapped from `create-next-app` and follows Next.js conventions.

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