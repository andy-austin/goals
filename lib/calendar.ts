import type { Goal } from '@/types';
import { formatCurrency } from '@/types';

type ReminderFrequency = 'weekly' | 'biweekly' | 'monthly';

interface CalendarExportOptions {
  frequency: ReminderFrequency;
  goalTitle: string;
  goalAmount: number;
  goalCurrency: Goal['currency'];
  targetDate: Date;
  monthlySavings?: number | null;
}

function formatICSDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T090000`;
}

function escapeICS(text: string): string {
  return text.replace(/[\\;,\n]/g, (match) => {
    if (match === '\n') return '\\n';
    return `\\${match}`;
  });
}

function getRRule(frequency: ReminderFrequency, until: string): string {
  switch (frequency) {
    case 'weekly':
      return `RRULE:FREQ=WEEKLY;UNTIL=${until}`;
    case 'biweekly':
      return `RRULE:FREQ=WEEKLY;INTERVAL=2;UNTIL=${until}`;
    case 'monthly':
      return `RRULE:FREQ=MONTHLY;UNTIL=${until}`;
  }
}

export function generateICS(options: CalendarExportOptions): string {
  const { frequency, goalTitle, goalAmount, goalCurrency, targetDate, monthlySavings } = options;

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const dtStart = formatICSDate(startDate);
  const dtEnd = formatICSDate(targetDate);
  const uid = `fingoal-${Date.now()}-${Math.random().toString(36).slice(2)}@fingoal.app`;

  const target = formatCurrency(goalAmount, goalCurrency);
  let description = `Review your savings progress for: ${goalTitle}\\nTarget: ${target}`;
  if (monthlySavings && monthlySavings > 0) {
    description += `\\nMonthly savings needed: ${formatCurrency(monthlySavings, goalCurrency)}`;
  }

  const summary = escapeICS(`Save for: ${goalTitle}`);
  const rrule = getRRule(frequency, dtEnd);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FinGoal//Goals//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${dtStart}`,
    'DURATION:PT30M',
    rrule,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Time to review savings for ${escapeICS(goalTitle)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICS(icsContent: string, filename: string): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
