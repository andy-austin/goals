import { NextResponse } from 'next/server';
import type { ExchangeRates } from '@/lib/exchange';

const FRANKFURTER_URL = 'https://api.frankfurter.app/latest?from=USD';

/** Cache for 12 hours */
export const revalidate = 43200;

export async function GET() {
  try {
    const response = await fetch(FRANKFURTER_URL, {
      next: { revalidate: 43200 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch exchange rates' },
        { status: 502 }
      );
    }

    const data = await response.json();

    const rates: ExchangeRates = {
      base: data.base ?? 'USD',
      rates: { USD: 1, ...data.rates },
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(rates);
  } catch {
    return NextResponse.json(
      { error: 'Exchange rate service unavailable' },
      { status: 503 }
    );
  }
}
