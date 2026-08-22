import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import {
  Dimensions,
  Keyboard,
  LayoutAnimation,
  Platform,
  View,
  type KeyboardAvoidingViewProps,
  type KeyboardEvent,
  type ViewProps,
} from 'react-native';

/**
 * Keyboard handling.
 *
 * `react-native-keyboard-controller` is an optional peer: present (dev build /
 * bare RN) → best-in-class interactive tracking; absent (Expo Go) → our own
 * frame-listener fallback below.
 *
 * The fallback is deliberately NOT React Native's KeyboardAvoidingView: KAV
 * measures against the screen, and inside a pageSheet Modal (exactly where
 * this chat lives) the window is offset, so KAV computes zero and the
 * keyboard covers the composer. Listening to the keyboard's end frame and
 * padding by the overlap works in every presentation style.
 *
 * The require MUST be a literal, directly inside try/catch, in this scope:
 * that exact shape is what Metro's optional-dependency detection looks for.
 * Wrapping it in a helper or closure turns a missing optional module into a
 * BUILD error instead of a caught runtime one.
 */

interface KeyboardControllerModule {
  KeyboardAvoidingView: ComponentType<KeyboardAvoidingViewProps>;
  KeyboardProvider: ComponentType<{ children: ReactNode }>;
}

let kc: KeyboardControllerModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  kc = require('react-native-keyboard-controller') as KeyboardControllerModule;
} catch {
  kc = null;
}

export const hasKeyboardController = kc != null;

/**
 * Pads its content by the keyboard's overlap with the window bottom.
 *
 * iOS only: Android windows use adjustResize, where the OS shrinks the window
 * itself when the keyboard shows — adding padding on top of that would
 * compensate twice (and with a hardware keyboard attached, Android reports a
 * phantom input-tray inset with no keyboard on screen at all). On Android
 * this component is a plain View.
 */
function FrameListenerAvoider({ children, style, ...rest }: ViewProps) {
  const [keyboardPad, setKeyboardPad] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const animate = () => {
      try {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      } catch {
        // LayoutAnimation is best-effort; padding still applies without it.
      }
    };
    const onFrame = (e: KeyboardEvent) => {
      animate();
      const overlap = Math.max(
        0,
        Dimensions.get('window').height - e.endCoordinates.screenY,
      );
      setKeyboardPad(overlap);
    };
    const onHide = () => {
      animate();
      setKeyboardPad(0);
    };
    const subs = [
      Keyboard.addListener('keyboardWillChangeFrame', onFrame),
      Keyboard.addListener('keyboardWillHide', onHide),
    ];
    return () => subs.forEach((s) => s.remove());
  }, []);

  return (
    <View {...rest} style={[style, { paddingBottom: keyboardPad }]}>
      {children}
    </View>
  );
}

/** With the native library: its avoider in padding mode. Without: the frame listener. */
function ControllerAvoider({ children, style, ...rest }: ViewProps) {
  const Avoider = (kc as KeyboardControllerModule).KeyboardAvoidingView;
  return (
    <Avoider behavior="padding" style={style} {...rest}>
      {children}
    </Avoider>
  );
}

/**
 * Normalised avoider: plain View props, keyboard strategy chosen internally.
 * Callers never pass `behavior` — the right mode is an implementation detail
 * of each path.
 */
export const KeyboardAvoider: ComponentType<ViewProps> = kc
  ? ControllerAvoider
  : FrameListenerAvoider;

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
