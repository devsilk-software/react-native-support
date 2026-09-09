import { postSse, type SseEvent } from '../sse';
import { SupportApiError } from '../errors';

/**
 * Fake XHR that replays scripted chunks through onprogress, the way React
 * Native delivers progressive responseText.
 */
class FakeXhr {
  static script: { status: number; chunks: string[] } = { status: 200, chunks: [] };
  static lastInstance: FakeXhr | null = null;

  status = 0;
  readyState = 0;
  responseText = '';
  timeout = 0;
  onprogress: (() => void) | null = null;
  onerror: (() => void) | null = null;
  ontimeout: (() => void) | null = null;
  onreadystatechange: (() => void) | null = null;
  headers: Record<string, string> = {};

  constructor() {
    FakeXhr.lastInstance = this;
  }
  open() {}
  setRequestHeader(key: string, value: string) {
    this.headers[key] = value;
  }
  send() {
    const { status, chunks } = FakeXhr.script;
    this.status = status;
    void Promise.resolve().then(() => {
      for (const chunk of chunks) {
        this.responseText += chunk;
        this.readyState = 3;
        this.onprogress?.();
      }
      this.readyState = 4;
      this.onreadystatechange?.();
    });
  }
}

const globals = globalThis as { XMLHttpRequest?: unknown };

describe('postSse', () => {
  beforeEach(() => {
    globals.XMLHttpRequest = FakeXhr;
  });
  afterEach(() => {
    delete globals.XMLHttpRequest;
  });

  const run = async () => {
    const events: SseEvent[] = [];
    await postSse({
      url: 'https://api.example.com/x',
      body: {},
      headers: {},
      onEvent: (e) => events.push(e),
    });
    return events;
  };

  it('parses frames even when a chunk boundary splits one', async () => {
    FakeXhr.script = {
      status: 200,
      chunks: [
        'data: {"type":"delta","text":"Hel',
        'lo"}\n\ndata: {"type":"delta","text":" world"}\n\ndata: {"type":"do',
        'ne","conversationId":"c1","message":{"id":"m1"}}\n\n',
      ],
    };
    const events = await run();
    expect(events).toEqual([
      { type: 'delta', text: 'Hello' },
      { type: 'delta', text: ' world' },
      { type: 'done', conversationId: 'c1', message: { id: 'm1' } },
    ]);
  });

  it('rejects with SupportApiError on a non-200 JSON error body', async () => {
    FakeXhr.script = {
      status: 429,
      chunks: ['{"error":{"code":"quota_exceeded","message":"Quota used up."}}'],
    };
    await expect(run()).rejects.toEqual(
      new SupportApiError(429, 'quota_exceeded', 'Quota used up.'),
    );
  });

  it('sends the SSE accept header', async () => {
    FakeXhr.script = { status: 200, chunks: ['data: {"type":"done"}\n\n'] };
    await run();
    expect(FakeXhr.lastInstance?.headers.Accept).toBe('text/event-stream');
  });
});
