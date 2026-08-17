import styled from 'styled-components/native';
import { t } from './styled';
import type { SupportStrings } from './strings';

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
      <BannerText numberOfLines={2}>{message || strings.errorGeneric}</BannerText>
      <RetryButton onPress={onRetry} accessibilityRole="button" accessibilityLabel={strings.retry}>
        <RetryText>{strings.retry}</RetryText>
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

const BannerText = styled.Text`
  flex: 1;
  font-size: 13px;
  line-height: 18px;
  color: ${t((th) => th.colors.onErrorBackground)};
`;

const RetryButton = styled.Pressable``;

const RetryText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${t((th) => th.colors.onErrorBackground)};
`;
