/**
 * Theme tokens (plan §3.1). The chat renders inside someone else's brand, so
 * every color and radius is overridable via the `theme` prop; these defaults
 * aim for neutral-but-considered rather than branded.
 */
export interface SupportTheme {
  primary: string;
  background: string;
  surface: string;
  userBubble: string;
  userBubbleText: string;
  assistantBubble: string;
  assistantBubbleText: string;
  inputBackground: string;
  inputText: string;
  placeholderText: string;
  border: string;
  error: string;
  errorText: string;
  headerText: string;
  mutedText: string;
  bubbleRadius: number;
  buttonSize: number;
}

export const defaultTheme: SupportTheme = {
  primary: '#2563EB',
  background: '#FFFFFF',
  surface: '#F4F5F7',
  userBubble: '#2563EB',
  userBubbleText: '#FFFFFF',
  assistantBubble: '#F1F2F4',
  assistantBubbleText: '#16181D',
  inputBackground: '#F1F2F4',
  inputText: '#16181D',
  placeholderText: '#8A919C',
  border: '#E3E5E8',
  error: '#FDECEC',
  errorText: '#B3261E',
  headerText: '#16181D',
  mutedText: '#8A919C',
  bubbleRadius: 16,
  buttonSize: 56,
};

export function mergeTheme(overrides?: Partial<SupportTheme>): SupportTheme {
  return { ...defaultTheme, ...overrides };
}
