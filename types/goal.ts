/**
 * Core data models for Investment Goals application
 * Based on SMART framework and 3 Buckets methodology
 */

// =============================================================================
// Enums and Union Types
// =============================================================================

/**
 * Goal categorization based on the 3 Buckets methodology:
 * - safety: Non-negotiable, urgent goals (Emergency Fund, Health)
 * - growth: Goals that improve standard of living (House, Education)
 * - dream: Aspirational goals you can afford to risk (Luxury travel, Business)
 */
export type Bucket = 'safety' | 'growth' | 'dream';

/**
 * Supported currencies for goal amounts (ISO 4217 codes)
 * Uses native Intl.NumberFormat for formatting - no library needed
 */
export type Currency =
  | 'USD'  // US Dollar
  | 'EUR'  // Euro
  | 'GBP'  // British Pound
  | 'JPY'  // Japanese Yen
  | 'CAD'  // Canadian Dollar
  | 'AUD'  // Australian Dollar
  | 'CHF'  // Swiss Franc
  | 'MXN'  // Mexican Peso
  | 'BRL'  // Brazilian Real
  | 'UYU'; // Uruguayan Peso

// =============================================================================
// Core Interfaces
// =============================================================================

/**
 * Main Goal interface representing a user's financial goal
 * All fields are required to ensure SMART compliance
 */
export interface Goal {
  /** Unique identifier for the goal */
  id: string;

  /** Short, descriptive title (e.g., "House Down Payment") */
  title: string;

  /** Detailed description of the goal (SMART: Specific) */
  description: string;

  /** Target amount to save/invest (SMART: Measurable) */
  amount: number;

  /** Currency for the target amount */
  currency: Currency;

  /** Target date to achieve the goal (SMART: Time-bound) */
  targetDate: Date;

  /** Category bucket for prioritization and risk allocation */
  bucket: Bucket;

  /** Emotional anchor statement (SMART: Relevant) */
  whyItMatters: string;

  /** Priority ranking within the bucket (1 = highest) */
  priority: number;

  /** Timestamp when the goal was created */
  createdAt: Date;
}

/**
 * Template for pre-defined goal examples that users can customize
 */
export interface GoalTemplate {
  /** Unique identifier for the template */
  id: string;

  /** Template title (e.g., "Emergency Fund") */
  title: string;

  /** Template description with placeholder guidance */
  description: string;

  /** Pre-assigned bucket category */
  bucket: Bucket;

  /** Minimum suggested amount for this goal type */
  suggestedAmountMin: number;

  /** Maximum suggested amount for this goal type */
  suggestedAmountMax: number;

  /** Suggested timeline in months to achieve this goal */
  suggestedTimelineMonths: number;

  /** Example "why it matters" statement */
  sampleWhyItMatters: string;

  /** Optional icon identifier */
  icon?: string;
}

// =============================================================================
// Helper Types
// =============================================================================

/**
 * Input type for creating a new goal (excludes auto-generated fields)
 */
export type CreateGoalInput = Omit<Goal, 'id' | 'createdAt' | 'priority'>;

/**
 * Input type for the goal creation form (dates as strings for form handling)
 */
export interface GoalFormInput {
  title: string;
  description: string;
  amount: number;
  currency: Currency;
  targetDate: string; // ISO date string for form input
  bucket: Bucket;
  whyItMatters: string;
}

/**
 * Goal with computed metadata for display purposes
 */
export interface GoalWithMeta extends Goal {
  /** Days remaining until target date */
  daysRemaining: number;

  /** Months remaining until target date */
  monthsRemaining: number;

  /** Whether the goal is overdue */
  isOverdue: boolean;

  /** Time horizon category based on target date */
  timeHorizon: 'short' | 'medium' | 'long';
}

/**
 * Validation result for a single field
 */
export interface FieldValidation {
  isValid: boolean;
  message?: string;
}

/**
 * SMART validation result for a goal
 */
export interface SMARTValidation {
  specific: FieldValidation;
  measurable: FieldValidation;
  achievable: FieldValidation;
  relevant: FieldValidation;
  timeBound: FieldValidation;
  isComplete: boolean;
}

/**
 * Goals organized by bucket for display
 */
export interface GoalsByBucket {
  safety: Goal[];
  growth: Goal[];
  dream: Goal[];
}

// =============================================================================
// Constants
// =============================================================================

/**
 * Bucket display configuration
 * Colors use CSS variable references for theme consistency
 */
export const BUCKET_CONFIG: Record<Bucket, {
  label: string;
  colorVar: string;
  bgColorVar: string;
  icon: string;
  description: string;
}> = {
  safety: {
    label: 'Safety',
    colorVar: 'var(--bucket-safety)',
    bgColorVar: 'var(--bucket-safety-light)',
    icon: 'shield',
    description: 'Non-negotiable, urgent goals like emergency funds',
  },
  growth: {
    label: 'Growth',
    colorVar: 'var(--bucket-growth)',
    bgColorVar: 'var(--bucket-growth-light)',
    icon: 'trending-up',
    description: 'Goals that improve your standard of living',
  },
  dream: {
    label: 'Dream',
    colorVar: 'var(--bucket-dream)',
    bgColorVar: 'var(--bucket-dream-light)',
    icon: 'star',
    description: 'Aspirational goals you can afford to risk',
  },
};

/**
 * All supported currencies as an array (ISO 4217 codes)
 */
export const CURRENCIES: Currency[] = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'MXN', 'BRL', 'UYU'
];

// =============================================================================
// Currency Formatting Utilities (using native Intl.NumberFormat)
// =============================================================================

/**
 * Format an amount with currency symbol using browser's Intl API
 * Handles symbol placement, decimal places, and thousand separators automatically
 */
export function formatCurrency(amount: number, currency: Currency, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Get the display name of a currency
 */
export function getCurrencyName(currency: Currency, locale = 'en-US'): string {
  return new Intl.DisplayNames([locale], { type: 'currency' }).of(currency) ?? currency;
}

/**
 * Get currency info for display in dropdowns/selectors
 */
export function getCurrencyOptions(locale = 'en-US'): Array<{ code: Currency; name: string }> {
  return CURRENCIES.map((code) => ({
    code,
    name: getCurrencyName(code, locale),
  }));
}

/**
 * All bucket types as an array
 */
export const BUCKETS: Bucket[] = ['safety', 'growth', 'dream'];
