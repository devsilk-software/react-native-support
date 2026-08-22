import { Modal } from 'react-native';
import styled from 'styled-components/native';
import type { SupportChat } from '../react/useSupportChat';
import { Composer, ErrorBanner, MessageList, Typography } from './components';
import { KeyboardAvoider, keyboardBehavior } from './useKeyboard';
import { MaybeSafeAreaProvider, useChatInsets } from './useSafeArea';
import { t, useSupportTheme } from './theme';
import type { SupportStrings } from './strings';

/**
 * Full-screen chat sheet: header, list, error banner, composer, inside the
 * normalised keyboard avoider. Insets come from useChatInsets — real device
 * values when safe-area-context is present, token fallbacks otherwise. The
 * modal mounts its own SafeAreaProvider because modals measure their own
 * window, independent of any provider in the host tree.
 */
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
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <MaybeSafeAreaProvider>
        <SheetBody onClose={onClose} chat={chat} strings={strings} />
      </MaybeSafeAreaProvider>
    </Modal>
  );
}

/** Separate component so useChatInsets reads the provider mounted just above. */
function SheetBody({
  onClose,
  chat,
  strings,
}: {
  onClose: () => void;
  chat: SupportChat;
  strings: SupportStrings;
}) {
  const theme = useSupportTheme();
  const { headerTop, composerBottom } = useChatInsets();
  return (
    <Container behavior={keyboardBehavior}>
      <Header $top={headerTop}>
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

      <ComposerWrap $bottom={composerBottom}>
        <Composer
          onSend={(content) => void chat.send(content)}
          disabled={chat.isSending}
          strings={strings}
        />
      </ComposerWrap>
    </Container>
  );
}

const Container = styled(KeyboardAvoider)`
  flex: 1;
  background-color: ${t((th) => th.colors.background)};
`;

const Header = styled.View<{ $top: number }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $top }) => $top}px ${t((th) => th.spacing.lg)}px ${t((th) => th.spacing.md)}px;
  border-bottom-width: ${t((th) => th.borders.hairline)}px;
  border-bottom-color: ${t((th) => th.colors.border)};
`;

const CloseButton = styled.Pressable``;

/** The close glyph borrows the header variant; only its size is glyph-specific. */
const CloseGlyph = styled(Typography)`
  font-size: ${t((th) => th.sizes.glyph)}px;
`;

const ComposerWrap = styled.View<{ $bottom: number }>`
  padding-bottom: ${({ $bottom }) => $bottom}px;
  background-color: ${t((th) => th.colors.background)};
`;
