import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { t } from './styled';
import type { SupportStrings } from './strings';

/** Absolute-positioned FAB that opens the chat. */
export function FloatingButton({
  onPress,
  strings,
}: {
  onPress: () => void;
  strings: SupportStrings;
}) {
  return (
    <Fab onPress={onPress} accessibilityRole="button" accessibilityLabel={strings.openSupport}>
      <FabGlyph>{'?'}</FabGlyph>
    </Fab>
  );
}

const FAB_BOTTOM = Platform.OS === 'ios' ? 40 : 24;

const Fab = styled.Pressable`
  position: absolute;
  right: ${t((th) => th.spacing.lg + 4)}px;
  bottom: ${FAB_BOTTOM}px;
  width: ${t((th) => th.sizes.floatingButton)}px;
  height: ${t((th) => th.sizes.floatingButton)}px;
  border-radius: ${t((th) => th.sizes.floatingButton / 2)}px;
  align-items: center;
  justify-content: center;
  background-color: ${t((th) => th.colors.primary)};
  elevation: 6;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
`;

const FabGlyph = styled.Text`
  color: ${t((th) => th.colors.onPrimary)};
  font-size: ${t((th) => Math.round(th.sizes.floatingButton * 0.45))}px;
  font-weight: 700;
`;
