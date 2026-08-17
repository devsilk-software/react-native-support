import { useCallback, useRef } from 'react';
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import styled from 'styled-components/native';
import type { Message } from '../../core/types';
import { MessageBubble } from './MessageBubble';
import { Typography } from './Typography';
import { TypingIndicator } from './TypingIndicator';
import { t, useSupportTheme } from '../theme';
import type { SupportStrings } from '../strings';

/**
 * Inverted FlatList — React Native's virtualised, bottom-anchored list.
 *
 * Auto-scroll respects the reader: on an inverted list offset 0 IS the newest
 * message, and new content only snaps there when the user is already near the
 * bottom. Someone scrolled up reading history is never yanked away — the
 * classic chat bug this file exists to not have.
 */
// Scroll behavior, not styling: how close to the newest message counts as "at the
// bottom", and how often scroll events sample. Not brand-themable.
const NEAR_BOTTOM_PX = 80;
const SCROLL_EVENT_THROTTLE_MS = 64;

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
      scrollEventThrottle={SCROLL_EVENT_THROTTLE_MS}
      onContentSizeChange={onContentSizeChange}
      keyboardShouldPersistTaps="handled"
      // FlatList's content container takes a style object, not a component —
      // themed values reach it via the hook instead of a styled wrapper.
      contentContainerStyle={{ paddingVertical: theme.spacing.sm, flexGrow: 1 }}
      ListHeaderComponent={isTyping ? <TypingIndicator /> : undefined}
      ListEmptyComponent={
        <Empty>
          <CenteredBody color="muted">{strings.emptyState}</CenteredBody>
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
  padding: ${t((th) => th.spacing.xxl)}px;
  transform: scaleY(-1);
`;

const CenteredBody = styled(Typography)`
  text-align: center;
`;
