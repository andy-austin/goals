'use client';

import * as React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function Tooltip({ content, children, side = 'bottom', align = 'center', className = '' }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  // Helper to determine horizontal positioning classes based on alignment
  const getHorizontalPosition = () => {
    if (side === 'left' || side === 'right') return ''; // Side positioning handles this
    
    switch (align) {
      case 'start': return 'left-0';
      case 'end': return 'right-0';
      case 'center': 
      default: return 'left-1/2 -translate-x-1/2';
    }
  };

  return (
    <span 
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <span className={`
          absolute z-50 whitespace-normal rounded border px-2 py-1 text-xs shadow-md
          bg-background text-foreground border-border max-w-[200px] w-max text-left
          ${side === 'top' ? `bottom-full mb-2 ${getHorizontalPosition()}` : ''}
          ${side === 'bottom' ? `top-full mt-2 ${getHorizontalPosition()}` : ''}
          ${side === 'left' ? 'right-full mr-2 top-1/2 -translate-y-1/2' : ''}
          ${side === 'right' ? 'left-full ml-2 top-1/2 -translate-y-1/2' : ''}
        `}
        role="tooltip"
        >
          {content}
          {/* Arrow */}
          <span className={`
            absolute h-0 w-0 border-4
            ${side === 'top' ? `top-full border-t-border border-x-transparent border-b-transparent ${align === 'start' ? 'left-2' : align === 'end' ? 'right-2' : 'left-1/2 -translate-x-1/2'}` : ''}
            ${side === 'bottom' ? `bottom-full border-b-border border-x-transparent border-t-transparent ${align === 'start' ? 'left-2' : align === 'end' ? 'right-2' : 'left-1/2 -translate-x-1/2'}` : ''}
            ${side === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-border border-y-transparent border-r-transparent' : ''}
            ${side === 'right' ? 'right-full top-1/2 -translate-y-1/2 border-r-border border-y-transparent border-l-transparent' : ''}
          `} />
          <span className={`
            absolute h-0 w-0 border-[3px]
            ${side === 'top' ? `top-full -mt-[1px] border-t-background border-x-transparent border-b-transparent ${align === 'start' ? 'left-2' : align === 'end' ? 'right-2' : 'left-1/2 -translate-x-1/2'}` : ''}
            ${side === 'bottom' ? `bottom-full -mb-[1px] border-b-background border-x-transparent border-t-transparent ${align === 'start' ? 'left-2' : align === 'end' ? 'right-2' : 'left-1/2 -translate-x-1/2'}` : ''}
            ${side === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-[1px] border-l-background border-y-transparent border-r-transparent' : ''}
            ${side === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-[1px] border-r-background border-y-transparent border-l-transparent' : ''}
          `} />
        </span>
      )}
    </span>
  );
}
