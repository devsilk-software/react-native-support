/**
 * react-native-support — full entry point (UI included).
 * For a UI-less integration, import from 'react-native-support/headless'.
 */
export { SupportAI } from './ui/SupportAI';
export type { SupportAIProps } from './ui/SupportAI';
export { Typography } from './ui/components';
export type { TypographyProps } from './ui/components';
export { defaultTheme } from './ui/theme';
export type {
  SupportTheme,
  SupportThemeOverride,
  TypographyStyle,
  TypographyVariant,
} from './ui/theme';
export { defaultStrings } from './ui/strings';
export type { SupportStrings } from './ui/strings';

// Headless surface re-exported so deep-linking both entries stays consistent.
export * from './headless';
