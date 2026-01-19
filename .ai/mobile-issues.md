1. Missing Spanish Translations on Timeline Page

Location: app/timeline/page.tsx or Timeline components
┌────────────────────────────┬─────────────────────────────────────────┬───────────────────────────────────────┐
│ Element │ Current (English)            │ Expected (Spanish)           │
├────────────────────────────┼─────────────────────────────────────────┼───────────────────────────────────────┤
│ Zoom buttons │ "All", "1 Year", "5 Years", "10+ Years" │ "Todo", "1 Año", "5 Años", "10+ Años" │
├────────────────────────────┼─────────────────────────────────────────┼───────────────────────────────────────┤
│ Gap indicators │ "2 years skipped", "7 years skipped"    │ "2 años omitidos", "7 años omitidos"  │
├────────────────────────────┼─────────────────────────────────────────┼───────────────────────────────────────┤
│ Days abbreviation in Gantt │ "89d", "364d", "1095d"                  │ "89d" (or "89 días")                  │
└────────────────────────────┴─────────────────────────────────────────┴───────────────────────────────────────┘

2. Form Navigation Buttons Partially Hidden

Location: Form steps (visible in screenshots)

- The "Atrás" (Back) button is partially cut off at the bottom of the viewport on several form steps
- This may be due to viewport height or fixed positioning issues

3. Timeline Marker View - Limited Visibility

Location: Timeline marker section

- On mobile, only 1-2 goal markers are visible at a time in the marker view due to the compressed horizontal space
- Consider making this section horizontally scrollable with touch gestures more prominent

4. Gantt Chart Tooltip Overlap

Location: Gantt chart section

- When hovering/tapping on Gantt bars, the tooltip can overlap with other elements
- The "New Car Fund" tooltip was overlapping with other goal rows

5. Minor: Page Title Scrolls Out of View

Location: Form wizard steps

- When scrolling through longer form steps, the page title "Crear un nuevo objetivo" scrolls off-screen
- Consider a sticky header or compact progress indicator
