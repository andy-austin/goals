'use client';

import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { hasGivenAnalyticsConsent } from '@/lib/consent';

export function ConditionalAnalytics() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    setAnalyticsEnabled(hasGivenAnalyticsConsent());
  }, []);

  if (!analyticsEnabled) return null;

  return <Analytics />;
}
