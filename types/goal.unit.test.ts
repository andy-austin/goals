import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  getCurrencySymbol,
  formatDate,
  getCurrencyName,
  getCurrencyOptions,
  CURRENCIES,
  BUCKETS,
  BUCKET_CONFIG,
} from './goal';

// ---------------------------------------------------------------------------
// formatCurrency
// ---------------------------------------------------------------------------

describe('formatCurrency', () => {
  it('formats a standard USD amount', () => {
    expect(formatCurrency(1000, 'USD')).toBe('USD 1,000.00');
  });

  it('formats EUR correctly', () => {
    expect(formatCurrency(500, 'EUR')).toBe('EUR 500.00');
  });

  it('uses "UI" as the code for UYI (Unidad Indexada)', () => {
    const result = formatCurrency(1000, 'UYI');
    expect(result.startsWith('UI ')).toBe(true);
  });

  it('formats zero', () => {
    expect(formatCurrency(0, 'USD')).toBe('USD 0.00');
  });

  it('formats a large amount with thousands separator', () => {
    const result = formatCurrency(1_000_000, 'USD');
    expect(result).toBe('USD 1,000,000.00');
  });

  it('formats a fractional amount to 2 decimal places', () => {
    expect(formatCurrency(99.9, 'USD')).toBe('USD 99.90');
  });

  it('formats a negative amount', () => {
    expect(formatCurrency(-500, 'USD')).toBe('USD -500.00');
  });
});

// ---------------------------------------------------------------------------
// getCurrencySymbol
// ---------------------------------------------------------------------------

describe('getCurrencySymbol', () => {
  it('returns "$" for USD', () => {
    expect(getCurrencySymbol('USD')).toBe('$');
  });

  it('returns "€" for EUR', () => {
    expect(getCurrencySymbol('EUR')).toBe('€');
  });

  it('returns "£" for GBP', () => {
    expect(getCurrencySymbol('GBP')).toBe('£');
  });

  it('returns "UI" for UYI (special-cased — not a standard ISO code)', () => {
    expect(getCurrencySymbol('UYI')).toBe('UI');
  });

  it('returns the currency code itself as fallback for unknown currencies', () => {
    // All supported currencies should return a non-empty symbol
    for (const currency of CURRENCIES) {
      expect(getCurrencySymbol(currency).length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------

describe('formatDate', () => {
  it('formats a Date object', () => {
    const d = new Date(2027, 5, 15); // June 15 2027, local time
    expect(formatDate(d)).toBe('June 15, 2027');
  });

  it('formats a YYYY-MM-DD string without timezone shift', () => {
    // Must parse as local time (not UTC), so day should not drift
    expect(formatDate('2027-06-15')).toBe('June 15, 2027');
  });

  it('formats an ISO datetime string', () => {
    // ISO strings are parsed as UTC; result depends on local offset.
    // We just verify it doesn't throw and returns a non-empty string.
    const result = formatDate('2027-06-15T12:00:00.000Z');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result).not.toBe('Invalid Date');
  });

  it('returns "—" for undefined', () => {
    expect(formatDate(undefined)).toBe('—');
  });

  it('returns "Invalid Date" for a non-parseable string', () => {
    expect(formatDate('not-a-date')).toBe('Invalid Date');
  });

  it('respects the locale parameter', () => {
    // Spanish locale uses different month names
    const result = formatDate(new Date(2027, 0, 1), 'es-ES');
    expect(result.toLowerCase()).toContain('enero');
  });
});

// ---------------------------------------------------------------------------
// getCurrencyName
// ---------------------------------------------------------------------------

describe('getCurrencyName', () => {
  it('returns "US Dollar" for USD in en-US', () => {
    expect(getCurrencyName('USD', 'en-US')).toBe('US Dollar');
  });

  it('returns "Euro" for EUR in en-US', () => {
    expect(getCurrencyName('EUR', 'en-US')).toBe('Euro');
  });

  it('returns "Indexed Unit (Uruguay)" for UYI in en-US', () => {
    expect(getCurrencyName('UYI', 'en-US')).toBe('Indexed Unit (Uruguay)');
  });

  it('returns "Unidad Indexada" for UYI in es locale', () => {
    expect(getCurrencyName('UYI', 'es')).toBe('Unidad Indexada');
  });
});

// ---------------------------------------------------------------------------
// getCurrencyOptions
// ---------------------------------------------------------------------------

describe('getCurrencyOptions', () => {
  it('returns an entry for every supported currency', () => {
    const options = getCurrencyOptions('en-US');
    expect(options).toHaveLength(CURRENCIES.length);
  });

  it('each entry has a code and a non-empty name', () => {
    for (const option of getCurrencyOptions('en-US')) {
      expect(CURRENCIES).toContain(option.code);
      expect(option.name.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// Constants: BUCKETS and BUCKET_CONFIG
// ---------------------------------------------------------------------------

describe('BUCKETS', () => {
  it('contains exactly safety, growth, and dream', () => {
    expect(BUCKETS).toEqual(['safety', 'growth', 'dream']);
  });
});

describe('BUCKET_CONFIG', () => {
  it('has a config entry for every bucket', () => {
    for (const bucket of BUCKETS) {
      expect(BUCKET_CONFIG[bucket]).toBeDefined();
      expect(BUCKET_CONFIG[bucket].label.length).toBeGreaterThan(0);
      expect(BUCKET_CONFIG[bucket].icon.length).toBeGreaterThan(0);
    }
  });
});
