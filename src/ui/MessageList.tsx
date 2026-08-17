import { useCallback, useRef } from 'react';
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import styled from 'styled-components/native';
import type { Message } from '../core/types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { t, useSupportTheme } from './styled';
import type { SupportStrings } from './strings';

/**
 * Inverted FlatList — React Native's virtualised, bottom-anchored list.
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
  strings,
}: {
  messages: Message[];
  isTyping: boolean;
  strings: SupportStrings;
}) {
  const listRef = useRef<FlatList<Message>>(null);
  const nearBottomRef = useRef(true);
  const theme = useSupportTheme();

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
      renderItem={({ item }) => <MessageBubble message={item} />}
      onScroll={onScroll}
      scrollEventThrottle={64}
      onContentSizeChange={onContentSizeChange}
      keyboardShouldPersistTaps="handled"
      // FlatList's content container takes a style object, not a component —
      // themed values reach it via the hook instead of a styled wrapper.
      contentContainerStyle={{ paddingVertical: theme.spacing.sm + 2, flexGrow: 1 }}
      ListHeaderComponent={isTyping ? <TypingIndicator /> : undefined}
      ListEmptyComponent={
        <Empty>
          <EmptyText>{strings.emptyState}</EmptyText>
        </Empty>
      }
    />
  );
}

/** Inverted list flips its children; the empty state flips itself back. */
const Empty = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${t((th) => th.spacing.lg * 2)}px;
  transform: scaleY(-1);
`;

const EmptyText = styled.Text`
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: ${t((th) => th.colors.muted)};
`;
