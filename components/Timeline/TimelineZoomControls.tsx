'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { useTranslations } from 'next-intl';
import { type TimelineZoomControlsProps, type ZoomLevel } from './timeline.types';

export interface ZoomControlsProps
  extends TimelineZoomControlsProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {}

const ZOOM_ORDER: ZoomLevel[] = ['all', '1year', '5years', '10years'];

/**
 * Button group for selecting timeline zoom level
 */
export const TimelineZoomControls = forwardRef<HTMLDivElement, ZoomControlsProps>(
  ({ currentLevel, onChange, className = '', ...props }, ref) => {
    const t = useTranslations('timeline.zoom');

    return (
      <div
        ref={ref}
        className={`inline-flex rounded-lg border border-border bg-background p-1 ${className}`}
        role="group"
        aria-label={t('label')}
        {...props}
      >
        {ZOOM_ORDER.map((level) => {
          const isActive = level === currentLevel;

          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              className={`
                rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
              aria-pressed={isActive}
            >
              {t(level)}
            </button>
          );
        })}
      </div>
    );
  }
);

TimelineZoomControls.displayName = 'TimelineZoomControls';
