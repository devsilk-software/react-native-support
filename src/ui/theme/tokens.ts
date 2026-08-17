/**
 * Theme tokens. The chat renders inside someone else's brand, so every color,
 * radius, spacing, size, and type value is a token, overridable via the
 * `theme` prop on <SupportAI />. Components never hardcode visual values —
 * everything styled resolves through this object, and all text renders
 * through <Typography>, which reads the `typography` group.
 */
export type FontWeight = '400' | '500' | '600' | '700';

export interface TypographyStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: FontWeight;
  /** Unset → the platform's system font. Set it to ship a brand font. */
  fontFamily?: string;
}

/** header — sheet title · body — messages · label — buttons/banners · caption — chips/meta */
export type TypographyVariant = 'header' | 'body' | 'label' | 'caption';

export interface SupportTheme {
  colors: {
    primary: string;
    onPrimary: string;
    background: string;
    surface: string;
    /** Default foreground for text without a more specific token. */
    text: string;
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
  typography: Record<TypographyVariant, TypographyStyle>;
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
    text: '#16181D',
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
    header: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
    body: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
    label: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
    caption: { fontSize: 11, lineHeight: 14, fontWeight: '400' },
  },
  sizes: {
    floatingButton: 56,
    sendButton: 36,
    composerMaxHeight: 96,
  },
};

/** Deep-merge a partial override onto the defaults, one level per group. */
export type SupportThemeOverride = {
  colors?: Partial<SupportTheme['colors']>;
  radii?: Partial<SupportTheme['radii']>;
  spacing?: Partial<SupportTheme['spacing']>;
  typography?: Partial<Record<TypographyVariant, Partial<TypographyStyle>>>;
  sizes?: Partial<SupportTheme['sizes']>;
};

export function mergeTheme(overrides?: SupportThemeOverride): SupportTheme {
  if (!overrides) return defaultTheme;
  const typography = { ...defaultTheme.typography };
  if (overrides.typography) {
    for (const key of Object.keys(overrides.typography) as TypographyVariant[]) {
      typography[key] = { ...defaultTheme.typography[key], ...overrides.typography[key] };
    }
  }
  return {
    colors: { ...defaultTheme.colors, ...overrides.colors },
    radii: { ...defaultTheme.radii, ...overrides.radii },
    spacing: { ...defaultTheme.spacing, ...overrides.spacing },
    typography,
    sizes: { ...defaultTheme.sizes, ...overrides.sizes },
  };
}
