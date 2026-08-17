import { Modal, Platform, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import type { SupportChat } from '../react/useSupportChat';
import { Composer, ErrorBanner, MessageList, Typography } from './components';
import { KeyboardAvoider, keyboardBehavior } from './useKeyboard';
import { t } from './theme';
import type { SupportStrings } from './strings';

/**
 * Full-screen chat sheet: header, list, error banner, composer, inside the
 * normalised keyboard avoider. Safe-area handling uses StatusBar height plus
 * a platform constant; react-native-safe-area-context becomes an optional
 * upgrade later, same pattern as the keyboard library.
 */
const TOP_INSET = Platform.OS === 'ios' ? 14 : (StatusBar.currentHeight ?? 24);
const BOTTOM_INSET = Platform.OS === 'ios' ? 24 : 8;

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
      <Container behavior={keyboardBehavior}>
        <Header>
          <Typography variant="header" color="headerText">
            {strings.headerTitle}
          </Typography>
          <CloseButton
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={strings.close}
            hitSlop={12}
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
  padding: ${TOP_INSET}px ${t((th) => th.spacing.lg)}px ${t((th) => th.spacing.md)}px;
  border-bottom-width: 0.5px;
  border-bottom-color: ${t((th) => th.colors.border)};
`;

const CloseButton = styled.Pressable``;

/** The close glyph borrows the header variant; only its size is glyph-specific. */
const CloseGlyph = styled(Typography)`
  font-size: 18px;
`;

const ComposerWrap = styled.View`
  padding-bottom: ${BOTTOM_INSET}px;
  background-color: ${t((th) => th.colors.background)};
`;
