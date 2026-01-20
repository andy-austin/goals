# Affiliate/Referral Monetization Strategy

**Created:** 2026-01-19
**Status:** Planning

---

## The Unique Advantage

| Generic Affiliate Site | This App |
|------------------------|----------|
| "Best savings accounts 2026" | "Best account for YOUR $15K emergency fund" |
| Guessing what user needs | Know exact goal, amount, timeline |
| One-size-fits-all | Bucket-matched recommendations |
| Cold traffic from Google | Warm users who just planned their goals |

**This is the moat.** NerdWallet can't personalize like this app can.

---

## The Funnel

```
User lands on app
        ↓
Creates goals (app learns intent)
        ↓
Completes goal planning
        ↓
"Where should I put this money?"  ← MONETIZATION MOMENT
        ↓
Personalized recommendation
        ↓
Clicks affiliate link
        ↓
Opens/funds account
        ↓
Earn $50-200
```

---

## Recommendations by Bucket

### 🛡️ Safety Bucket (0-2 years)

| Product Type | Examples | Typical Payout |
|--------------|----------|----------------|
| High-Yield Savings | Ally, Marcus, Wealthfront Cash, SoFi | $50-150/funded |
| Money Market | Fidelity, Schwab | $50-100/funded |
| Short-term CDs | Discover, Ally | $25-75/opened |

**Trigger:** After creating emergency fund goal → "Park your savings here"

### 📈 Growth Bucket (2-10 years)

| Product Type | Examples | Typical Payout |
|--------------|----------|----------------|
| Brokerage Account | Fidelity, Schwab, Vanguard | $50-150/funded |
| Robo-Advisor | Betterment, Wealthfront, M1 Finance | $25-100/funded |
| IRA Account | Same brokerages | $50-150/funded |

**Trigger:** After creating house/car goal → "For 5-year goals, invest here"

### ⭐ Dream Bucket (10+ years)

| Product Type | Examples | Typical Payout |
|--------------|----------|----------------|
| Stock Brokerage | Fidelity, Vanguard, Schwab | $50-150/funded |
| Aggressive Robo | Wealthfront, Betterment | $25-100/funded |
| Retirement (IRA/401k) | Same + specialized | $50-200/funded |

**Trigger:** After retirement goal → "Maximize growth with these"

---

## Integration Points

### 1. Post-Goal Creation (Highest Intent)

```
┌────────────────────────────────────────────────────┐
│  ✅ Goal Created: Emergency Fund                   │
│                                                    │
│  💡 Where to save for this goal:                  │
│                                                    │
│  ┌──────────────────────────────────────────────┐ │
│  │ 🏆 Recommended: Wealthfront Cash             │ │
│  │    4.5% APY • FDIC Insured • No fees         │ │
│  │    [Open Account →]                          │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  Other options: Ally (4.2%) • Marcus (4.1%)       │
│                                                    │
│  [Skip for now]         [Go to Dashboard]         │
└────────────────────────────────────────────────────┘
```

### 2. Dashboard Recommendations Widget

```
┌────────────────────────────────────────────────────┐
│  💰 Recommended Accounts for Your Goals           │
│                                                    │
│  🛡️ Emergency Fund → Wealthfront Cash (4.5% APY) │
│  🏠 House Down Payment → Betterment (invest)      │
│  ✈️ Dream Vacation → Ally Savings (4.2% APY)     │
│                                                    │
│  [See All Recommendations]                        │
└────────────────────────────────────────────────────┘
```

### 3. Progress Milestone Triggers

```
When user hits 25%, 50%, 75%:
"You're 50% to your Emergency Fund!
 Make sure you're earning max interest → [Check your rate]"
```

### 4. Goal Completion

```
🎉 Congratulations! You completed your Emergency Fund!

Ready for your next step?
→ Move to higher-yield investment for your House goal
→ [Open Betterment Account]
```

---

## Affiliate Programs

### Easy to Get Approved (Start Here)

| Program | Products | Payout | Approval |
|---------|----------|--------|----------|
| SoFi | Savings, Invest, Loans | $50-100 | Easy |
| Wealthfront | Cash, Invest | $25-75 | Easy |
| M1 Finance | Brokerage, Spend | $25-50 | Easy |
| Ally | Savings, Invest, CDs | $50-100 | Medium |
| Acorns | Micro-investing | $10-25 | Easy |

### Harder but Higher Payout

| Program | Products | Payout | Approval |
|---------|----------|--------|----------|
| Fidelity | Full brokerage | $100-150 | Hard |
| Schwab | Full brokerage | $100-150 | Hard |
| Betterment | Robo-advisor | $50-100 | Medium |
| Marcus (Goldman) | Savings, CDs | $50-100 | Medium |

### Affiliate Networks

| Network | Why Use It |
|---------|------------|
| FlexOffers | Many finance brands in one place |
| CJ Affiliate | Big brands (Discover, etc.) |
| Impact | Modern, good tracking |
| Bankrate/Red Ventures | Highest payouts if approved |

---

## Traffic Strategy

### SEO Content Needed

**Comparison Pages (High Intent):**
- "Ally vs Marcus vs Wealthfront: Best for Emergency Fund"
- "Betterment vs Wealthfront: Which Robo-Advisor for 5-Year Goals"
- "Best Savings Account for House Down Payment 2026"

**Educational Content (Traffic Builders):**
- "How Much Emergency Fund Do I Need?"
- "3-Bucket Investment Strategy Explained"
- "SMART Financial Goals: Complete Guide"

**Tool-Based Content (Lead Magnets):**
- "Free Goal Calculator" → The app
- "Emergency Fund Calculator" → Embed in blog
- "How Long to Save for a House Calculator"

### Volume Needed

| Traffic Goal | Articles Needed | Timeline |
|--------------|-----------------|----------|
| 1K/month | 10-20 quality posts | 3-6 months |
| 10K/month | 50-100 posts | 6-12 months |
| 50K/month | 200+ posts + backlinks | 12-24 months |

---

## Revenue Projections

| Monthly Visitors | Goal Completions | Affiliate Clicks | Conversions | Revenue |
|------------------|------------------|------------------|-------------|---------|
| 1,000 | 100 | 20 | 2 | $100-200 |
| 5,000 | 500 | 100 | 10 | $500-1,000 |
| 10,000 | 1,000 | 200 | 20 | $1,000-2,000 |
| 50,000 | 5,000 | 1,000 | 100 | $5,000-10,000 |

**Assumptions:**
- 10% of visitors complete a goal
- 20% of completers click a recommendation
- 10% of clickers convert
- $50-100 average payout

---

## Implementation Roadmap

### Phase 1: Foundation (2-4 weeks)
- [ ] Build recommendation engine (bucket → products mapping)
- [ ] Create recommendation UI components
- [ ] Add post-goal-creation recommendation screen
- [ ] Add dashboard recommendations widget
- [ ] Set up affiliate link tracking (UTMs)
- [ ] Add FTC disclosure/disclaimer

### Phase 2: Affiliate Setup (2-4 weeks)
- [ ] Apply to 5-10 affiliate programs
- [ ] Get approved
- [ ] Integrate affiliate links
- [ ] Set up conversion tracking

### Phase 3: Content (Ongoing)
- [ ] Launch blog section
- [ ] Write 10 comparison/educational articles
- [ ] Optimize for SEO
- [ ] Build backlinks

### Phase 4: Optimize (Ongoing)
- [ ] A/B test recommendation placements
- [ ] Track which products convert best
- [ ] Double down on winners

---

## Compliance

### FTC Disclosure (Required)

```
"We may earn a commission when you open an account through
our links. This doesn't affect our recommendations or the
price you pay."
```

**Placement:**
- Near every affiliate link
- In site footer
- Dedicated disclosure page

---

## Data Model

```typescript
interface FinancialProduct {
  id: string;
  name: string;
  type: 'savings' | 'brokerage' | 'robo' | 'cd' | 'money_market';
  provider: string;
  apy?: string;
  features: string[];
  bestFor: Bucket[];
  affiliateUrl: string;
  affiliateNetwork: string;
  estimatedPayout: number;
  logo?: string;
}

interface Recommendation {
  goalId: string;
  products: FinancialProduct[];
  reason: string;
}

// Example
const wealthfrontCash: FinancialProduct = {
  id: 'wealthfront-cash',
  name: 'Wealthfront Cash Account',
  type: 'savings',
  provider: 'Wealthfront',
  apy: '4.5%',
  features: ['FDIC Insured', 'No fees', 'No minimum'],
  bestFor: ['safety'],
  affiliateUrl: 'https://wealthfront.com/?ref=XXX',
  affiliateNetwork: 'Impact',
  estimatedPayout: 50,
  logo: '/images/partners/wealthfront.svg'
};
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Recommendation click rate | >15% of goal completions |
| Affiliate conversion rate | >10% of clicks |
| Revenue per 1K visitors | >$100 |
| Top converting product | Track and optimize |
