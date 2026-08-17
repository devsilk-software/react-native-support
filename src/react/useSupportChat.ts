import { useCallback, useRef, useState } from 'react';
import { generateId } from '../core/ids';
import type { Message } from '../core/types';
import { useSupport } from './SupportContext';

/**
 * Conversation state machine: optimistic user message, pending
 * assistant turn, typed failure with retry. Non-streaming for now — the
 * SSE upgrade changes this hook's internals, not its surface.
 */

export interface SupportChat {
  messages: Message[];
  isSending: boolean;
  error: Error | null;
  send: (content: string) => Promise<void>;
  /** Re-sends the last failed user message with its original idempotency key. */
  retry: () => Promise<void>;
  clearError: () => void;
}

interface PendingSend {
  content: string;
  idempotencyKey: string;
  localId: string;
}

export function useSupportChat(): SupportChat {
  const { client } = useSupport();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const lastFailedRef = useRef<PendingSend | null>(null);

  const perform = useCallback(
    async (pending: PendingSend) => {
      setIsSending(true);
      setError(null);
      setMessages((prev) => {
        const optimistic: Message = {
          id: pending.localId,
          role: 'user',
          content: pending.content,
          createdAt: new Date().toISOString(),
          status: 'sending',
        };
        const withoutRetry = prev.filter((m) => m.id !== pending.localId);
        return [...withoutRetry, optimistic];
      });

      try {
        const result = await client.sendMessage({
          conversationId: conversationIdRef.current,
          content: pending.content,
          idempotencyKey: pending.idempotencyKey,
        });
        conversationIdRef.current = result.conversationId;
        lastFailedRef.current = null;
        setMessages((prev) => [
          ...prev.map((m) =>
            m.id === pending.localId ? { ...m, status: 'sent' as const } : m,
          ),
          result.message,
        ]);
      } catch (cause) {
        lastFailedRef.current = pending;
        setError(cause instanceof Error ? cause : new Error(String(cause)));
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pending.localId ? { ...m, status: 'failed' as const } : m,
          ),
        );
      } finally {
        setIsSending(false);
      }
    },
    [client],
  );

  const send = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isSending) return;
      await perform({
        content: trimmed,
        idempotencyKey: generateId('idem_'),
        localId: generateId('local_'),
      });
    },
    [perform, isSending],
  );

  const retry = useCallback(async () => {
    const pending = lastFailedRef.current;
    if (!pending || isSending) return;
    await perform(pending);
  }, [perform, isSending]);

  const clearError = useCallback(() => setError(null), []);

  return { messages, isSending, error, send, retry, clearError };
}
