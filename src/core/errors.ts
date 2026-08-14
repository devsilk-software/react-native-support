/** Typed errors so UI and integrators can branch without string-matching. */

export class SupportApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'SupportApiError';
    this.status = status;
    this.code = code;
  }
}

export class SupportNetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message);
    this.name = 'SupportNetworkError';
  }
}

export function isRetryable(error: unknown): boolean {
  if (error instanceof SupportNetworkError) return true;
  if (error instanceof SupportApiError) {
    return error.status === 429 || error.status >= 500;
  }
  return false;
}
