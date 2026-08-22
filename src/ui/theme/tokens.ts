/**
 * Theme tokens. The chat renders inside someone else's brand, so every visual
 * value — color, radius, spacing, size, opacity, border, inset, shadow, and
 * animation parameter — is a token, overridable via the `theme` prop on
 * <SupportAI />. Components carry no literal numbers in their styles and no
 * conditional logic in their CSS: anything variant-shaped resolves through a
 * named lookup, and all text renders through <Typography>.
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
    shadow: string;
  };
  radius: {
    bubble: number;
    input: number;
    chip: number;
  };
  spacing: {
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: Record<TypographyVariant, TypographyStyle>;
  sizes: {
    floatingButton: number;
    /** Glyph size as a fraction of the floating button, so overrides scale together. */
    floatingButtonGlyphScale: number;
    sendButton: number;
    /** Standalone glyphs (send ↑, close ✕). */
    glyph: number;
    composerMaxHeight: number;
    composerMaxLength: number;
    typingDot: number;
    /** Percentage of the list width a bubble may occupy. */
    bubbleMaxWidthPct: number;
    chipMaxWidth: number;
    hitSlop: number;
  };
  opacity: {
    /** Optimistic user message while the request is in flight. */
    sending: number;
    /** Message whose send failed. */
    failed: number;
    pressed: number;
    /** Identity value, so resolvers never carry a literal 1. */
    opaque: number;
  };
  borders: {
    hairline: number;
  };
  /**
   * With react-native-safe-area-context present (Expo Go, most real apps),
   * real device insets drive layout and the Min/Offset values act as floors
   * and offsets on top of them. The Fallback values only apply in bare RN
   * apps without the library.
   */
  insets: {
    /** Aesthetic minimum padding under the sheet's top edge. */
    sheetTopMin: number;
    /** No library and no StatusBar height: assumed Android status bar. */
    sheetTopAndroidFallback: number;
    /** Minimum padding under the composer. */
    sheetBottomMin: number;
    /** No library on iOS: assumed home-indicator clearance. */
    sheetBottomFallbackIOS: number;
    /** FAB distance above the bottom inset. */
    fabBottomOffset: number;
    /** No library on iOS: assumed inset + offset combined. */
    fabBottomFallbackIOS: number;
    fabRight: number;
  };
  shadows: {
    fab: {
      elevation: number;
      shadowOpacity: number;
      shadowRadius: number;
      shadowOffsetY: number;
    };
  };
  animation: {
    typingDot: {
      durationMs: number;
      staggerMs: number;
      cycleGapMs: number;
      minOpacity: number;
      lift: number;
    };
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
    shadow: '#000000',
  },
  radius: {
    bubble: 16,
    input: 20,
    chip: 8,
  },
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  typography: {
    header: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
    body: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
    label: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
    caption: { fontSize: 11, lineHeight: 14, fontWeight: '400' },
  },
  sizes: {
    floatingButton: 56,
    floatingButtonGlyphScale: 0.45,
    sendButton: 36,
    glyph: 18,
    composerMaxHeight: 96,
    composerMaxLength: 2000,
    typingDot: 7,
    bubbleMaxWidthPct: 82,
    chipMaxWidth: 160,
    hitSlop: 12,
  },
  opacity: {
    sending: 0.8,
    failed: 0.55,
    pressed: 0.85,
    opaque: 1,
  },
  borders: {
    hairline: 0.5,
  },
  insets: {
    sheetTopMin: 14,
    sheetTopAndroidFallback: 24,
    sheetBottomMin: 8,
    sheetBottomFallbackIOS: 24,
    fabBottomOffset: 24,
    fabBottomFallbackIOS: 40,
    fabRight: 20,
  },
  shadows: {
    fab: {
      elevation: 6,
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffsetY: 4,
    },
  },
  animation: {
    typingDot: {
      durationMs: 380,
      staggerMs: 140,
      cycleGapMs: 280,
      minOpacity: 0.35,
      lift: 3,
    },
  },
};

/** Deep-merge a partial override onto the defaults, one level per group. */
export type SupportThemeOverride = {
  colors?: Partial<SupportTheme['colors']>;
  radius?: Partial<SupportTheme['radius']>;
  spacing?: Partial<SupportTheme['spacing']>;
  typography?: Partial<Record<TypographyVariant, Partial<TypographyStyle>>>;
  sizes?: Partial<SupportTheme['sizes']>;
  opacity?: Partial<SupportTheme['opacity']>;
  borders?: Partial<SupportTheme['borders']>;
  insets?: Partial<SupportTheme['insets']>;
  shadows?: { fab?: Partial<SupportTheme['shadows']['fab']> };
  animation?: { typingDot?: Partial<SupportTheme['animation']['typingDot']> };
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
    radius: { ...defaultTheme.radius, ...overrides.radius },
    spacing: { ...defaultTheme.spacing, ...overrides.spacing },
    typography,
    sizes: { ...defaultTheme.sizes, ...overrides.sizes },
    opacity: { ...defaultTheme.opacity, ...overrides.opacity },
    borders: { ...defaultTheme.borders, ...overrides.borders },
    insets: { ...defaultTheme.insets, ...overrides.insets },
    shadows: { fab: { ...defaultTheme.shadows.fab, ...overrides.shadows?.fab } },
    animation: {
      typingDot: { ...defaultTheme.animation.typingDot, ...overrides.animation?.typingDot },
    },
  };
}
