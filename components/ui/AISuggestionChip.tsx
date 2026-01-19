'use client';

import { forwardRef, useState, type HTMLAttributes } from 'react';

export interface AISuggestionChipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The suggestion text to display. Null means no suggestion yet. */
  suggestion: string | null;
  /** Whether the AI is currently generating a suggestion. */
  isLoading: boolean;
  /** Error message if the AI failed to generate a suggestion. */
  error?: string;
  /** Callback when user accepts the suggestion. */
  onAccept: (suggestion: string) => void;
  /** Callback when user dismisses the suggestion. */
  onDismiss: () => void;
  /** Callback when user wants to retry after an error. */
  onRetry?: () => void;
  /** Label for the accept button. */
  acceptLabel?: string;
  /** Label for the dismiss button. */
  dismissLabel?: string;
  /** Label for the retry button. */
  retryLabel?: string;
}

/**
 * AI icon - sparkles/magic wand style
 */
const AIIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
    />
  </svg>
);

/**
 * Check icon for accept button
 */
const CheckIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

/**
 * X icon for dismiss button
 */
const XIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * Refresh/retry icon
 */
const RefreshIcon = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

/**
 * AISuggestionChip - A reusable component for displaying AI-generated suggestions
 * throughout the goal creation form.
 *
 * Features:
 * - Loading state with pulse animation
 * - Ready state with suggestion text and accept/dismiss buttons
 * - Error state with retry option
 * - Smooth entrance/exit animations
 * - Full keyboard accessibility
 */
export const AISuggestionChip = forwardRef<HTMLDivElement, AISuggestionChipProps>(
  (
    {
      suggestion,
      isLoading,
      error,
      onAccept,
      onDismiss,
      onRetry,
      acceptLabel = 'Use this',
      dismissLabel = 'Dismiss',
      retryLabel = 'Retry',
      className = '',
      ...props
    },
    ref
  ) => {
    // Track exit animation state
    const [isExiting, setIsExiting] = useState(false);

    // Derive visibility from props - component is visible when there's content
    const hasContent = isLoading || suggestion || error;

    // Handle dismiss with exit animation
    const handleDismiss = () => {
      setIsExiting(true);
      // Wait for animation to complete before calling onDismiss
      setTimeout(() => {
        setIsExiting(false);
        onDismiss();
      }, 200);
    };

    // Handle accept
    const handleAccept = () => {
      if (suggestion) {
        onAccept(suggestion);
        handleDismiss();
      }
    };

    // Don't render if no content
    if (!hasContent) {
      return null;
    }

    const baseStyles = `
      relative overflow-hidden rounded-lg border
      transition-all duration-200 ease-out
      ${isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
    `;

    // Loading state
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={`${baseStyles} bg-info/5 border-info/20 p-4 ${className}`}
          role="status"
          aria-label="AI is generating a suggestion"
          {...props}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-1.5 rounded-md bg-info/10">
              <AIIcon className="w-4 h-4 text-info animate-pulse" />
            </div>
            <div className="flex-1 space-y-2">
              {/* Skeleton lines */}
              <div className="h-4 bg-info/10 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-info/10 rounded animate-pulse w-1/2" />
            </div>
          </div>
          {/* Screen reader text */}
          <span className="sr-only">AI is generating a suggestion, please wait...</span>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div
          ref={ref}
          className={`${baseStyles} bg-error/5 border-error/20 p-4 ${className}`}
          role="alert"
          {...props}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-1.5 rounded-md bg-error/10">
              <AIIcon className="w-4 h-4 text-error" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-error font-medium">Unable to generate suggestion</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-error hover:bg-error/10 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={retryLabel}
                >
                  <RefreshIcon className="w-4 h-4" />
                  {retryLabel}
                </button>
              )}
              <button
                type="button"
                onClick={handleDismiss}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={dismissLabel}
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Ready state with suggestion
    if (suggestion) {
      return (
        <div
          ref={ref}
          className={`${baseStyles} bg-info/5 border-info/20 p-4 ${className}`}
          role="region"
          aria-label="AI suggestion"
          {...props}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-1.5 rounded-md bg-info/10">
              <AIIcon className="w-4 h-4 text-info" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-info mb-1">AI Suggestion</p>
              <p className="text-sm text-foreground">{suggestion}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-info/10">
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <XIcon className="w-4 h-4" />
              {dismissLabel}
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-info-foreground bg-info hover:bg-info/90 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <CheckIcon className="w-4 h-4" />
              {acceptLabel}
            </button>
          </div>
        </div>
      );
    }

    // No state to display
    return null;
  }
);

AISuggestionChip.displayName = 'AISuggestionChip';
