/** UI copy, overridable for localization via the `strings` prop. */
export interface SupportStrings {
  headerTitle: string;
  inputPlaceholder: string;
  send: string;
  emptyState: string;
  errorGeneric: string;
  retry: string;
  close: string;
  openSupport: string;
}

export const defaultStrings: SupportStrings = {
  headerTitle: 'Support',
  inputPlaceholder: 'Type your question…',
  send: 'Send',
  emptyState: 'Ask us anything — we usually reply in seconds.',
  errorGeneric: 'Something went wrong sending your message.',
  retry: 'Retry',
  close: 'Close',
  openSupport: 'Open support chat',
};

export function mergeStrings(overrides?: Partial<SupportStrings>): SupportStrings {
  return { ...defaultStrings, ...overrides };
}
