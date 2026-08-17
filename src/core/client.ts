import { SupportApiError, SupportNetworkError } from './errors';
import { generateId } from './ids';
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
 * runs under Node for tests and is reusable for future non-RN SDKs.
 * Streaming (SSE over XHR) comes later; the message endpoint is designed
 * for it, so turning it on is additive.
 */

const DEFAULT_TIMEOUT_MS = 30_000;

export interface SendMessageInput {
  conversationId: string | null;
  content: string;
  /** Generated once per user message; reused verbatim on retry (§6 idempotency). */
  idempotencyKey?: string;
}

export interface SendMessageResult {
  conversationId: string;
  message: Message;
}

export class SupportClient {
  private readonly config: SupportConfig;

  constructor(config: SupportConfig) {
    this.config = { ...config, apiUrl: config.apiUrl.replace(/\/+$/, '') };
  }

  async bootstrap(input: Omit<BootstrapRequest, 'apiKey'>): Promise<BootstrapResponse> {
    return this.post<BootstrapResponse>('/api/v1/bootstrap', {
      ...input,
      apiKey: this.config.apiKey,
    });
  }

  async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    const conversationId = input.conversationId ?? 'new';
    return this.post<SendMessageResult>(
      `/api/v1/conversations/${encodeURIComponent(conversationId)}/messages`,
      { content: input.content },
      {
        'Idempotency-Key': input.idempotencyKey ?? generateId('idem_'),
        Authorization: `Bearer ${this.config.apiKey}`,
      },
    );
  }

  async listMessages(conversationId: string): Promise<{ messages: Message[] }> {
    return this.request<{ messages: Message[] }>(
      'GET',
      `/api/v1/conversations/${encodeURIComponent(conversationId)}/messages`,
      undefined,
      { Authorization: `Bearer ${this.config.apiKey}` },
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
