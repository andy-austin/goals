export interface StrategyStep {
  titleKey: string;
  descriptionKey: string;
}

export interface SavingsStrategy {
  id: string;
  titleKey: string;
  subtitleKey: string;
  icon: string; // emoji
  steps: StrategyStep[];
  bestForKey: string;
}
