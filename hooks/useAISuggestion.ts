'use client';

import { useState, useCallback, useRef } from 'react';

export type SuggestionType = 'description' | 'amount' | 'bucket' | 'whyItMatters';

export interface SuggestionContext {
  title?: string;
  description?: string;
  amount?: number;
  currency?: string;
  targetDate?: string;
  bucket?: string;
}

export interface SuggestionResult {
  suggestion: string;
  reasoning?: string;
}

export interface UseAISuggestionOptions {
  /** Debounce delay in ms before triggering suggestion */
  debounceMs?: number;
  /** Minimum input length before suggesting */
  minInputLength?: number;
  /** Whether to auto-trigger on input change */
  autoTrigger?: boolean;
}

export interface UseAISuggestionReturn {
  /** The current suggestion text */
  suggestion: string | null;
  /** Additional reasoning for the suggestion (if available) */
  reasoning: string | null;
  /** Whether a suggestion is being generated */
  isLoading: boolean;
  /** Error message if generation failed */
  error: string | null;
  /** Manually trigger a suggestion */
  getSuggestion: (input: string, context?: SuggestionContext) => Promise<void>;
  /** Clear the current suggestion */
  clearSuggestion: () => void;
  /** Retry the last suggestion request */
  retry: () => Promise<void>;
}

/**
 * Hook for fetching AI-powered suggestions from the Claude API.
 *
 * @param type - The type of suggestion to generate
 * @param options - Configuration options
 * @returns Suggestion state and control functions
 *
 * @example
 * ```tsx
 * const { suggestion, isLoading, error, getSuggestion, clearSuggestion, retry } = useAISuggestion('description');
 *
 * // Trigger suggestion manually
 * getSuggestion(description, { title });
 *
 * // Use with AISuggestionChip
 * <AISuggestionChip
 *   suggestion={suggestion}
 *   isLoading={isLoading}
 *   error={error}
 *   onAccept={(text) => setDescription(text)}
 *   onDismiss={clearSuggestion}
 *   onRetry={retry}
 * />
 * ```
 */
export function useAISuggestion(
  type: SuggestionType,
  options: UseAISuggestionOptions = {}
): UseAISuggestionReturn {
  const { minInputLength = 3 } = options;

  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store last request for retry functionality
  const lastRequestRef = useRef<{ input: string; context?: SuggestionContext } | null>(null);

  const getSuggestion = useCallback(
    async (input: string, context?: SuggestionContext) => {
      // Store request for retry
      lastRequestRef.current = { input, context };

      // Skip if input is too short
      if (input.length < minInputLength) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ai/suggest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            input,
            context,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to generate suggestion');
        }

        const data: SuggestionResult = await response.json();
        setSuggestion(data.suggestion);
        setReasoning(data.reasoning || null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate suggestion';
        setError(message);
        setSuggestion(null);
        setReasoning(null);
      } finally {
        setIsLoading(false);
      }
    },
    [type, minInputLength]
  );

  const clearSuggestion = useCallback(() => {
    setSuggestion(null);
    setReasoning(null);
    setError(null);
  }, []);

  const retry = useCallback(async () => {
    if (lastRequestRef.current) {
      await getSuggestion(lastRequestRef.current.input, lastRequestRef.current.context);
    }
  }, [getSuggestion]);

  return {
    suggestion,
    reasoning,
    isLoading,
    error,
    getSuggestion,
    clearSuggestion,
    retry,
  };
}
