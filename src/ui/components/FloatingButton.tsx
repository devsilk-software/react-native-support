import styled from 'styled-components/native';
import { Typography } from './Typography';
import { useChatInsets } from '../useSafeArea';
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
  const { fabBottom } = useChatInsets();
  return (
    <Fab
      onPress={onPress}
      $bottom={fabBottom}
      accessibilityRole="button"
      accessibilityLabel={strings.openSupport}
    >
      <FabGlyph variant="header" color="onPrimary" weight="700">
        {'?'}
      </FabGlyph>
    </Fab>
  );
}

const Fab = styled.Pressable<{ $bottom: number }>`
  position: absolute;
  right: ${t((th) => th.insets.fabRight)}px;
  bottom: ${({ $bottom }) => $bottom}px;
  width: ${t((th) => th.sizes.floatingButton)}px;
  height: ${t((th) => th.sizes.floatingButton)}px;
  border-radius: ${t((th) => th.sizes.floatingButton / 2)}px;
  align-items: center;
  justify-content: center;
  background-color: ${t((th) => th.colors.primary)};
  elevation: ${t((th) => th.shadows.fab.elevation)};
  shadow-color: ${t((th) => th.colors.shadow)};
  shadow-opacity: ${t((th) => th.shadows.fab.shadowOpacity)};
  shadow-radius: ${t((th) => th.shadows.fab.shadowRadius)}px;
  shadow-offset: 0px ${t((th) => th.shadows.fab.shadowOffsetY)}px;
`;

/** Glyph scales with the button, so its size derives from sizes, not typography. */
const FabGlyph = styled(Typography)`
  font-size: ${t((th) => Math.round(th.sizes.floatingButton * th.sizes.floatingButtonGlyphScale))}px;
  line-height: ${t((th) =>
    Math.round(th.sizes.floatingButton * th.sizes.floatingButtonGlyphScale * 1.2),
  )}px;
`;
