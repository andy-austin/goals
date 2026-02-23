/**
 * Integration tests for POST /api/ai/suggest
 *
 * Strategy: vi.resetModules() + vi.doMock() + dynamic import lets us control
 * environment variables and SDK behaviour per test without the module-level
 * initialisation locking us out.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import type { SuggestionType } from './route';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/ai/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// Build a re-usable mock for the Anthropic SDK
function buildAnthropicMock(createImpl: () => object) {
  class MockAPIError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.name = 'APIError';
      this.status = status;
    }
  }

  return {
    default: class MockAnthropic {
      messages = { create: vi.fn(createImpl) };
      static APIError = MockAPIError;
    },
    APIError: MockAPIError,
  };
}

// ---------------------------------------------------------------------------
// Each test re-imports the route with fresh env + mocks
// ---------------------------------------------------------------------------

async function importRoute(anthropicMock: object) {
  vi.resetModules();
  process.env.ANTHROPIC_API_KEY = 'test-key';
  vi.doMock('@anthropic-ai/sdk', () => anthropicMock);
  vi.doMock('@google/generative-ai', () => ({ GoogleGenerativeAI: class {} }));
  const { POST } = await import('./route');
  return POST;
}

afterEach(() => {
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.AI_PROVIDER;
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// 503 when no API key is configured
// ---------------------------------------------------------------------------

describe('503 – provider not configured', () => {
  beforeEach(() => {
    vi.resetModules();
    // Ensure keys are absent
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GEMINI_API_KEY;
    vi.doMock('@anthropic-ai/sdk', () => buildAnthropicMock(() => ({})));
    vi.doMock('@google/generative-ai', () => ({ GoogleGenerativeAI: class {} }));
  });

  it('returns 503 with a descriptive error', async () => {
    const { POST } = await import('./route');
    const res = await POST(makeRequest({ type: 'description', input: 'test' }));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toMatch(/not configured/i);
  });
});

// ---------------------------------------------------------------------------
// 400 – invalid request type
// ---------------------------------------------------------------------------

describe('400 – invalid type', () => {
  it('returns 400 for an unknown suggestion type', async () => {
    const POST = await importRoute(buildAnthropicMock(() => ({
      content: [{ type: 'text', text: 'irrelevant' }],
    })));
    const res = await POST(makeRequest({ type: 'not-a-valid-type', input: 'test' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid suggestion type/i);
  });

  it('returns 400 when type is missing', async () => {
    const POST = await importRoute(buildAnthropicMock(() => ({
      content: [{ type: 'text', text: 'irrelevant' }],
    })));
    const res = await POST(makeRequest({ input: 'test' }));
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// Response parsing: 'description' and 'whyItMatters'
// ---------------------------------------------------------------------------

describe('response parsing – description / whyItMatters', () => {
  const types: SuggestionType[] = ['description', 'whyItMatters'];

  for (const type of types) {
    it(`returns trimmed text for "${type}" type`, async () => {
      const POST = await importRoute(buildAnthropicMock(() => ({
        content: [{ type: 'text', text: '  Save 3 months of expenses.  ' }],
      })));
      const res = await POST(makeRequest({ type, input: 'emergency fund' }));
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.suggestion).toBe('Save 3 months of expenses.');
    });
  }
});

// ---------------------------------------------------------------------------
// Response parsing: 'amount'
// ---------------------------------------------------------------------------

describe('response parsing – amount', () => {
  it('extracts AMOUNT and REASONING from a well-formed response', async () => {
    const POST = await importRoute(buildAnthropicMock(() => ({
      content: [{ type: 'text', text: 'AMOUNT: 25000\nREASONING: 3-6 months of expenses.' }],
    })));
    const res = await POST(makeRequest({ type: 'amount', input: 'emergency fund' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.suggestion).toBe('25000');
    expect(body.reasoning).toBe('3-6 months of expenses.');
  });

  it('falls back to raw text when AMOUNT pattern is absent', async () => {
    const POST = await importRoute(buildAnthropicMock(() => ({
      content: [{ type: 'text', text: 'about twenty-five thousand' }],
    })));
    const res = await POST(makeRequest({ type: 'amount', input: 'test' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.suggestion).toBe('about twenty-five thousand');
  });
});

// ---------------------------------------------------------------------------
// Response parsing: 'bucket'
// ---------------------------------------------------------------------------

describe('response parsing – bucket', () => {
  it('extracts and lowercases the BUCKET value', async () => {
    const POST = await importRoute(buildAnthropicMock(() => ({
      content: [{ type: 'text', text: 'BUCKET: Safety\nREASONING: Emergency fund.' }],
    })));
    const res = await POST(makeRequest({ type: 'bucket', input: 'emergency fund' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.suggestion).toBe('safety');
    expect(body.reasoning).toBe('Emergency fund.');
  });

  it('accepts all three valid bucket values case-insensitively', async () => {
    for (const rawBucket of ['SAFETY', 'Growth', 'DREAM']) {
      const POST = await importRoute(buildAnthropicMock(() => ({
        content: [{ type: 'text', text: `BUCKET: ${rawBucket}\nREASONING: Test.` }],
      })));
      const res = await POST(makeRequest({ type: 'bucket', input: 'test' }));
      const body = await res.json();
      expect(body.suggestion).toBe(rawBucket.toLowerCase());
    }
  });

  it('falls back to raw text when BUCKET pattern is absent', async () => {
    const POST = await importRoute(buildAnthropicMock(() => ({
      content: [{ type: 'text', text: 'probably safety' }],
    })));
    const res = await POST(makeRequest({ type: 'bucket', input: 'test' }));
    const body = await res.json();
    expect(body.suggestion).toBe('probably safety');
  });
});

// ---------------------------------------------------------------------------
// Response parsing: 'convert'
// ---------------------------------------------------------------------------

describe('response parsing – convert', () => {
  it('extracts TOTAL and strips commas from the number', async () => {
    const POST = await importRoute(buildAnthropicMock(() => ({
      content: [{ type: 'text', text: 'TOTAL: 1,234.56\nREASONING: EUR/USD rate ~1.09.' }],
    })));
    const res = await POST(makeRequest({ type: 'convert', input: '1000 EUR', context: { currency: 'USD' } }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.suggestion).toBe('1234.56');
    expect(body.reasoning).toContain('EUR/USD');
  });

  it('falls back to raw text when TOTAL pattern is absent', async () => {
    const POST = await importRoute(buildAnthropicMock(() => ({
      content: [{ type: 'text', text: 'approximately 1200' }],
    })));
    const res = await POST(makeRequest({ type: 'convert', input: 'test' }));
    const body = await res.json();
    expect(body.suggestion).toBe('approximately 1200');
  });
});

// ---------------------------------------------------------------------------
// Error handling: Anthropic API errors
// ---------------------------------------------------------------------------

describe('error handling – Anthropic API errors', () => {
  it('returns 401 for an Anthropic 401 error', async () => {
    const mock = buildAnthropicMock(() => { throw new Error('unused'); });
    vi.resetModules();
    process.env.ANTHROPIC_API_KEY = 'bad-key';

    const apiError = new mock.APIError('Invalid API key', 401);
    vi.doMock('@anthropic-ai/sdk', () => ({
      ...mock,
      default: class {
        messages = {
          create: vi.fn(() => { throw apiError; }),
        };
        static APIError = mock.APIError;
      },
    }));
    vi.doMock('@google/generative-ai', () => ({ GoogleGenerativeAI: class {} }));

    const { POST } = await import('./route');
    const res = await POST(makeRequest({ type: 'description', input: 'test' }));
    expect(res.status).toBe(401);
  });

  it('returns 429 for an Anthropic 429 error', async () => {
    const mock = buildAnthropicMock(() => { throw new Error('unused'); });
    vi.resetModules();
    process.env.ANTHROPIC_API_KEY = 'real-key';

    const apiError = new mock.APIError('Rate limit', 429);
    vi.doMock('@anthropic-ai/sdk', () => ({
      ...mock,
      default: class {
        messages = {
          create: vi.fn(() => { throw apiError; }),
        };
        static APIError = mock.APIError;
      },
    }));
    vi.doMock('@google/generative-ai', () => ({ GoogleGenerativeAI: class {} }));

    const { POST } = await import('./route');
    const res = await POST(makeRequest({ type: 'description', input: 'test' }));
    expect(res.status).toBe(429);
  });

  it('returns 500 for an unexpected error', async () => {
    const POST = await importRoute(buildAnthropicMock(() => {
      throw new Error('Network timeout');
    }));
    const res = await POST(makeRequest({ type: 'description', input: 'test' }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/failed to generate/i);
  });
});
