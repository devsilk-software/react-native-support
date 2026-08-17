import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { Typography } from './Typography';
import { t } from '../theme';
import type { SupportStrings } from '../strings';

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
      <FabGlyph variant="header" color="onPrimary" weight="700">
        {'?'}
      </FabGlyph>
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

/** Glyph scales with the button, so its size derives from sizes, not typography. */
const FabGlyph = styled(Typography)`
  font-size: ${t((th) => Math.round(th.sizes.floatingButton * 0.45))}px;
  line-height: ${t((th) => Math.round(th.sizes.floatingButton * 0.55))}px;
`;
