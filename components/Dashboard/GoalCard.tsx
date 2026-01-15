'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, BucketBadge } from '@/components/ui';
import { Goal, formatCurrency } from '@/types';

interface GoalCardProps {
  goal: Goal;
  className?: string;
}

export function GoalCard({ goal, className = '' }: GoalCardProps) {
  const t = useTranslations('dashboard.goalCard'); // Will need to add if missing, or use existing keys
  
  // Calculate days remaining (simple version, could move to helper)
  const today = new Date();
  const target = new Date(goal.targetDate);
  const diffTime = target.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const isOverdue = daysRemaining < 0;

  return (
    <div className={`group relative rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {goal.title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatCurrency(goal.amount, goal.currency)}
          </p>
        </div>
        
        {/* Priority Badge or Indicator */}
        <div className="flex items-center gap-2">
           <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
             #{goal.priority}
           </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-xs">
          <span className={`${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-zinc-500'}`}>
            {isOverdue 
              ? `Overdue by ${Math.abs(daysRemaining)} days` 
              : `${daysRemaining} days left`}
          </span>
        </div>
        <div className="text-xs text-zinc-400">
          {new Date(goal.targetDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
