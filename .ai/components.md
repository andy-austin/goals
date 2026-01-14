# UI Components

## Purpose
Reusable React components that form the application's user interface. Built with accessibility and dark mode support in mind.

## Key Files

| File | Description |
|------|-------------|
| `components/Header.tsx` | App header with logo and responsive navigation |
| `components/ui/Button.tsx` | Button component with multiple variants |
| `components/ui/Card.tsx` | Card container with header, content, footer subcomponents |
| `components/ui/Input.tsx` | Form inputs (Input, Textarea, Label, Select) |
| `components/ui/Badge.tsx` | Badge and BucketBadge for labels/chips |
| `components/ui/index.ts` | Barrel export for UI components |
| `components/index.ts` | Main component exports |

---

## Components

### Header
Responsive app header with navigation.

**File:** `components/Header.tsx`

**Features:**
- Logo with app title
- Desktop navigation links
- Mobile hamburger menu
- Active page indicator
- Dark mode support

**Usage:**
```tsx
import { Header } from '@/components';

// Used in app/layout.tsx
<Header />
```

**Navigation Items:**
| Route | Label |
|-------|-------|
| `/` | Dashboard |
| `/create` | Create Goal |
| `/timeline` | Timeline |

---

### Button
Versatile button component with multiple variants and sizes.

**File:** `components/ui/Button.tsx`

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | `''` | Additional CSS classes |

**Usage:**
```tsx
import { Button } from '@/components';

<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

**Styling:**
- Primary: Emerald background (`--primary`)
- Secondary: Muted background with border
- Ghost: Transparent, hover shows background
- Destructive: Red background (`--destructive`)

---

### Card
Container component for grouping related content.

**File:** `components/ui/Card.tsx`

**Components:**
| Component | Description |
|-----------|-------------|
| `Card` | Main container |
| `CardHeader` | Top section with border |
| `CardContent` | Main content area |
| `CardFooter` | Bottom section with border |
| `CardTitle` | Heading text |
| `CardDescription` | Muted description text |

**Props (Card):**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'ghost'` | `'default'` | Visual style |
| `className` | `string` | `''` | Additional CSS classes |

**Usage:**
```tsx
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components';

<Card>
  <CardHeader>
    <CardTitle>Goal Summary</CardTitle>
    <CardDescription>Your financial goals overview</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>

// Ghost variant (no background/border)
<Card variant="ghost">
  <CardContent>Minimal card</CardContent>
</Card>
```

---

### Input Components
Form input elements with consistent styling.

**File:** `components/ui/Input.tsx`

#### Input
Text input field.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `boolean` | `false` | Show error styling |
| `type` | `string` | `'text'` | Input type |

**Usage:**
```tsx
import { Input, Label } from '@/components';

<Label htmlFor="title" required>Goal Title</Label>
<Input id="title" placeholder="Enter goal title" />
<Input error placeholder="Invalid input" />
```

#### Textarea
Multi-line text input.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `boolean` | `false` | Show error styling |

**Usage:**
```tsx
import { Textarea, Label } from '@/components';

<Label htmlFor="description">Description</Label>
<Textarea id="description" placeholder="Describe your goal..." />
```

#### Label
Form label with optional required indicator.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `required` | `boolean` | `false` | Show red asterisk |

**Usage:**
```tsx
import { Label } from '@/components';

<Label>Optional Field</Label>
<Label required>Required Field</Label>
```

#### Select
Dropdown select input.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `boolean` | `false` | Show error styling |

**Usage:**
```tsx
import { Select, Label } from '@/components';

<Label htmlFor="currency">Currency</Label>
<Select id="currency">
  <option value="USD">US Dollar</option>
  <option value="EUR">Euro</option>
</Select>
```

---

### Badge
Small label/chip for status or categories.

**File:** `components/ui/Badge.tsx`

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'bucket'` | `'default'` | Visual style |
| `bucket` | `Bucket` | - | Required when `variant="bucket"` |
| `size` | `'sm' \| 'md'` | `'md'` | Badge size |

**Usage:**
```tsx
import { Badge } from '@/components';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="bucket" bucket="safety">Safety</Badge>
```

### BucketBadge
Pre-styled badge for bucket categories with icons.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `bucket` | `Bucket` | required | Which bucket (safety, growth, dream) |
| `showIcon` | `boolean` | `true` | Show bucket icon |

**Usage:**
```tsx
import { BucketBadge } from '@/components';

<BucketBadge bucket="safety" />   // Green with shield icon
<BucketBadge bucket="growth" />   // Blue with trending-up icon
<BucketBadge bucket="dream" />    // Purple with star icon
<BucketBadge bucket="safety" showIcon={false} />  // No icon
```

---

## Dependencies

**Depends on:**
- `@/types` - Bucket type for BucketBadge
- CSS variables from `app/globals.css`

**Used by:**
- `app/page.tsx` - Dashboard
- `app/layout.tsx` - Header
- Future: Goal creation forms, timeline, etc.

---

## Adding New Components

1. Create component in `components/ui/ComponentName.tsx`
2. Export from `components/ui/index.ts`
3. Re-export from `components/index.ts`
4. Update this documentation
5. Add usage examples
