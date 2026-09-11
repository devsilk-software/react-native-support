import { SupportApiError, SupportNetworkError } from './errors';
import type { ApiErrorBody } from './types';

/**
 * Minimal SSE-over-POST client.
 *
 * React Native's fetch cannot read a response body incrementally, but its
 * XMLHttpRequest delivers progressive responseText, so streaming rides on XHR
 * with no dependencies. Events are `data: <json>` frames separated by blank
 * lines; the server ends every stream with a `done` or `error` event.
 */

const STREAM_TIMEOUT_MS = 60_000;

export interface SseEvent {
  type: 'delta' | 'done' | 'captured' | 'error';
  text?: string;
  message?: unknown;
  conversationId?: string;
  [key: string]: unknown;
}

export function sseAvailable(): boolean {
  return typeof XMLHttpRequest !== 'undefined';
}

export function postSse(input: {
  url: string;
  body: unknown;
  headers: Record<string, string>;
  onEvent: (event: SseEvent) => void;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let consumed = 0;
    let buffer = '';
    let settled = false;

    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    const pump = () => {
      // responseText only grows; parse just the unseen tail.
      const text = xhr.responseText ?? '';
      buffer += text.slice(consumed);
      consumed = text.length;
      let boundary = buffer.indexOf('\n\n');
      while (boundary !== -1) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        boundary = buffer.indexOf('\n\n');
        const data = frame
          .split('\n')
          .filter((line) => line.startsWith('data: '))
          .map((line) => line.slice(6))
          .join('\n');
        if (!data) continue;
        try {
          input.onEvent(JSON.parse(data) as SseEvent);
        } catch {
          // a malformed frame is dropped; the stream still ends with done/error
        }
      }
    };

    xhr.open('POST', input.url);
    xhr.timeout = STREAM_TIMEOUT_MS;
    for (const [key, value] of Object.entries(input.headers)) {
      xhr.setRequestHeader(key, value);
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'text/event-stream');

    xhr.onprogress = () => {
      if (xhr.status === 200) pump();
    };
    xhr.onerror = () => fail(new SupportNetworkError('Network request failed'));
    xhr.ontimeout = () => fail(new SupportNetworkError('Request timed out'));
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4 || settled) return;
      if (xhr.status === 200) {
        pump();
        settled = true;
        resolve();
        return;
      }
      let code = 'unknown';
      let message = `HTTP ${xhr.status}`;
      try {
        const parsed = JSON.parse(xhr.responseText) as ApiErrorBody;
        code = parsed.error?.code ?? code;
        message = parsed.error?.message ?? message;
      } catch {
        // non-JSON error body — keep the fallback
      }
      fail(new SupportApiError(xhr.status, code, message));
    };

    xhr.send(JSON.stringify(input.body));
  });
}
