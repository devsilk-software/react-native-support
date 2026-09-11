/** UI copy, overridable for localization via the `strings` prop. */
export interface SupportStrings {
  headerTitle: string;
  inputPlaceholder: string;
  send: string;
  emptyState: string;
  errorGeneric: string;
  /** Shown when the app's support plan is out of conversations for the month. */
  errorUnavailable: string;
  /** Shown when a question was kept for the team instead of answered. */
  messageCaptured: string;
  retry: string;
  close: string;
  openSupport: string;
}

export const defaultStrings: SupportStrings = {
  headerTitle: 'Support',
  inputPlaceholder: 'Type your question…',
  send: 'Send',
  emptyState: 'Ask us anything. We usually reply in seconds.',
  errorGeneric: 'Something went wrong sending your message.',
  errorUnavailable: 'Support is unavailable right now. Please try again later.',
  messageCaptured: 'Thanks. Your question has been sent to the team and someone will look at it.',
  retry: 'Retry',
  close: 'Close',
  openSupport: 'Open support chat',
};

export function mergeStrings(overrides?: Partial<SupportStrings>): SupportStrings {
  return { ...defaultStrings, ...overrides };
}
