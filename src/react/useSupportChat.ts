import { useCallback, useRef, useState } from 'react';
import { generateId } from '../core/ids';
import type { Message } from '../core/types';
import { useSupport } from './SupportContext';

/**
 * Conversation state machine: optimistic user message, streamed assistant
 * reply growing in place, typed failure with retry.
 */

export interface SupportChat {
  messages: Message[];
  /** True from send until the reply is complete — gates the composer. */
  isSending: boolean;
  /** True only while waiting for the first token — gates the typing dots. */
  isThinking: boolean;
  /**
   * The last question was kept for the app's team rather than answered,
   * because the app's support plan is out of conversations this month.
   */
  captured: boolean;
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
  const { client, installId } = useSupport();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const lastFailedRef = useRef<PendingSend | null>(null);

  const perform = useCallback(
    async (pending: PendingSend) => {
      setIsSending(true);
      setIsThinking(true);
      setError(null);
      setCaptured(false);
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

      // The reply grows in a placeholder bubble; `done` swaps in the server
      // message (real id, citations) without a visual jump.
      const replyId = generateId('local_reply_');
      let replyStarted = false;
      const onDelta = (text: string) => {
        setIsThinking(false);
        setMessages((prev) => {
          if (!replyStarted) {
            replyStarted = true;
            return [
              ...prev.map((m) =>
                m.id === pending.localId ? { ...m, status: 'sent' as const } : m,
              ),
              {
                id: replyId,
                role: 'assistant' as const,
                content: text,
                createdAt: new Date().toISOString(),
              },
            ];
          }
          return prev.map((m) => (m.id === replyId ? { ...m, content: m.content + text } : m));
        });
      };

      try {
        const result = await client.sendMessageStream({
          conversationId: conversationIdRef.current,
          content: pending.content,
          installId,
          idempotencyKey: pending.idempotencyKey,
          onDelta,
        });
        conversationIdRef.current = result.conversationId;
        lastFailedRef.current = null;
        setCaptured(result.captured);
        setMessages((prev) => {
          const settled = prev
            .filter((m) => m.id !== replyId)
            .map((m) => (m.id === pending.localId ? { ...m, status: 'sent' as const } : m));
          // A captured question has no reply to append.
          return result.message ? [...settled, result.message] : settled;
        });
      } catch (cause) {
        lastFailedRef.current = pending;
        setError(cause instanceof Error ? cause : new Error(String(cause)));
        setMessages((prev) =>
          prev
            .filter((m) => m.id !== replyId)
            .map((m) => (m.id === pending.localId ? { ...m, status: 'failed' as const } : m)),
        );
      } finally {
        setIsSending(false);
        setIsThinking(false);
      }
    },
    [client, installId],
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

  return { messages, isSending, isThinking, captured, error, send, retry, clearError };
}
