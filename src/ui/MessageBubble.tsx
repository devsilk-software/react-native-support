import { memo } from 'react';
import styled from 'styled-components/native';
import type { Message } from '../core/types';
import { t } from './styled';

/**
 * One message. Memoised so streaming and status flips only re-render the
 * bubble that changed.
 */
export const MessageBubble = memo(function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <Row $isUser={isUser} accessibilityRole="text">
      <Bubble $isUser={isUser} $status={message.status}>
        <BubbleText selectable $isUser={isUser}>
          {message.content}
        </BubbleText>
        {message.citations && message.citations.length > 0 ? (
          <Citations>
            {message.citations.map((c, i) => (
              <Chip key={`${c.documentId}-${i}`}>
                <ChipText numberOfLines={1}>{c.title ?? 'Source'}</ChipText>
              </Chip>
            ))}
          </Citations>
        ) : null}
      </Bubble>
    </Row>
  );
});

const Row = styled.View<{ $isUser: boolean }>`
  flex-direction: row;
  justify-content: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  padding-horizontal: ${t((th) => th.spacing.md)}px;
  margin-vertical: ${t((th) => th.spacing.xs / 2)}px;
`;

const Bubble = styled.View<{ $isUser: boolean; $status?: Message['status'] }>`
  max-width: 82%;
  padding: ${t((th) => th.spacing.sm + 1)}px ${t((th) => th.spacing.md + 2)}px;
  border-radius: ${t((th) => th.radii.bubble)}px;
  background-color: ${({ $isUser, theme }) =>
    $isUser
      ? t((th) => th.colors.userBubble)({ theme })
      : t((th) => th.colors.assistantBubble)({ theme })};
  opacity: ${({ $status }) => ($status === 'failed' ? 0.55 : $status === 'sending' ? 0.8 : 1)};
`;

const BubbleText = styled.Text<{ $isUser: boolean }>`
  color: ${({ $isUser, theme }) =>
    $isUser
      ? t((th) => th.colors.onUserBubble)({ theme })
      : t((th) => th.colors.onAssistantBubble)({ theme })};
  font-size: ${t((th) => th.typography.body.fontSize)}px;
  line-height: ${t((th) => th.typography.body.lineHeight)}px;
`;

const Citations = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${t((th) => th.spacing.xs + 2)}px;
  gap: ${t((th) => th.spacing.xs)}px;
`;

const Chip = styled.View`
  border-width: 0.5px;
  border-color: ${t((th) => th.colors.border)};
  border-radius: ${t((th) => th.radii.chip)}px;
  padding: 2px ${t((th) => th.spacing.xs + 2)}px;
  max-width: 160px;
`;

const ChipText = styled.Text`
  color: ${t((th) => th.colors.muted)};
  font-size: ${t((th) => th.typography.caption.fontSize)}px;
`;
