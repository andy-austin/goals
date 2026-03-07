import type { SavingsStrategy } from './types';

export const STRATEGIES_CATALOG: SavingsStrategy[] = [
  {
    id: 'three-bucket',
    titleKey: 'threeBucket.title',
    subtitleKey: 'threeBucket.subtitle',
    icon: '\u{1F4E6}',
    bestForKey: 'threeBucket.bestFor',
    steps: [
      { titleKey: 'threeBucket.step1.title', descriptionKey: 'threeBucket.step1.description' },
      { titleKey: 'threeBucket.step2.title', descriptionKey: 'threeBucket.step2.description' },
      { titleKey: 'threeBucket.step3.title', descriptionKey: 'threeBucket.step3.description' },
      { titleKey: 'threeBucket.step4.title', descriptionKey: 'threeBucket.step4.description' },
    ],
  },
  {
    id: 'snowball',
    titleKey: 'snowball.title',
    subtitleKey: 'snowball.subtitle',
    icon: '\u{26C4}',
    bestForKey: 'snowball.bestFor',
    steps: [
      { titleKey: 'snowball.step1.title', descriptionKey: 'snowball.step1.description' },
      { titleKey: 'snowball.step2.title', descriptionKey: 'snowball.step2.description' },
      { titleKey: 'snowball.step3.title', descriptionKey: 'snowball.step3.description' },
      { titleKey: 'snowball.step4.title', descriptionKey: 'snowball.step4.description' },
    ],
  },
  {
    id: 'avalanche',
    titleKey: 'avalanche.title',
    subtitleKey: 'avalanche.subtitle',
    icon: '\u{26F0}\uFE0F',
    bestForKey: 'avalanche.bestFor',
    steps: [
      { titleKey: 'avalanche.step1.title', descriptionKey: 'avalanche.step1.description' },
      { titleKey: 'avalanche.step2.title', descriptionKey: 'avalanche.step2.description' },
      { titleKey: 'avalanche.step3.title', descriptionKey: 'avalanche.step3.description' },
      { titleKey: 'avalanche.step4.title', descriptionKey: 'avalanche.step4.description' },
    ],
  },
  {
    id: 'automate',
    titleKey: 'automate.title',
    subtitleKey: 'automate.subtitle',
    icon: '\u{2699}\uFE0F',
    bestForKey: 'automate.bestFor',
    steps: [
      { titleKey: 'automate.step1.title', descriptionKey: 'automate.step1.description' },
      { titleKey: 'automate.step2.title', descriptionKey: 'automate.step2.description' },
      { titleKey: 'automate.step3.title', descriptionKey: 'automate.step3.description' },
      { titleKey: 'automate.step4.title', descriptionKey: 'automate.step4.description' },
    ],
  },
  {
    id: 'setbacks',
    titleKey: 'setbacks.title',
    subtitleKey: 'setbacks.subtitle',
    icon: '\u{1F6E1}\uFE0F',
    bestForKey: 'setbacks.bestFor',
    steps: [
      { titleKey: 'setbacks.step1.title', descriptionKey: 'setbacks.step1.description' },
      { titleKey: 'setbacks.step2.title', descriptionKey: 'setbacks.step2.description' },
      { titleKey: 'setbacks.step3.title', descriptionKey: 'setbacks.step3.description' },
      { titleKey: 'setbacks.step4.title', descriptionKey: 'setbacks.step4.description' },
    ],
  },
  {
    id: 'monthly-review',
    titleKey: 'monthlyReview.title',
    subtitleKey: 'monthlyReview.subtitle',
    icon: '\u{1F4C5}',
    bestForKey: 'monthlyReview.bestFor',
    steps: [
      { titleKey: 'monthlyReview.step1.title', descriptionKey: 'monthlyReview.step1.description' },
      { titleKey: 'monthlyReview.step2.title', descriptionKey: 'monthlyReview.step2.description' },
      { titleKey: 'monthlyReview.step3.title', descriptionKey: 'monthlyReview.step3.description' },
      { titleKey: 'monthlyReview.step4.title', descriptionKey: 'monthlyReview.step4.description' },
    ],
  },
];

export function getStrategyById(id: string): SavingsStrategy | undefined {
  return STRATEGIES_CATALOG.find((s) => s.id === id);
}
