import { forwardRef, type HTMLAttributes } from 'react';
import type { Bucket } from '@/types';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'bucket';
  bucket?: Bucket;
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', bucket, size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium';

    const sizes = {
      sm: 'px-2 py-0.5 text-xs rounded',
      md: 'px-2.5 py-1 text-xs rounded-md',
    };

    const variants = {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground border border-border',
      success: 'bg-success/10 text-success border border-success/20',
      warning: 'bg-warning/10 text-warning border border-warning/20',
      error: 'bg-error/10 text-error border border-error/20',
      bucket: '', // Will be handled separately
    };

    const bucketStyles: Record<Bucket, string> = {
      safety: 'bg-bucket-safety-light text-bucket-safety-dark border border-bucket-safety/30',
      growth: 'bg-bucket-growth-light text-bucket-growth-dark border border-bucket-growth/30',
      dream: 'bg-bucket-dream-light text-bucket-dream-dark border border-bucket-dream/30',
    };

    const variantStyle = variant === 'bucket' && bucket ? bucketStyles[bucket] : variants[variant];

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${sizes[size]} ${variantStyle} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

/**
 * BucketBadge - Convenience component for bucket badges with icon
 */
export interface BucketBadgeProps extends Omit<BadgeProps, 'variant' | 'bucket'> {
  bucket: Bucket;
  showIcon?: boolean;
}

const BucketIcons: Record<Bucket, React.ReactNode> = {
  safety: (
    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  growth: (
    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  dream: (
    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
};

const BucketLabels: Record<Bucket, string> = {
  safety: 'Safety',
  growth: 'Growth',
  dream: 'Dream',
};

export const BucketBadge = forwardRef<HTMLSpanElement, BucketBadgeProps>(
  ({ bucket, showIcon = true, children, ...props }, ref) => {
    return (
      <Badge ref={ref} variant="bucket" bucket={bucket} {...props}>
        {showIcon && BucketIcons[bucket]}
        {children ?? BucketLabels[bucket]}
      </Badge>
    );
  }
);

BucketBadge.displayName = 'BucketBadge';
