import { ConsentRecord, POLICY_VERSION } from '@/types/consent';

const CONSENT_KEY = 'fingoal_consent';

export function getConsent(): ConsentRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentRecord;
  } catch {
    return null;
  }
}

export function saveConsent(record: ConsentRecord): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
}

export function hasGivenConsent(): boolean {
  const record = getConsent();
  return record !== null && record.given;
}

export function hasGivenAnalyticsConsent(): boolean {
  const record = getConsent();
  return record !== null && record.analyticsConsent;
}

export function revokeConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_KEY);
}

export function buildConsentRecord(analyticsConsent: boolean): ConsentRecord {
  return {
    given: true,
    timestamp: new Date().toISOString(),
    policyVersion: POLICY_VERSION,
    analyticsConsent,
  };
}
