import { SupportApiError, SupportNetworkError } from './errors';
import { generateId } from './ids';
import { postSse, sseAvailable } from './sse';
import type {
  ApiErrorBody,
  BootstrapRequest,
  BootstrapResponse,
  Message,
  SupportConfig,
} from './types';

/**
 * HTTP client for the platform wire protocol.
 *
 * Pure TypeScript on global fetch — no React, no React Native imports, so it
 * runs under Node for tests and is reusable for future non-RN SDKs. Streaming
 * uses SSE over XHR (see sse.ts) and degrades to the blocking request where
 * XHR is unavailable.
 */

const DEFAULT_TIMEOUT_MS = 30_000;

export interface SendMessageInput {
  conversationId: string | null;
  content: string;
  /** Stable install id — identifies the end user when a conversation is created. */
  installId: string;
  /** Generated once per user message; reused verbatim on retry (idempotency). */
  idempotencyKey?: string;
}

export interface SendMessageResult {
  conversationId: string;
  message: Message;
}

export class SupportClient {
  private readonly config: SupportConfig;
  /** Short-lived credential from bootstrap; preferred over the raw key. */
  private sessionToken: string | null = null;
  private lastBootstrapInput: Omit<BootstrapRequest, 'apiKey'> | null = null;

  constructor(config: SupportConfig) {
    this.config = { ...config, apiUrl: config.apiUrl.replace(/\/+$/, '') };
  }

  async bootstrap(input: Omit<BootstrapRequest, 'apiKey'>): Promise<BootstrapResponse> {
    const response = await this.post<BootstrapResponse>('/api/v1/bootstrap', {
      ...input,
      apiKey: this.config.apiKey,
    });
    this.lastBootstrapInput = input;
    this.sessionToken = response.session?.token ?? null;
    return response;
  }

  private authHeader(): Record<string, string> {
    return { Authorization: `Bearer ${this.sessionToken ?? this.config.apiKey}` };
  }

  /**
   * Session tokens expire; a 401 that names the session is healed with one
   * silent re-bootstrap and a retry. Any other failure passes through.
   */
  private async withSessionRetry<T>(run: () => Promise<T>): Promise<T> {
    try {
      return await run();
    } catch (cause) {
      const sessionDied =
        cause instanceof SupportApiError &&
        cause.status === 401 &&
        (cause.code === 'session_expired' || cause.code === 'invalid_token');
      if (!sessionDied || !this.lastBootstrapInput) throw cause;
      this.sessionToken = null;
      await this.bootstrap(this.lastBootstrapInput);
      return run();
    }
  }

  async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    const conversationId = input.conversationId ?? 'new';
    const idempotencyKey = input.idempotencyKey ?? generateId('idem_');
    return this.withSessionRetry(() =>
      this.post<SendMessageResult>(
        `/api/v1/conversations/${encodeURIComponent(conversationId)}/messages`,
        { content: input.content, installId: input.installId },
        { 'Idempotency-Key': idempotencyKey, ...this.authHeader() },
      ),
    );
  }

  /**
   * Streaming send: onDelta fires per text fragment as the assistant writes,
   * and the resolved result is identical to sendMessage. Falls back to the
   * blocking request (one onDelta with the full text) where XHR streaming is
   * unavailable, e.g. under Node.
   */
  async sendMessageStream(
    input: SendMessageInput & { onDelta: (text: string) => void },
  ): Promise<SendMessageResult> {
    if (!sseAvailable()) {
      const result = await this.sendMessage(input);
      input.onDelta(result.message.content);
      return result;
    }

    const conversationId = input.conversationId ?? 'new';
    const idempotencyKey = input.idempotencyKey ?? generateId('idem_');
    let done: SendMessageResult | null = null;
    let streamError: string | null = null;
    await this.withSessionRetry(() => {
      done = null;
      streamError = null;
      return postSse({
        url: `${this.config.apiUrl}/api/v1/conversations/${encodeURIComponent(conversationId)}/messages`,
        body: { content: input.content, installId: input.installId },
        headers: {
          'Idempotency-Key': idempotencyKey,
          ...this.authHeader(),
        },
        onEvent: (event) => {
          if (event.type === 'delta' && typeof event.text === 'string') {
            input.onDelta(event.text);
          } else if (event.type === 'done') {
            done = {
              conversationId: event.conversationId as string,
              message: event.message as Message,
            };
          } else if (event.type === 'error') {
            streamError = typeof event.message === 'string' ? event.message : 'Stream failed';
          }
        },
      });
    });
    if (streamError) throw new SupportApiError(502, 'stream_error', streamError);
    if (!done) throw new SupportNetworkError('Connection closed before the answer finished');
    return done;
  }

  async listMessages(conversationId: string): Promise<{ messages: Message[] }> {
    return this.withSessionRetry(() =>
      this.request<{ messages: Message[] }>(
        'GET',
        `/api/v1/conversations/${encodeURIComponent(conversationId)}/messages`,
        undefined,
        this.authHeader(),
      ),
    );
  }

  private post<T>(
    path: string,
    body: unknown,
    headers: Record<string, string> = {},
  ): Promise<T> {
    return this.request<T>('POST', path, body, headers);
  }

  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    body?: unknown,
    headers: Record<string, string> = {},
  ): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(`${this.config.apiUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (cause) {
      throw new SupportNetworkError(
        cause instanceof Error ? cause.message : 'Network request failed',
      );
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      let code = 'unknown';
      let message = `HTTP ${response.status}`;
      try {
        const parsed = (await response.json()) as ApiErrorBody;
        code = parsed.error?.code ?? code;
        message = parsed.error?.message ?? message;
      } catch {
        // non-JSON error body — keep the fallback
      }
      throw new SupportApiError(response.status, code, message);
    }

    return (await response.json()) as T;
  }
}
