# Landing Page Translation Update

The home screen (landing page) has been fully translated to support internationalization. All hardcoded text strings have been moved to translation files and the components have been updated to use the `useTranslations` hook.

## Changes

### Translation Files
- **`messages/en.json`**: Added a new `landing` section with structured keys for all landing page sections.
- **`messages/es.json`**: Added the corresponding Spanish translations.

### Components Updated
All components in `components/landing/` were refactored:
- `LandingHeader.tsx`
- `HeroSection.tsx`
- `MethodologySection.tsx`
- `GoalCalculator.tsx` (also fixed a linting error with date handling)
- `WhyDocumentSection.tsx`
- `PriorityFeature.tsx`
- `CTASection.tsx`
- `Footer.tsx`

## Verification
- **Linting**: Passed (fixed `Date.now()` purity issue).
- **Build**: Passed (`npm run build` successful).

The application will now automatically display the landing page in English or Spanish based on the user's browser locale.