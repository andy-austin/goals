import { GoalFormInput, SMARTValidation } from '@/types';

// =============================================================================
// Validation Constants (single source of truth)
// =============================================================================

export const MIN_TITLE_LENGTH = 3;
export const MIN_DESCRIPTION_LENGTH = 20;
export const MIN_WHY_IT_MATTERS_LENGTH = 10;
export const MIN_PASSWORD_LENGTH = 6;

/**
 * Validates a goal against SMART criteria
 *
 * Specific: Title >= MIN_TITLE_LENGTH, Description >= MIN_DESCRIPTION_LENGTH
 * Measurable: Amount > 0
 * Achievable: (Placeholder) Always true for now
 * Relevant: Why it matters >= MIN_WHY_IT_MATTERS_LENGTH
 * Time-bound: Date in the future
 */
export function validateSMART(data: Partial<GoalFormInput>): SMARTValidation {
  const { title, description, amount, targetDate, whyItMatters } = data;

  const specific = {
    isValid: (title?.length || 0) >= MIN_TITLE_LENGTH && (description?.length || 0) >= MIN_DESCRIPTION_LENGTH,
    message: 'Title (3+) and description (20+) required',
  };

  const measurable = {
    isValid: (amount || 0) > 0,
    message: 'Amount must be greater than 0',
  };

  const achievable = {
    isValid: true, // Placeholder logic
    message: 'Timeline seems realistic',
  };

  const relevant = {
    isValid: (whyItMatters?.length || 0) >= MIN_WHY_IT_MATTERS_LENGTH,
    message: 'Motivation statement (10+) required',
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const timeBound = {
    isValid: !!targetDate && new Date(targetDate) >= today,
    message: 'Target date must be in the future',
  };

  const isComplete =
    specific.isValid &&
    measurable.isValid &&
    achievable.isValid &&
    relevant.isValid &&
    timeBound.isValid &&
    !!data.bucket &&
    !!data.currency;

  return {
    specific,
    measurable,
    achievable,
    relevant,
    timeBound,
    isComplete,
  };
}
