import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import type { SupportStrings } from './strings';
import type { SupportTheme } from './theme';

/** Absolute-positioned FAB that opens the chat (plan §3.1). */
export function FloatingButton({
  onPress,
  theme,
  strings,
}: {
  onPress: () => void;
  theme: SupportTheme;
  strings: SupportStrings;
}) {
  const size = theme.buttonSize;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={strings.openSupport}
      style={({ pressed }) => [
        styles.fab,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.primary,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
      ]}
    >
      <Text style={[styles.icon, { fontSize: size * 0.45 }]}>{'?'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 40 : 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  icon: { color: '#FFFFFF', fontWeight: '700' },
});
