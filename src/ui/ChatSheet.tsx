import { Modal, Platform, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import type { SupportChat } from '../react/useSupportChat';
import { Composer, ErrorBanner, MessageList, Typography } from './components';
import { KeyboardAvoider, keyboardBehavior } from './useKeyboard';
import { t, useSupportTheme } from './theme';
import type { SupportStrings } from './strings';

/**
 * Full-screen chat sheet: header, list, error banner, composer, inside the
 * normalised keyboard avoider. Safe-area handling uses inset tokens, with
 * Android's top inset falling back to the runtime status-bar height;
 * react-native-safe-area-context becomes an optional upgrade later, same
 * pattern as the keyboard library.
 */
const sheetTop = t((th) =>
  Platform.select({
    ios: th.insets.sheetTopIOS,
    default: StatusBar.currentHeight ?? th.insets.sheetTopAndroidFallback,
  }),
);

const sheetBottom = t((th) =>
  Platform.select({ ios: th.insets.sheetBottomIOS, default: th.insets.sheetBottomAndroid }),
);

export function ChatSheet({
  visible,
  onClose,
  chat,
  strings,
}: {
  visible: boolean;
  onClose: () => void;
  chat: SupportChat;
  strings: SupportStrings;
}) {
  const theme = useSupportTheme();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <Container behavior={keyboardBehavior}>
        <Header>
          <Typography variant="header" color="headerText">
            {strings.headerTitle}
          </Typography>
          <CloseButton
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={strings.close}
            hitSlop={theme.sizes.hitSlop}
          >
            <CloseGlyph variant="header" color="muted">
              ✕
            </CloseGlyph>
          </CloseButton>
        </Header>

        <MessageList messages={chat.messages} isTyping={chat.isSending} strings={strings} />

        {chat.error ? (
          <ErrorBanner
            message={chat.error.message}
            onRetry={() => void chat.retry()}
            strings={strings}
          />
        ) : null}

        <ComposerWrap>
          <Composer
            onSend={(content) => void chat.send(content)}
            disabled={chat.isSending}
            strings={strings}
          />
        </ComposerWrap>
      </Container>
    </Modal>
  );
}

const Container = styled(KeyboardAvoider)`
  flex: 1;
  background-color: ${t((th) => th.colors.background)};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${sheetTop}px ${t((th) => th.spacing.lg)}px ${t((th) => th.spacing.md)}px;
  border-bottom-width: ${t((th) => th.borders.hairline)}px;
  border-bottom-color: ${t((th) => th.colors.border)};
`;

const CloseButton = styled.Pressable``;

/** The close glyph borrows the header variant; only its size is glyph-specific. */
const CloseGlyph = styled(Typography)`
  font-size: ${t((th) => th.sizes.glyph)}px;
`;

const ComposerWrap = styled.View`
  padding-bottom: ${sheetBottom}px;
  background-color: ${t((th) => th.colors.background)};
`;
