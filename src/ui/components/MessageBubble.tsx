import { memo } from 'react';
import type { Message } from '../../core/types';
import { Bubble, BubbleRow, type BubbleVariant } from './Bubble';
import { Typography } from './Typography';

/**
 * One message. Memoised so streaming and status flips only re-render the
 * bubble that changed. Citations stay in the message payload for the
 * developer dashboard but are not shown to end users.
 */
const bubbleTextColor: Record<BubbleVariant, 'onUserBubble' | 'onAssistantBubble'> = {
  user: 'onUserBubble',
  assistant: 'onAssistantBubble',
};

const roleVariant: Record<Message['role'], BubbleVariant> = {
  user: 'user',
  assistant: 'assistant',
};

export const MessageBubble = memo(function MessageBubble({ message }: { message: Message }) {
  const bubbleVariant = roleVariant[message.role];
  return (
    <BubbleRow $variant={bubbleVariant} accessibilityRole="text">
      <Bubble $variant={bubbleVariant} $status={message.status}>
        <Typography selectable color={bubbleTextColor[bubbleVariant]}>
          {message.content}
        </Typography>
      </Bubble>
    </BubbleRow>
  );
});
