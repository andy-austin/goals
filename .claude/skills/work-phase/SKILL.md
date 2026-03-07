---
name: work-phase
description: Work on a roadmap phase end-to-end. Implements all issues in a phase, creates a branch, updates docs, and closes GitHub issues.
argument-hint: "[phase number or name, e.g. '2' or 'Phase 3']"
disable-model-invocation: true
---

Work on a roadmap phase end-to-end. Argument: phase number or name (e.g. "2", "Phase 3").

## Workflow

### 1. Read the roadmap and identify issues

- Read `docs/roadmap.md` to find all issues in the requested phase: $ARGUMENTS
- Extract issue numbers, titles, labels, and descriptions.
- If the phase is already fully completed, inform the user and stop.

### 2. Create a branch from master

```
git checkout master && git pull --rebase
git checkout -b phase-{N}/{kebab-case-phase-name}
```

### 3. Read project context

Read these files to understand the current codebase state before making changes:
- `.ai/implementation.md`
- `.ai/design-system.md`
- `.ai/components.md`
- `.ai/state.md`
- `.ai/forms.md`
- `app/globals.css` (design tokens)

### 4. Research all issues in parallel

For each issue in the phase, launch an **Explore agent** in parallel to research the relevant code:
- Identify all files that need changes
- Find the exact lines and patterns to modify
- Note any dependencies between issues
- Report findings with file paths and line numbers

### 5. Implement changes

Work through issues in dependency order (simpler/foundational first):
1. Start with one-line fixes and config changes
2. Then tackle component modifications
3. Then new features (new files/routes)
4. Fix dark mode and i18n last (they touch many files)

For each issue:
- Read the file before editing
- Use design tokens from `globals.css` — never hardcode colors
- All user-facing strings must use `useTranslations()` — add keys to both `messages/en.json` and `messages/es.json`
- Use `cn()` for className composition
- Follow existing patterns in the codebase

Use **general-purpose agents** in parallel for large batch edits (e.g., replacing hardcoded colors across many files).

### 6. Verify the build

```
npm run build
npm test
```

Both must pass with zero errors before proceeding.

### 7. Fix E2E tests

```
npx playwright test
```

Common things to check after changes:
- **Consent banner blocking clicks**: Ensure test helpers set `fingoal_consent` in localStorage via `addInitScript`
- **CSS selector changes**: If you renamed classes (e.g., `text-red-700` → `text-error`), update any test selectors that match on those classes
- **Route protection changes**: If you changed `protectedPaths` in `lib/supabase/middleware.ts`, verify tests that navigate to those routes
- **Ambiguous locators**: If new elements match existing `getByRole`/`getByText` queries, scope them (e.g., `page.getByRole('main').getByRole(...)`)
- **Kill stale dev servers**: `lsof -ti:3000 | xargs kill -9` before running tests so `PLAYWRIGHT_TEST_MODE` env var takes effect

Re-run until all tests pass.

### 8. Update the roadmap

Edit `docs/roadmap.md`:
- Check off each completed issue: `- [ ]` → `- [x]`
- Add branch name and brief description of what was done
- Update the Notes section if relevant

### 9. Update implementation docs

Edit `.ai/implementation.md`:
- Add a new section for each completed issue
- List new files created and existing files modified
- Document architecture decisions
- Update the "Next Steps" section

### 10. Close GitHub issues

For each completed issue:
1. Add a comment with:
   - Branch name
   - Summary of what was done (files changed, approach taken)
2. Close the issue with `state_reason: completed`

Use parallel API calls — all comments first, then all closes.

### 11. Report summary

Output a summary table:

| Issue | Title | Status |
|-------|-------|--------|
| #XX   | ...   | Done   |

Include total files changed, tests passing, and branch name.
