import styled from 'styled-components/native';
import { Typography } from './Typography';
import { t } from '../theme';
import type { SupportStrings } from '../strings';

/** Inline error with retry — errors explain and offer a way forward. */
export function ErrorBanner({
  message,
  onRetry,
  strings,
}: {
  message: string;
  onRetry: () => void;
  strings: SupportStrings;
}) {
  return (
    <Banner>
      <Grow>
        <Typography variant="label" color="onErrorBackground" numberOfLines={2}>
          {message || strings.errorGeneric}
        </Typography>
      </Grow>
      <RetryButton onPress={onRetry} accessibilityRole="button" accessibilityLabel={strings.retry}>
        <Typography variant="label" color="onErrorBackground" weight="700">
          {strings.retry}
        </Typography>
      </RetryButton>
    </Banner>
  );
}

const Banner = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${t((th) => th.spacing.sm + 2)}px ${t((th) => th.spacing.md + 2)}px;
  gap: ${t((th) => th.spacing.md)}px;
  background-color: ${t((th) => th.colors.errorBackground)};
`;

const Grow = styled.View`
  flex: 1;
`;

const RetryButton = styled.Pressable``;
