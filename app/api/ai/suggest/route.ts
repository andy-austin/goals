import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// Provider Configuration
// =============================================================================

type AIProvider = 'anthropic' | 'gemini';

// Get configured provider from environment, or auto-detect based on available keys
let configuredProvider = (process.env.AI_PROVIDER?.toLowerCase() as AIProvider | undefined);

if (!configuredProvider) {
  if (process.env.ANTHROPIC_API_KEY) {
    configuredProvider = 'anthropic';
  } else if (process.env.GEMINI_API_KEY) {
    configuredProvider = 'gemini';
  } else {
    configuredProvider = 'anthropic'; // Default to anthropic if neither is found
  }
}

const AI_PROVIDER = configuredProvider;

// Initialize Anthropic client
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// Initialize Gemini client
const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Check if the configured provider is available
function isProviderAvailable(): boolean {
  if (AI_PROVIDER === 'gemini') {
    return !!gemini;
  }
  return !!anthropic;
}

function getMissingEnvVar(): string {
  return AI_PROVIDER === 'gemini' ? 'GEMINI_API_KEY' : 'ANTHROPIC_API_KEY';
}

// =============================================================================
// Types
// =============================================================================

export type SuggestionType = 'description' | 'amount' | 'bucket' | 'whyItMatters' | 'convert';

interface SuggestRequest {
  type: SuggestionType;
  input: string;
  context?: {
    title?: string;
    description?: string;
    amount?: number;
    currency?: string;
    targetDate?: string;
    bucket?: string;
  };
}

interface SuggestResponse {
  suggestion: string;
  reasoning?: string;
}

// =============================================================================
// Prompt Templates
// =============================================================================

const PROMPTS: Record<SuggestionType, (input: string, context?: SuggestRequest['context']) => string> = {
  description: (input, context) => `You are a financial goal setting assistant. Transform vague goal descriptions into specific, actionable, SMART-compliant goals.

User's goal title: ${context?.title || 'Not provided'}
User's description: ${input}

Create a more specific description that:
1. Is clear and actionable
2. Includes specific details when possible
3. Maintains the user's original intent
4. Is appropriate for a financial/investment goal
5. Is 1-3 sentences long

Respond with ONLY the improved description, no explanation or quotes.`,

  amount: (input, context) => `You are a financial goal setting assistant. Suggest a realistic target amount for financial goals.

Goal title: ${context?.title || 'Not provided'}
Goal description: ${context?.description || input}
Currency: ${context?.currency || 'USD'}

Based on common financial benchmarks and typical costs, suggest a realistic target amount range.

Respond in this exact format:
AMOUNT: [single suggested amount as a number, no currency symbol]
REASONING: [brief 1-sentence explanation]

For example:
AMOUNT: 25000
REASONING: Average emergency fund recommendation is 3-6 months of expenses.`,

  bucket: (input, context) => `You are a financial goal setting assistant. Classify goals into buckets based on the 3 Buckets methodology:

- Safety: Essential, urgent goals like emergency funds, insurance deductibles, job loss buffers
- Growth: Goals that improve standard of living like house down payment, car, wedding, education
- Dream: Aspirational goals you can afford to risk like luxury vacations, sabbatical, starting a business

Goal title: ${context?.title || 'Not provided'}
Goal description: ${context?.description || input}
Target amount: ${context?.amount ? `${context.currency || 'USD'} ${context.amount}` : 'Not specified'}
Timeline: ${context?.targetDate || 'Not specified'}

Respond in this exact format:
BUCKET: [safety OR growth OR dream]
REASONING: [brief 1-sentence explanation]`,

  whyItMatters: (input, context) => `You are a financial goal setting assistant. Create an emotionally resonant "why it matters" statement that will motivate someone to stick to their savings goal.

Goal title: ${context?.title || 'Not provided'}
Goal description: ${context?.description || 'Not provided'}
Target amount: ${context?.amount ? `${context.currency || 'USD'} ${context.amount}` : 'Not specified'}
Bucket type: ${context?.bucket || 'Not specified'}
User's initial motivation (if any): ${input || 'Not provided'}

Create a personalized, emotionally compelling statement (1-2 sentences) that:
1. Connects to deeper personal values
2. Creates an emotional anchor
3. Will help them stay committed when saving gets difficult
4. Feels personal, not generic

Respond with ONLY the motivation statement, no explanation or quotes.`,

  convert: (input, context) => `You are a financial assistant. Calculate the total sum of the provided amounts in ${context?.currency || 'USD'}.

Amounts to convert and sum:
${input}

Target Currency: ${context?.currency || 'USD'}

Use approximate current market exchange rates.

Respond in this exact format:
TOTAL: [number, no currency symbol, round to 2 decimals]
REASONING: [brief explanation of rates used]`,
};

// =============================================================================
// Provider-specific API calls
// =============================================================================

async function callAnthropic(prompt: string): Promise<string> {
  if (!anthropic) {
    throw new Error('Anthropic client not initialized');
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

async function callGemini(prompt: string): Promise<string> {
  if (!gemini) {
    throw new Error('Gemini client not initialized');
  }

  const model = gemini.getGenerativeModel({ model: 'gemini-3-flash-preview' });
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

async function generateSuggestion(prompt: string): Promise<string> {
  if (AI_PROVIDER === 'gemini') {
    return callGemini(prompt);
  }
  return callAnthropic(prompt);
}

// =============================================================================
// API Route Handler
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // Check if provider is configured
    if (!isProviderAvailable()) {
      return NextResponse.json(
        { error: `AI service not configured. Please set ${getMissingEnvVar()}.` },
        { status: 503 }
      );
    }

    const body: SuggestRequest = await request.json();
    const { type, input, context } = body;

    // Validate request
    if (!type || !PROMPTS[type]) {
      return NextResponse.json(
        { error: 'Invalid suggestion type' },
        { status: 400 }
      );
    }

    // Generate prompt
    const prompt = PROMPTS[type](input, context);

    // Call the configured AI provider
    const responseText = await generateSuggestion(prompt);

    // Parse response based on type
    let response: SuggestResponse;

    if (type === 'amount') {
      const amountMatch = responseText.match(/AMOUNT:\s*(\d+)/);
      const reasoningMatch = responseText.match(/REASONING:\s*(.+)/);
      response = {
        suggestion: amountMatch ? amountMatch[1] : responseText,
        reasoning: reasoningMatch ? reasoningMatch[1].trim() : undefined,
      };
    } else if (type === 'bucket') {
      const bucketMatch = responseText.match(/BUCKET:\s*(safety|growth|dream)/i);
      const reasoningMatch = responseText.match(/REASONING:\s*(.+)/);
      response = {
        suggestion: bucketMatch ? bucketMatch[1].toLowerCase() : responseText,
        reasoning: reasoningMatch ? reasoningMatch[1].trim() : undefined,
      };
    } else if (type === 'convert') {
      const totalMatch = responseText.match(/TOTAL:\s*([\d\.,]+)/);
      const reasoningMatch = responseText.match(/REASONING:\s*(.+)/);
      // Clean up the number (remove commas if present)
      const cleanTotal = totalMatch ? totalMatch[1].replace(/,/g, '') : responseText;
      response = {
        suggestion: cleanTotal,
        reasoning: reasoningMatch ? reasoningMatch[1].trim() : undefined,
      };
    } else {
      response = {
        suggestion: responseText.trim(),
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('AI suggestion error:', error);

    // Handle specific Anthropic errors
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    // Handle Gemini errors (they throw regular errors with messages)
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('rate')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate suggestion. Please try again.' },
      { status: 500 }
    );
  }
}
