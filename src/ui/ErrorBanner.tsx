import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SupportStrings } from './strings';
import type { SupportTheme } from './theme';

/** Inline error with retry — errors explain and offer a way forward (plan §3.1). */
export function ErrorBanner({
  message,
  onRetry,
  theme,
  strings,
}: {
  message: string;
  onRetry: () => void;
  theme: SupportTheme;
  strings: SupportStrings;
}) {
  return (
    <View style={[styles.banner, { backgroundColor: theme.error }]}>
      <Text style={[styles.text, { color: theme.errorText }]} numberOfLines={2}>
        {message || strings.errorGeneric}
      </Text>
      <Pressable onPress={onRetry} accessibilityRole="button" accessibilityLabel={strings.retry}>
        <Text style={[styles.retry, { color: theme.errorText }]}>{strings.retry}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  text: { flex: 1, fontSize: 13, lineHeight: 18 },
  retry: { fontSize: 13, fontWeight: '700' },
});
