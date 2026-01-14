# Design System

## Purpose
Comprehensive design tokens and theming system using CSS variables. Provides consistent colors, typography, spacing, and component styling with automatic dark mode support.

## Key Files

| File | Description |
|------|-------------|
| `app/globals.css` | CSS variables, Tailwind theme config, base styles |
| `types/goal.ts` | BUCKET_CONFIG with color variable references |

---

## Design Tokens

All tokens are defined as CSS variables in `:root` with dark mode overrides via `@media (prefers-color-scheme: dark)`.

### Color Tokens

#### Core Colors
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--background` | `#ffffff` | `#09090b` | Page background |
| `--foreground` | `#171717` | `#fafafa` | Primary text |
| `--muted` | `#f4f4f5` | `#27272a` | Muted backgrounds |
| `--muted-foreground` | `#71717a` | `#a1a1aa` | Secondary text |
| `--border` | `#e4e4e7` | `#27272a` | Borders, dividers |

#### Primary (Emerald)
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--primary` | `#059669` | `#10b981` | Primary actions |
| `--primary-foreground` | `#ffffff` | `#ffffff` | Text on primary |
| `--primary-hover` | `#047857` | `#059669` | Hover state |

#### Secondary
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--secondary` | `#f4f4f5` | `#27272a` | Secondary buttons |
| `--secondary-foreground` | `#18181b` | `#fafafa` | Text on secondary |
| `--secondary-hover` | `#e4e4e7` | `#3f3f46` | Hover state |

#### Destructive
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--destructive` | `#dc2626` | `#ef4444` | Destructive actions |
| `--destructive-foreground` | `#ffffff` | `#ffffff` | Text on destructive |

---

### Bucket Colors

Each bucket has three color variants for different use cases.

#### Safety (Green)
| Token | Light | Dark |
|-------|-------|------|
| `--bucket-safety` | `#22c55e` | `#4ade80` |
| `--bucket-safety-light` | `#dcfce7` | `#166534` |
| `--bucket-safety-dark` | `#166534` | `#bbf7d0` |

#### Growth (Blue)
| Token | Light | Dark |
|-------|-------|------|
| `--bucket-growth` | `#3b82f6` | `#60a5fa` |
| `--bucket-growth-light` | `#dbeafe` | `#1e40af` |
| `--bucket-growth-dark` | `#1e40af` | `#bfdbfe` |

#### Dream (Purple)
| Token | Light | Dark |
|-------|-------|------|
| `--bucket-dream` | `#a855f7` | `#c084fc` |
| `--bucket-dream-light` | `#f3e8ff` | `#6b21a8` |
| `--bucket-dream-dark` | `#6b21a8` | `#e9d5ff` |

---

### Semantic Colors
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--success` | `#22c55e` | `#4ade80` | Success states |
| `--warning` | `#f59e0b` | `#fbbf24` | Warning states |
| `--error` | `#ef4444` | `#f87171` | Error states |
| `--info` | `#3b82f6` | `#60a5fa` | Info states |

---

### Shadows
| Token | Value |
|-------|-------|
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `--shadow` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |

---

### Border Radius
| Token | Value |
|-------|-------|
| `--radius-sm` | `0.25rem` (4px) |
| `--radius` | `0.375rem` (6px) |
| `--radius-md` | `0.5rem` (8px) |
| `--radius-lg` | `0.75rem` (12px) |
| `--radius-xl` | `1rem` (16px) |
| `--radius-full` | `9999px` |

---

### Focus Ring
| Token | Light | Dark |
|-------|-------|------|
| `--ring` | `#059669` | `#10b981` |
| `--ring-offset` | `#ffffff` | `#09090b` |

---

## Typography

Uses Geist font family configured in `app/layout.tsx`.

| Variable | Font |
|----------|------|
| `--font-geist-sans` | Geist Sans |
| `--font-geist-mono` | Geist Mono |

Mapped to Tailwind:
- `font-sans` → Geist Sans
- `font-mono` → Geist Mono

---

## Usage Examples

### Using CSS Variables
```css
.my-component {
  background: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
}

.bucket-safety-card {
  background: var(--bucket-safety-light);
  border-left: 4px solid var(--bucket-safety);
  color: var(--bucket-safety-dark);
}
```

### Using Tailwind Classes
```tsx
// Core colors
<div className="bg-background text-foreground" />
<div className="bg-muted text-muted-foreground" />
<div className="border border-border" />

// Primary
<button className="bg-primary text-primary-foreground hover:bg-primary-hover" />

// Bucket colors
<div className="bg-bucket-safety text-white" />
<div className="bg-bucket-safety-light text-bucket-safety-dark" />
<span className="text-bucket-growth" />
```

### Using BUCKET_CONFIG
```typescript
import { BUCKET_CONFIG, type Bucket } from '@/types';

const bucket: Bucket = 'safety';
const config = BUCKET_CONFIG[bucket];

// Use in inline styles
<div style={{
  backgroundColor: config.bgColorVar,  // 'var(--bucket-safety-light)'
  borderColor: config.colorVar         // 'var(--bucket-safety)'
}}>
  {config.label}  // 'Safety'
</div>
```

---

## Dark Mode

Dark mode is automatic via CSS media query:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #09090b;
    --foreground: #fafafa;
    /* ... other dark mode values */
  }
}
```

**No JavaScript required** - colors adapt automatically to system preference.

---

## Tailwind Integration

The `@theme inline` directive in `globals.css` maps CSS variables to Tailwind:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-bucket-safety: var(--bucket-safety);
  /* ... */
}
```

This enables using `bg-background`, `text-primary`, `bg-bucket-safety`, etc.

---

## Dependencies

**Used by:**
- All UI components in `components/ui/`
- `components/Header.tsx`
- `app/page.tsx`
- `types/goal.ts` (BUCKET_CONFIG)

---

## Adding New Tokens

1. Add CSS variable to `:root` in `app/globals.css`
2. Add dark mode variant in `@media (prefers-color-scheme: dark)`
3. Add Tailwind mapping in `@theme inline` if needed
4. Update this documentation
