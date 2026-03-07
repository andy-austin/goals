export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string; // ISO date string
}

export interface ExchangeRateState {
  rates: ExchangeRates | null;
  isLoading: boolean;
  error: string | null;
}
