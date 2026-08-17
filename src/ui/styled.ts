import { useTheme as useStyledTheme } from 'styled-components/native';
import type { SupportTheme } from './theme';

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

/** Typed hook for components that need theme values outside CSS. */
export function useSupportTheme(): SupportTheme {
  return useStyledTheme() as SupportTheme;
}
