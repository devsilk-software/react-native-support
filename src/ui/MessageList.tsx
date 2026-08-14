import { useCallback, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import type { Message } from '../core/types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import type { SupportStrings } from './strings';
import type { SupportTheme } from './theme';

/**
 * Inverted FlatList — RN's virtualised, bottom-anchored list (plan §3.1).
 *
 * Auto-scroll respects the reader: on an inverted list offset 0 IS the newest
 * message, and new content only snaps there when the user is already near the
 * bottom. Someone scrolled up reading history is never yanked away — the
 * classic chat bug this file exists to not have.
 */
const NEAR_BOTTOM_PX = 80;

export function MessageList({
  messages,
  isTyping,
  theme,
  strings,
}: {
  messages: Message[];
  isTyping: boolean;
  theme: SupportTheme;
  strings: SupportStrings;
}) {
  const listRef = useRef<FlatList<Message>>(null);
  const nearBottomRef = useRef(true);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Inverted: contentOffset.y === 0 is the newest message.
    nearBottomRef.current = e.nativeEvent.contentOffset.y < NEAR_BOTTOM_PX;
  }, []);

  const onContentSizeChange = useCallback(() => {
    if (nearBottomRef.current) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, []);

  // Inverted list wants newest-first data.
  const data = [...messages].reverse();

  return (
    <FlatList
      ref={listRef}
      inverted
      data={data}
      keyExtractor={(m) => m.id}
      renderItem={({ item }) => <MessageBubble message={item} theme={theme} />}
      onScroll={onScroll}
      scrollEventThrottle={64}
      onContentSizeChange={onContentSizeChange}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      ListHeaderComponent={isTyping ? <TypingIndicator theme={theme} /> : undefined}
      ListEmptyComponent={
        <View style={styles.empty}>
          {/* Inverted list flips children; flip back. */}
          <Text style={[styles.emptyText, { color: theme.mutedText }]}>
            {strings.emptyState}
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingVertical: 10, flexGrow: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    transform: [{ scaleY: -1 }],
  },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
