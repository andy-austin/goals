'use client';

import * as React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ content, children, side = 'bottom', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div 
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`
          absolute z-50 whitespace-nowrap rounded border px-2 py-1 text-xs shadow-md
          bg-background text-foreground border-border
          ${side === 'top' ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : ''}
          ${side === 'bottom' ? 'top-full mt-2 left-1/2 -translate-x-1/2' : ''}
          ${side === 'left' ? 'right-full mr-2 top-1/2 -translate-y-1/2' : ''}
          ${side === 'right' ? 'left-full ml-2 top-1/2 -translate-y-1/2' : ''}
        `}
        role="tooltip"
        >
          {content}
          {/* Arrow */}
          <div className={`
            absolute h-0 w-0 border-4
            ${side === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-border border-x-transparent border-b-transparent' : ''}
            ${side === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-border border-x-transparent border-t-transparent' : ''}
            ${side === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-border border-y-transparent border-r-transparent' : ''}
            ${side === 'right' ? 'right-full top-1/2 -translate-y-1/2 border-r-border border-y-transparent border-l-transparent' : ''}
          `} />
          <div className={`
            absolute h-0 w-0 border-[3px]
            ${side === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-[1px] border-t-background border-x-transparent border-b-transparent' : ''}
            ${side === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-[1px] border-b-background border-x-transparent border-t-transparent' : ''}
            ${side === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-[1px] border-l-background border-y-transparent border-r-transparent' : ''}
            ${side === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-[1px] border-r-background border-y-transparent border-l-transparent' : ''}
          `} />
        </div>
      )}
    </div>
  );
}
