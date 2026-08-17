import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import { t } from '../theme';

/** Three pulsing dots while the assistant turn is in flight. */
export function TypingIndicator() {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const loops = dots.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 140),
          Animated.timing(v, {
            toValue: 1,
            duration: 380,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: 380,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(280 - i * 140 > 0 ? 280 - i * 140 : 0),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
    // Animated.Values are stable refs; run once on mount.
  }, []);

  return (
    <Row accessibilityLabel="Assistant is typing">
      <Bubble>
        {dots.map((v, i) => (
          <Dot
            key={i}
            style={{
              opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
              transform: [
                { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) },
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
  margin-vertical: ${t((th) => th.spacing.xs / 2)}px;
`;

const Bubble = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${t((th) => th.spacing.md)}px ${t((th) => th.spacing.md + 2)}px;
  border-radius: ${t((th) => th.radii.bubble)}px;
  background-color: ${t((th) => th.colors.assistantBubble)};
  gap: ${t((th) => th.spacing.xs)}px;
`;

/**
 * Animated values (opacity/transform driven by the native driver) cannot be
 * expressed in a static stylesheet — they are data, not styling, so they stay
 * on the `style` prop of an Animated view. Colors and layout still come from
 * the theme.
 */
const Dot = styled(Animated.View)`
  width: 7px;
  height: 7px;
  border-radius: 4px;
  background-color: ${t((th) => th.colors.muted)};
`;
