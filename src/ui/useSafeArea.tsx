import type { ComponentType, ReactNode } from 'react';
import { Platform, StatusBar } from 'react-native';
import { tryRequire } from '../core/tryRequire';
import { useSupportTheme } from './theme';

/**
 * Safe-area handling, same optional-peer pattern as the keyboard.
 *
 * `react-native-safe-area-context` is bundled in Expo Go and pulled in by
 * React Navigation, so most host apps already have it — when present, real
 * per-device insets drive the layout. Absent (bare RN without the lib), the
 * inset tokens provide a static approximation. Either way the SDK installs
 * with no native build.
 */

interface EdgeInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface SafeAreaContextModule {
  SafeAreaProvider: ComponentType<{ children: ReactNode }>;
  useSafeAreaInsets: () => EdgeInsets;
}

const sac = tryRequire(
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  () => require('react-native-safe-area-context') as SafeAreaContextModule,
);

export const hasSafeAreaContext = sac != null;

/**
 * Mounts SafeAreaProvider when the library exists. Needed both around the
 * floating button (host tree) and inside the Modal (modals measure their own
 * window). Nesting under a host app's existing provider is harmless.
 */
export function MaybeSafeAreaProvider({ children }: { children: ReactNode }) {
  if (sac) {
    const Provider = sac.SafeAreaProvider;
    return <Provider>{children}</Provider>;
  }
  return <>{children}</>;
}

/**
 * The three inset values the chat actually needs, resolved from real device
 * insets when the library is present and from tokens when it is not.
 *
 * The `sac` branch is module-level and can never change at runtime, so hook
 * order is stable despite the conditional call.
 */
export function useChatInsets(): {
  headerTop: number;
  composerBottom: number;
  fabBottom: number;
} {
  const theme = useSupportTheme();
  const { insets } = theme;

  if (sac) {
    const device = sac.useSafeAreaInsets();
    return {
      headerTop: Math.max(device.top, insets.sheetTopMin),
      composerBottom: Math.max(device.bottom, insets.sheetBottomMin),
      fabBottom: device.bottom + insets.fabBottomOffset,
    };
  }

  return {
    headerTop: Platform.select({
      ios: insets.sheetTopMin,
      default: StatusBar.currentHeight ?? insets.sheetTopAndroidFallback,
    }),
    composerBottom: Platform.select({
      ios: insets.sheetBottomFallbackIOS,
      default: insets.sheetBottomMin,
    }),
    fabBottom: Platform.select({
      ios: insets.fabBottomFallbackIOS,
      default: insets.fabBottomOffset,
    }),
  };
}
