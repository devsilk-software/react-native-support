import { memo } from 'react';
import styled from 'styled-components/native';
import type { Message } from '../../core/types';
import { Bubble, BubbleRow, type BubbleVariant } from './Bubble';
import { Typography } from './Typography';
import { t } from '../theme';

/**
 * One message. Memoised so streaming and status flips only re-render the
 * bubble that changed.
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
        {message.citations && message.citations.length > 0 ? (
          <Citations>
            {message.citations.map((c, i) => (
              <Chip key={`${c.documentId}-${i}`}>
                <Typography variant="caption" color="muted" numberOfLines={1}>
                  {c.title ?? 'Source'}
                </Typography>
              </Chip>
            ))}
          </Citations>
        ) : null}
      </Bubble>
    </BubbleRow>
  );
});

const Citations = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${t((th) => th.spacing.xs)}px;
  gap: ${t((th) => th.spacing.xs)}px;
`;

const Chip = styled.View`
  border-width: ${t((th) => th.borders.hairline)}px;
  border-color: ${t((th) => th.colors.border)};
  border-radius: ${t((th) => th.radii.chip)}px;
  padding: ${t((th) => th.spacing.xxs)}px ${t((th) => th.spacing.xs)}px;
  max-width: ${t((th) => th.sizes.chipMaxWidth)}px;
`;
