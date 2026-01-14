# Investment Goals

A guided goal-creation tool that helps beginner investors transform vague savings intentions into well-defined, SMART financial goals.

## Overview

People starting their investment journey often struggle to define proper financial goals. This tool provides:

- **SMART Framework** - Goals must be Specific, Measurable, Achievable, Relevant, and Time-bound
- **3 Buckets Methodology** - Categorize goals into Safety, Growth, and Dream buckets
- **AI-Powered Suggestions** - Get help refining vague goals into actionable targets
- **Visual Prioritization** - Drag-and-drop ranking and timeline visualization

## Features

### Implemented
- Dashboard with goals overview by bucket
- Responsive navigation (mobile-first)
- Design system with bucket-specific colors (Safety=Green, Growth=Blue, Dream=Purple)
- Dark mode support
- UI component library (Button, Card, Input, Badge)
- State management for goals

### Coming Soon
- Multi-step goal creation wizard
- AI-powered goal refinement suggestions
- Goal templates and examples
- Drag-and-drop prioritization
- Timeline visualization
- Export to PDF/print

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.1.1 (App Router) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| State | React Context + useReducer |
| Fonts | Geist (sans & mono) |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/andy-austin/goals.git
cd goals

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
goals/
├── app/                    # Next.js App Router
│   ├── create/            # Goal creation page
│   ├── timeline/          # Timeline visualization
│   ├── globals.css        # Design tokens & theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Badge.tsx      # Badge & BucketBadge
│   │   ├── Button.tsx     # Button variants
│   │   ├── Card.tsx       # Card components
│   │   └── Input.tsx      # Form inputs
│   └── Header.tsx         # App header & navigation
├── context/               # React Context providers
│   └── GoalsContext.tsx   # Goals state management
├── types/                 # TypeScript definitions
│   └── goal.ts            # Goal types & utilities
└── .ai/                   # AI development docs
    ├── prd.md             # Product requirements
    └── implementation.md  # Implementation status
```

## Goal Data Model

```typescript
interface Goal {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: Currency;
  targetDate: Date;
  bucket: 'safety' | 'growth' | 'dream';
  whyItMatters: string;
  priority: number;
  createdAt: Date;
}
```

## Bucket Categories

| Bucket | Color | Description |
|--------|-------|-------------|
| **Safety** | Green | Non-negotiable, urgent goals (Emergency Fund, Health) |
| **Growth** | Blue | Goals that improve standard of living (House, Education) |
| **Dream** | Purple | Aspirational goals you can afford to risk (Travel, Business) |

## Contributing

See [.ai/implementation.md](.ai/implementation.md) for current development status and next steps.

## License

MIT
