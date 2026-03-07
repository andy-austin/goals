'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ExchangeRates } from '@/lib/exchange';

const CACHE_KEY = 'fingoal_exchange_rates';
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

interface CachedRates {
  data: ExchangeRates;
  timestamp: number;
}

function getCachedRates(): ExchangeRates | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const cached: CachedRates = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
}

function setCachedRates(data: ExchangeRates): void {
  if (typeof window === 'undefined') return;

  try {
    const cached: CachedRates = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export interface UseExchangeRatesReturn {
  rates: ExchangeRates | null;
  isLoading: boolean;
  error: string | null;
  convert: (amount: number, from: string, to: string) => number | null;
}

export function useExchangeRates(): UseExchangeRatesReturn {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = getCachedRates();
    if (cached) {
      setRates(cached);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchRates() {
      try {
        const response = await fetch('/api/exchange');
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }

        const data: ExchangeRates = await response.json();
        if (!cancelled) {
          setRates(data);
          setCachedRates(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchRates();

    return () => {
      cancelled = true;
    };
  }, []);

  const convert = useCallback(
    (amount: number, from: string, to: string): number | null => {
      if (!rates) return null;

      const fromRate = rates.rates[from];
      const toRate = rates.rates[to];
      if (fromRate == null || toRate == null) return null;

      // Convert via base: amount in "from" -> USD -> "to"
      return (amount / fromRate) * toRate;
    },
    [rates]
  );

  return { rates, isLoading, error, convert };
}
