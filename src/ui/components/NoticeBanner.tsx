import styled from 'styled-components/native';
import { Typography } from './Typography';
import { t } from '../theme';

/**
 * Neutral inline notice. Deliberately not the error banner: a question that
 * reached the team is not a failure, and colouring it like one would tell the
 * user something went wrong when nothing did.
 */
export function NoticeBanner({ message }: { message: string }) {
  return (
    <Banner accessibilityRole="text">
      <Typography variant="label" color="onAssistantBubble" numberOfLines={3}>
        {message}
      </Typography>
    </Banner>
  );
}

const Banner = styled.View`
  padding: ${t((th) => th.spacing.sm)}px ${t((th) => th.spacing.md)}px;
  background-color: ${t((th) => th.colors.assistantBubble)};
`;
