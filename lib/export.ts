/**
 * Export utilities for goals
 */

import { formatCurrency, type Goal, type Bucket } from '@/types';

/**
 * Calculate months until a target date
 */
function getMonthsUntil(targetDate: Date | string): number {
  const today = new Date();
  const target = new Date(targetDate);
  const months = (target.getFullYear() - today.getFullYear()) * 12 +
                 (target.getMonth() - today.getMonth());
  return Math.max(0, months);
}

/**
 * Format a date for display
 */
function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Group goals by bucket
 */
function groupByBucket(goals: Goal[]): Record<Bucket, Goal[]> {
  return goals.reduce((acc, goal) => {
    acc[goal.bucket].push(goal);
    return acc;
  }, { safety: [], growth: [], dream: [] } as Record<Bucket, Goal[]>);
}

/**
 * Format goals as plain text for clipboard
 */
export function formatGoalsAsText(goals: Goal[], locale: string = 'en'): string {
  if (goals.length === 0) {
    return locale === 'es'
      ? 'MIS METAS DE INVERSIÓN\n\nNo hay metas todavía.'
      : 'MY INVESTMENT GOALS\n\nNo goals yet.';
  }

  const lines: string[] = [];
  const today = new Date();
  const dateStr = today.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Header
  lines.push(locale === 'es' ? 'MIS METAS DE INVERSIÓN' : 'MY INVESTMENT GOALS');
  lines.push(`${locale === 'es' ? 'Generado' : 'Generated'}: ${dateStr}`);
  lines.push('');

  // Group by bucket
  const grouped = groupByBucket(goals);
  const bucketOrder: Bucket[] = ['safety', 'growth', 'dream'];
  const bucketNames: Record<string, Record<Bucket, string>> = {
    en: { safety: 'SAFETY', growth: 'GROWTH', dream: 'DREAM' },
    es: { safety: 'SEGURIDAD', growth: 'CRECIMIENTO', dream: 'SUEÑO' },
  };

  for (const bucket of bucketOrder) {
    const bucketGoals = grouped[bucket];
    if (bucketGoals.length === 0) continue;

    // Bucket header
    const bucketName = bucketNames[locale]?.[bucket] || bucketNames.en[bucket];
    lines.push(`━━━ ${bucketName} ━━━`);
    lines.push('');

    // Sort by priority
    const sorted = [...bucketGoals].sort((a, b) => a.priority - b.priority);

    for (const goal of sorted) {
      const monthsAway = getMonthsUntil(goal.targetDate);
      const timeAway = monthsAway === 1
        ? (locale === 'es' ? '1 mes' : '1 month')
        : (locale === 'es' ? `${monthsAway} meses` : `${monthsAway} months`);

      lines.push(`#${goal.priority} ${goal.title}`);
      lines.push(`${locale === 'es' ? 'Monto' : 'Amount'}: ${formatCurrency(goal.amount, goal.currency)}`);
      lines.push(`${locale === 'es' ? 'Fecha' : 'Target'}: ${formatDate(goal.targetDate)} (${timeAway} ${locale === 'es' ? 'restantes' : 'away'})`);
      if (goal.whyItMatters) {
        lines.push(`${locale === 'es' ? 'Por qué' : 'Why'}: ${goal.whyItMatters}`);
      }
      lines.push('');
    }
  }

  // Footer
  lines.push('---');
  const totalAmount = goals.reduce((sum, g) => sum + g.amount, 0);
  const currency = goals[0]?.currency || 'USD';
  const goalsWord = goals.length === 1
    ? (locale === 'es' ? 'meta' : 'goal')
    : (locale === 'es' ? 'metas' : 'goals');
  lines.push(`Total: ${goals.length} ${goalsWord} · ${formatCurrency(totalAmount, currency)}`);

  return lines.join('\n');
}

/**
 * Copy text to clipboard with fallback for older browsers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Modern Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Clipboard API failed:', err);
    }
  }

  // Fallback for older browsers
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err);
    return false;
  }
}
