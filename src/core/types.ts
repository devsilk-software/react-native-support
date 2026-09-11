/**
 * Wire types — mirror of the platform's zod schemas.
 * Hand-synced; will be generated from the OpenAPI spec.
 */

export interface SupportConfig {
  /** Publishable key: rns_pk_test_… or rns_pk_live_… */
  apiKey: string;
  /** Override the platform base URL. Defaults to the hosted service. */
  apiUrl?: string;
}

export interface BootstrapRequest {
  apiKey: string;
  installId: string;
  bundleId?: string;
  platform?: 'ios' | 'android';
  appVersion?: string;
  sdkVersion?: string;
}

export interface BootstrapResponse {
  project: {
    id: string;
    name: string;
    config: Record<string, unknown>;
  };
  mode: 'test' | 'live';
  quota: {
    state: 'ok' | 'warning' | 'exceeded';
    used: number;
    limit: number;
  };
  /** Short-lived credential the client uses for every call after bootstrap. */
  session: {
    token: string;
    expiresAt: string;
  };
  serverTime: string;
}

export interface Citation {
  documentId: string;
  title?: string;
  url?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  createdAt: string;
  /** Local-only delivery state for optimistic rendering. */
  status?: 'sending' | 'sent' | 'failed';
}

export interface ApiErrorBody {
  error: { code: string; message: string };
}
