import styled from 'styled-components/native';
import { Typography } from './Typography';
import { t } from '../theme';
import type { SupportStrings } from '../strings';

/**
 * Inline error. Retry is offered only when retrying could actually work —
 * a banner inviting someone to retry a request that will fail identically is
 * worse than no banner.
 */
export function ErrorBanner({
  message,
  onRetry,
  strings,
}: {
  message: string;
  onRetry?: (() => void) | undefined;
  strings: SupportStrings;
}) {
  return (
    <Banner>
      <Grow>
        <Typography variant="label" color="onErrorBackground" numberOfLines={2}>
          {message || strings.errorGeneric}
        </Typography>
      </Grow>
      {onRetry ? (
        <RetryButton
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={strings.retry}
        >
          <Typography variant="label" color="onErrorBackground" weight="700">
            {strings.retry}
          </Typography>
        </RetryButton>
      ) : null}
    </Banner>
  );
}

const Banner = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${t((th) => th.spacing.sm)}px ${t((th) => th.spacing.md)}px;
  gap: ${t((th) => th.spacing.md)}px;
  background-color: ${t((th) => th.colors.errorBackground)};
`;

const Grow = styled.View`
  flex: 1;
`;

const RetryButton = styled.Pressable``;
