import { useTheme as useStyledTheme } from 'styled-components/native';
import type { SupportTheme } from './tokens';

/**
 * Theme access for styled-components without global DefaultTheme augmentation.
 *
 * This SDK renders inside host apps that may use styled-components with their
 * own theme. Augmenting DefaultTheme from a library would collide with the
 * host's augmentation, so instead every interpolation goes through `t()`,
 * which casts the ambient theme to SupportTheme locally. Our ThemeProvider is
 * mounted inside <SupportAI />, so within this subtree the cast is always
 * correct — and the host's theme is restored outside it by React context
 * nesting.
 */
export const t =
  <V extends string | number>(pick: (theme: SupportTheme) => V) =>
  ({ theme }: { theme: unknown }): V =>
    pick(theme as SupportTheme);

/**
 * Variant resolution as data instead of conditionals: a component declares a
 * map from each variant name to a token picker, and the styled template
 * interpolates `variant(map)`. No ternaries or if-branches live in CSS.
 *
 *   const bubbleBackground = variant<BubbleVariant, string>({
 *     user: (th) => th.colors.userBubble,
 *     assistant: (th) => th.colors.assistantBubble,
 *   });
 *   // css: background-color: ${bubbleBackground};  (with $variant on props)
 */
export const variant =
  <K extends string, V extends string | number>(map: Record<K, (theme: SupportTheme) => V>) =>
  ({ $variant, theme }: { $variant: K; theme: unknown }): V =>
    map[$variant](theme as SupportTheme);

/** Typed hook for components that need theme values outside CSS. */
export function useSupportTheme(): SupportTheme {
  return useStyledTheme() as SupportTheme;
}
