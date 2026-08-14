import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { SupportStrings } from './strings';
import type { SupportTheme } from './theme';

/** Multiline input that grows to ~4 lines, plus a send control (plan §3.1). */
export function Composer({
  onSend,
  disabled,
  theme,
  strings,
}: {
  onSend: (content: string) => void;
  disabled: boolean;
  theme: SupportTheme;
  strings: SupportStrings;
}) {
  const [text, setText] = useState('');
  const canSend = !disabled && text.trim().length > 0;

  const submit = () => {
    if (!canSend) return;
    const content = text;
    setText('');
    onSend(content);
  };

  return (
    <View style={[styles.row, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.inputBackground, color: theme.inputText },
        ]}
        value={text}
        onChangeText={setText}
        placeholder={strings.inputPlaceholder}
        placeholderTextColor={theme.placeholderText}
        multiline
        maxLength={2000}
        accessibilityLabel={strings.inputPlaceholder}
        // Enter inserts a newline on multiline inputs; sending is the button's job.
      />
      <Pressable
        onPress={submit}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel={strings.send}
        style={({ pressed }) => [
          styles.send,
          {
            backgroundColor: canSend ? theme.primary : theme.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text style={styles.sendText}>{'↑'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 9,
    paddingBottom: 9,
    fontSize: 15,
    maxHeight: 96,
  },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});
