import type { ComponentType, ReactNode } from 'react';
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Platform,
  type KeyboardAvoidingViewProps,
} from 'react-native';
import { tryRequire } from '../core/tryRequire';

/**
 * Keyboard handling — plan §3.1.
 *
 * `react-native-keyboard-controller` is an optional peer: present (dev build /
 * bare RN) → best-in-class interactive tracking; absent (Expo Go) → RN's
 * built-in KeyboardAvoidingView. The two implementations take different props,
 * so this module normalises to one minimal surface instead of spreading
 * through — options only the native one understands must not silently no-op.
 */

interface KeyboardControllerModule {
  KeyboardAvoidingView: ComponentType<KeyboardAvoidingViewProps>;
  KeyboardProvider: ComponentType<{ children: ReactNode }>;
}

const kc = tryRequire(
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  () => require('react-native-keyboard-controller') as KeyboardControllerModule,
);

export const hasKeyboardController = kc != null;

/** Normalised avoider: identical usage on both paths. */
export const KeyboardAvoider: ComponentType<KeyboardAvoidingViewProps> =
  kc?.KeyboardAvoidingView ?? RNKeyboardAvoidingView;

export const keyboardBehavior = Platform.OS === 'ios' ? ('padding' as const) : undefined;

/**
 * Mounts KeyboardProvider only when the library is present — and relies on the
 * host app's own provider if one exists higher in the tree (the library keeps
 * a singleton, so nesting is tolerated but avoided when detectable).
 */
export function MaybeKeyboardProvider({ children }: { children: ReactNode }) {
  if (kc) {
    const Provider = kc.KeyboardProvider;
    return <Provider>{children}</Provider>;
  }
  return <>{children}</>;
}
