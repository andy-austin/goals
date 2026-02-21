/**
 * Consent types for personal data privacy compliance
 */

export const POLICY_VERSION = '1.0.0';

export interface ConsentRecord {
  given: boolean;
  timestamp: string; // ISO 8601
  policyVersion: string; // Tracks which version of the policy the user consented to
  analyticsConsent: boolean;
}
