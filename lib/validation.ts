import { GoalFormInput, SMARTValidation } from '@/types';

/**
 * Validates a goal against SMART criteria
 * 
 * Specific: Title > 3 chars, Description > 20 chars
 * Measurable: Amount > 0
 * Achievable: (Placeholder) Always true for now
 * Relevant: Why it matters > 10 chars
 * Time-bound: Date in the future
 */
export function validateSMART(data: Partial<GoalFormInput>): SMARTValidation {
  const { title, description, amount, targetDate, whyItMatters } = data;

  const specific = {
    isValid: (title?.length || 0) >= 3 && (description?.length || 0) >= 20,
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
    isValid: (whyItMatters?.length || 0) >= 10,
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
