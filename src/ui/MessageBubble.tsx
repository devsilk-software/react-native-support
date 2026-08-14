import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Message } from '../core/types';
import type { SupportTheme } from './theme';

/**
 * One message. Memoised so streaming (M2) and status flips only re-render the
 * bubble that changed — plan §3.1 "streaming without layout thrash".
 */
export const MessageBubble = memo(function MessageBubble({
  message,
  theme,
}: {
  message: Message;
  theme: SupportTheme;
}) {
  const isUser = message.role === 'user';
  const failed = message.status === 'failed';
  return (
    <View
      style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}
      accessibilityRole="text"
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser ? theme.userBubble : theme.assistantBubble,
            borderRadius: theme.bubbleRadius,
            opacity: failed ? 0.55 : message.status === 'sending' ? 0.8 : 1,
          },
        ]}
      >
        <Text
          selectable
          style={{
            color: isUser ? theme.userBubbleText : theme.assistantBubbleText,
            fontSize: 15,
            lineHeight: 21,
          }}
        >
          {message.content}
        </Text>
        {message.citations && message.citations.length > 0 ? (
          <View style={styles.citations}>
            {message.citations.map((c, i) => (
              <View
                key={`${c.documentId}-${i}`}
                style={[styles.chip, { borderColor: theme.border }]}
              >
                <Text style={{ color: theme.mutedText, fontSize: 11 }} numberOfLines={1}>
                  {c.title ?? 'Source'}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: { paddingHorizontal: 12, marginVertical: 3, flexDirection: 'row' },
  rowUser: { justifyContent: 'flex-end' },
  rowAssistant: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '82%', paddingHorizontal: 14, paddingVertical: 9 },
  citations: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, gap: 4 },
  chip: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    maxWidth: 160,
  },
});
