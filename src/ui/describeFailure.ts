import { SupportApiError, isRetryable } from '../core/errors';
import type { SupportStrings } from './strings';

/**
 * What the end user is told when a send fails.
 *
 * Server messages are never shown: they are written for the developer who
 * integrated the SDK, not for their users, and some of them (an exhausted
 * monthly quota, for instance) would leak the app owner's billing state to
 * the people using the app. Retry is offered only when it could succeed.
 */
export function describeFailure(
  error: Error,
  strings: SupportStrings,
): { text: string; canRetry: boolean } {
  if (error instanceof SupportApiError) {
    if (error.code === 'quota_exceeded') {
      return { text: strings.errorUnavailable, canRetry: false };
    }
    if (error.code === 'rate_limited') {
      return { text: strings.errorUnavailable, canRetry: true };
    }
    return { text: strings.errorGeneric, canRetry: isRetryable(error) };
  }
  // Network failures: the message is ours, but the user only needs the gist.
  return { text: strings.errorGeneric, canRetry: true };
}
