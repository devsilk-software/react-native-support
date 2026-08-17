/**
 * Theme tokens. The chat renders inside someone else's brand, so every color,
 * radius, and size is a token, overridable via the `theme` prop on
 * <SupportAI />. Components never hardcode visual values — everything styled
 * resolves through this object.
 */
export interface SupportTheme {
  colors: {
    primary: string;
    onPrimary: string;
    background: string;
    surface: string;
    userBubble: string;
    onUserBubble: string;
    assistantBubble: string;
    onAssistantBubble: string;
    inputBackground: string;
    inputText: string;
    placeholder: string;
    border: string;
    errorBackground: string;
    onErrorBackground: string;
    headerText: string;
    muted: string;
  };
  radii: {
    bubble: number;
    input: number;
    chip: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
  typography: {
    body: { fontSize: number; lineHeight: number };
    header: { fontSize: number; fontWeight: '400' | '500' | '600' | '700' };
    caption: { fontSize: number };
  };
  sizes: {
    floatingButton: number;
    sendButton: number;
    composerMaxHeight: number;
  };
}

export const defaultTheme: SupportTheme = {
  colors: {
    primary: '#2563EB',
    onPrimary: '#FFFFFF',
    background: '#FFFFFF',
    surface: '#F4F5F7',
    userBubble: '#2563EB',
    onUserBubble: '#FFFFFF',
    assistantBubble: '#F1F2F4',
    onAssistantBubble: '#16181D',
    inputBackground: '#F1F2F4',
    inputText: '#16181D',
    placeholder: '#8A919C',
    border: '#E3E5E8',
    errorBackground: '#FDECEC',
    onErrorBackground: '#B3261E',
    headerText: '#16181D',
    muted: '#8A919C',
  },
  radii: {
    bubble: 16,
    input: 20,
    chip: 8,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
  },
  typography: {
    body: { fontSize: 15, lineHeight: 21 },
    header: { fontSize: 17, fontWeight: '600' },
    caption: { fontSize: 11 },
  },
  sizes: {
    floatingButton: 56,
    sendButton: 36,
    composerMaxHeight: 96,
  },
};

/** Deep-merge a partial override onto the defaults, one level per group. */
export type SupportThemeOverride = {
  [G in keyof SupportTheme]?: Partial<SupportTheme[G]>;
};

export function mergeTheme(overrides?: SupportThemeOverride): SupportTheme {
  if (!overrides) return defaultTheme;
  return {
    colors: { ...defaultTheme.colors, ...overrides.colors },
    radii: { ...defaultTheme.radii, ...overrides.radii },
    spacing: { ...defaultTheme.spacing, ...overrides.spacing },
    typography: { ...defaultTheme.typography, ...overrides.typography },
    sizes: { ...defaultTheme.sizes, ...overrides.sizes },
  };
}
