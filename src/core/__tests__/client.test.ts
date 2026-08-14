import { SupportClient } from '../client';
import { SupportApiError, SupportNetworkError, isRetryable } from '../errors';

const mockFetch = jest.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

describe('SupportClient', () => {
  beforeEach(() => mockFetch.mockReset());

  const client = new SupportClient({
    apiKey: 'rns_pk_test_abc',
    apiUrl: 'https://api.example.com/', // trailing slash normalised away
  });

  it('bootstraps with the api key merged in and a normalised url', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse(200, {
        project: { id: 'p1', name: 'Demo', config: {} },
        mode: 'test',
        quota: { state: 'ok', used: 0, limit: 50 },
        serverTime: 'now',
      }),
    );
    const result = await client.bootstrap({ installId: 'inst_123456789' });
    expect(result.mode).toBe('test');

    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.example.com/api/v1/bootstrap');
    expect(JSON.parse(init.body as string)).toMatchObject({
      apiKey: 'rns_pk_test_abc',
      installId: 'inst_123456789',
    });
  });

  it('sends an Idempotency-Key on every message', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse(200, {
        conversationId: 'c1',
        message: { id: 'm1', role: 'assistant', content: 'hi', createdAt: 'now' },
      }),
    );
    await client.sendMessage({ conversationId: null, content: 'hello' });
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.example.com/api/v1/conversations/new/messages');
    const headers = init.headers as Record<string, string>;
    expect(headers['Idempotency-Key']).toBeTruthy();
  });

  it('reuses a caller-supplied idempotency key verbatim (retry semantics)', async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(200, {
        conversationId: 'c1',
        message: { id: 'm1', role: 'assistant', content: 'hi', createdAt: 'now' },
      }),
    );
    await client.sendMessage({ conversationId: 'c1', content: 'x', idempotencyKey: 'idem_fixed' });
    await client.sendMessage({ conversationId: 'c1', content: 'x', idempotencyKey: 'idem_fixed' });
    const keys = mockFetch.mock.calls.map(
      (c) => (c[1] as RequestInit).headers as Record<string, string>,
    );
    expect(keys[0]?.['Idempotency-Key']).toBe('idem_fixed');
    expect(keys[1]?.['Idempotency-Key']).toBe('idem_fixed');
  });

  it('surfaces API errors as typed SupportApiError with code and status', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse(401, { error: { code: 'invalid_key', message: 'API key not found.' } }),
    );
    const err = await client.bootstrap({ installId: 'inst_123456789' }).catch((e) => e);
    expect(err).toBeInstanceOf(SupportApiError);
    expect(err.status).toBe(401);
    expect(err.code).toBe('invalid_key');
    expect(isRetryable(err)).toBe(false);
  });

  it('wraps transport failures as retryable SupportNetworkError', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Network request failed'));
    const err = await client.bootstrap({ installId: 'inst_123456789' }).catch((e) => e);
    expect(err).toBeInstanceOf(SupportNetworkError);
    expect(isRetryable(err)).toBe(true);
  });

  it('treats 5xx and 429 as retryable', () => {
    expect(isRetryable(new SupportApiError(500, 'x', 'x'))).toBe(true);
    expect(isRetryable(new SupportApiError(429, 'x', 'x'))).toBe(true);
    expect(isRetryable(new SupportApiError(400, 'x', 'x'))).toBe(false);
  });
});
