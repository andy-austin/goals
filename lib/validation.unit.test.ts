import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { validateSMART } from './validation';
import type { GoalFormInput } from '@/types';

// A fully valid input — individual tests deviate from this baseline
const validInput: GoalFormInput = {
  title: 'Emergency Fund',
  description: 'Save three months of living expenses as a financial safety net.',
  amount: 10000,
  currency: 'USD',
  targetDate: '2027-01-01',
  bucket: 'safety',
  whyItMatters: 'To stay secure if I lose my job.',
  visibility: 'private',
  spaceId: null,
};

describe('validateSMART', () => {
  // Fix "today" so boundary tests are deterministic
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ---------------------------------------------------------------------------
  // Happy path
  // ---------------------------------------------------------------------------

  it('returns isComplete: true when all fields are valid', () => {
    const result = validateSMART(validInput);
    expect(result.isComplete).toBe(true);
    expect(result.specific.isValid).toBe(true);
    expect(result.measurable.isValid).toBe(true);
    expect(result.achievable.isValid).toBe(true);
    expect(result.relevant.isValid).toBe(true);
    expect(result.timeBound.isValid).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // Specific (title + description)
  // ---------------------------------------------------------------------------

  it('specific: fails when title is below 3 chars', () => {
    const result = validateSMART({ ...validInput, title: 'ab' });
    expect(result.specific.isValid).toBe(false);
    expect(result.isComplete).toBe(false);
  });

  it('specific: passes when title is exactly 3 chars', () => {
    const result = validateSMART({ ...validInput, title: 'abc' });
    expect(result.specific.isValid).toBe(true);
  });

  it('specific: fails when description is below 20 chars', () => {
    const result = validateSMART({ ...validInput, description: '19 chars exactly!!!' }); // 19 chars
    expect(result.specific.isValid).toBe(false);
  });

  it('specific: passes when description is exactly 20 chars', () => {
    const result = validateSMART({ ...validInput, description: '20 chars exactly!!!!' }); // 20 chars
    expect(result.specific.isValid).toBe(true);
  });

  it('specific: fails when title is missing', () => {
    const result = validateSMART({ ...validInput, title: undefined as unknown as string });
    expect(result.specific.isValid).toBe(false);
  });

  it('specific: fails when description is missing', () => {
    const result = validateSMART({ ...validInput, description: undefined as unknown as string });
    expect(result.specific.isValid).toBe(false);
  });

  // ---------------------------------------------------------------------------
  // Measurable (amount)
  // ---------------------------------------------------------------------------

  it('measurable: fails when amount is 0', () => {
    const result = validateSMART({ ...validInput, amount: 0 });
    expect(result.measurable.isValid).toBe(false);
    expect(result.isComplete).toBe(false);
  });

  it('measurable: fails when amount is negative', () => {
    const result = validateSMART({ ...validInput, amount: -100 });
    expect(result.measurable.isValid).toBe(false);
  });

  it('measurable: passes when amount is a small positive number', () => {
    const result = validateSMART({ ...validInput, amount: 0.01 });
    expect(result.measurable.isValid).toBe(true);
  });

  it('measurable: fails when amount is missing', () => {
    const result = validateSMART({ ...validInput, amount: undefined as unknown as number });
    expect(result.measurable.isValid).toBe(false);
  });

  // ---------------------------------------------------------------------------
  // Achievable (always true — placeholder)
  // ---------------------------------------------------------------------------

  it('achievable: is always valid regardless of input', () => {
    expect(validateSMART({}).achievable.isValid).toBe(true);
    expect(validateSMART(validInput).achievable.isValid).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // Relevant (whyItMatters)
  // ---------------------------------------------------------------------------

  it('relevant: fails when whyItMatters is below 10 chars', () => {
    const result = validateSMART({ ...validInput, whyItMatters: 'Too short' }); // 9 chars
    expect(result.relevant.isValid).toBe(false);
    expect(result.isComplete).toBe(false);
  });

  it('relevant: passes when whyItMatters is exactly 10 chars', () => {
    const result = validateSMART({ ...validInput, whyItMatters: 'Exactly10!' });
    expect(result.relevant.isValid).toBe(true);
  });

  it('relevant: fails when whyItMatters is missing', () => {
    const result = validateSMART({ ...validInput, whyItMatters: undefined as unknown as string });
    expect(result.relevant.isValid).toBe(false);
  });

  // ---------------------------------------------------------------------------
  // Time-bound (targetDate)
  // ---------------------------------------------------------------------------

  it('timeBound: fails when targetDate is in the past', () => {
    const result = validateSMART({ ...validInput, targetDate: '2025-01-01' });
    expect(result.timeBound.isValid).toBe(false);
    expect(result.isComplete).toBe(false);
  });

  it('timeBound: passes when targetDate is today', () => {
    // Today is 2026-06-15 per fake timers; `>= today` means today is valid
    const result = validateSMART({ ...validInput, targetDate: '2026-06-15' });
    expect(result.timeBound.isValid).toBe(true);
  });

  it('timeBound: passes when targetDate is in the future', () => {
    const result = validateSMART({ ...validInput, targetDate: '2028-12-31' });
    expect(result.timeBound.isValid).toBe(true);
  });

  it('timeBound: fails when targetDate is missing', () => {
    const result = validateSMART({ ...validInput, targetDate: undefined as unknown as string });
    expect(result.timeBound.isValid).toBe(false);
  });

  // ---------------------------------------------------------------------------
  // isComplete — requires bucket and currency too
  // ---------------------------------------------------------------------------

  it('isComplete: false when bucket is missing', () => {
    const result = validateSMART({ ...validInput, bucket: undefined as unknown as GoalFormInput['bucket'] });
    expect(result.isComplete).toBe(false);
  });

  it('isComplete: false when currency is missing', () => {
    const result = validateSMART({ ...validInput, currency: undefined as unknown as GoalFormInput['currency'] });
    expect(result.isComplete).toBe(false);
  });

  // ---------------------------------------------------------------------------
  // Empty / partial input
  // ---------------------------------------------------------------------------

  it('returns all fields invalid for an empty object', () => {
    const result = validateSMART({});
    expect(result.specific.isValid).toBe(false);
    expect(result.measurable.isValid).toBe(false);
    expect(result.relevant.isValid).toBe(false);
    expect(result.timeBound.isValid).toBe(false);
    expect(result.isComplete).toBe(false);
  });

  it('includes a message string on every field', () => {
    const result = validateSMART(validInput);
    expect(typeof result.specific.message).toBe('string');
    expect(typeof result.measurable.message).toBe('string');
    expect(typeof result.achievable.message).toBe('string');
    expect(typeof result.relevant.message).toBe('string');
    expect(typeof result.timeBound.message).toBe('string');
  });
});
