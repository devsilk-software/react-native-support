import styled from 'styled-components/native';
import type { Message } from '../../core/types';
import { t, variant } from '../theme';
import type { SupportTheme } from '../theme';

/**
 * The message bubble surface, as a variant-driven primitive. All variant
 * differences live in token-picker maps — the CSS below contains no
 * conditionals and no literal values.
 */
export type BubbleVariant = 'user' | 'assistant';

const rowJustify = variant<BubbleVariant, string>({
  user: () => 'flex-end',
  assistant: () => 'flex-start',
});

const bubbleBackground = variant<BubbleVariant, string>({
  user: (th) => th.colors.userBubble,
  assistant: (th) => th.colors.assistantBubble,
});

/** Delivery status → opacity, resolved from tokens; undefined means delivered. */
const statusOpacity = ({ $status, theme }: { $status?: Message['status']; theme: unknown }) => {
  const th = theme as SupportTheme;
  const byStatus: Record<NonNullable<Message['status']>, number> = {
    sending: th.opacity.sending,
    failed: th.opacity.failed,
    sent: th.opacity.opaque,
  };
  return byStatus[$status ?? 'sent'];
};

export const BubbleRow = styled.View<{ $variant: BubbleVariant }>`
  flex-direction: row;
  justify-content: ${rowJustify};
  padding-horizontal: ${t((th) => th.spacing.md)}px;
  margin-vertical: ${t((th) => th.spacing.xxs)}px;
`;

export const Bubble = styled.View<{ $variant: BubbleVariant; $status?: Message['status'] }>`
  max-width: ${t((th) => th.sizes.bubbleMaxWidthPct)}%;
  padding: ${t((th) => th.spacing.sm)}px ${t((th) => th.spacing.md)}px;
  border-radius: ${t((th) => th.radii.bubble)}px;
  background-color: ${bubbleBackground};
  opacity: ${statusOpacity};
`;
