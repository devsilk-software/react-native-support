import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import { t, useSupportTheme } from '../theme';

/** Three pulsing dots while the assistant turn is in flight. */
const DOT_COUNT = 3;

export function TypingIndicator() {
  const { animation } = useSupportTheme();
  const { durationMs, staggerMs, cycleGapMs, minOpacity, lift } = animation.typingDot;
  const dotsRef = useRef(
    Array.from({ length: DOT_COUNT }, () => new Animated.Value(0)),
  );
  const dots = dotsRef.current;

  useEffect(() => {
    const loops = dots.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * staggerMs),
          Animated.timing(v, {
            toValue: 1,
            duration: durationMs,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: durationMs,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(Math.max(cycleGapMs - i * staggerMs, 0)),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
    // Animated.Values are stable refs; timing tokens are read once on mount.
  }, [dots, durationMs, staggerMs, cycleGapMs]);

  return (
    <Row accessibilityLabel="Assistant is typing">
      <Bubble>
        {dots.map((v, i) => (
          <Dot
            key={i}
            style={{
              opacity: v.interpolate({ inputRange: [0, 1], outputRange: [minOpacity, 1] }),
              transform: [
                { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -lift] }) },
              ],
            }}
          />
        ))}
      </Bubble>
    </Row>
  );
}

const Row = styled.View`
  flex-direction: row;
  padding-horizontal: ${t((th) => th.spacing.md)}px;
  margin-vertical: ${t((th) => th.spacing.xs)}px;
`;

const Bubble = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${t((th) => th.spacing.md)}px;
  border-radius: ${t((th) => th.radius.bubble)}px;
  background-color: ${t((th) => th.colors.assistantBubble)};
  gap: ${t((th) => th.spacing.xs)}px;
`;

/**
 * Animated values (opacity/transform driven by the native driver) cannot be
 * expressed in a static stylesheet — they are data, not styling, so they stay
 * on the `style` prop of an Animated view; their parameters come from
 * theme.animation. Layout and color below come from tokens.
 */
const Dot = styled(Animated.View)`
  width: ${t((th) => th.sizes.typingDot)}px;
  height: ${t((th) => th.sizes.typingDot)}px;
  border-radius: ${t((th) => th.sizes.typingDot / 2)}px;
  background-color: ${t((th) => th.colors.muted)};
`;
