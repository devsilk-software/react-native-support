import { Modal, Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import type { SupportChat } from '../react/useSupportChat';
import { Composer } from './Composer';
import { ErrorBanner } from './ErrorBanner';
import { MessageList } from './MessageList';
import { KeyboardAvoider, keyboardBehavior } from './useKeyboard';
import type { SupportStrings } from './strings';
import type { SupportTheme } from './theme';

/**
 * Full-screen chat sheet (plan §3.1): header, list, error banner, composer,
 * inside the normalised keyboard avoider. Safe-area handling uses StatusBar
 * height + a platform constant — react-native-safe-area-context becomes an
 * optional upgrade in M1, same pattern as the keyboard library.
 */
const TOP_INSET = Platform.OS === 'ios' ? 59 : (StatusBar.currentHeight ?? 24);
const BOTTOM_INSET = Platform.OS === 'ios' ? 24 : 8;

export function ChatSheet({
  visible,
  onClose,
  chat,
  theme,
  strings,
}: {
  visible: boolean;
  onClose: () => void;
  chat: SupportChat;
  theme: SupportTheme;
  strings: SupportStrings;
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoider
        behavior={keyboardBehavior}
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={[styles.header, { borderBottomColor: theme.border, paddingTop: Platform.OS === 'ios' ? 14 : TOP_INSET }]}>
          <Text style={[styles.title, { color: theme.headerText }]}>
            {strings.headerTitle}
          </Text>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={strings.close}
            hitSlop={12}
          >
            <Text style={[styles.closeGlyph, { color: theme.mutedText }]}>✕</Text>
          </Pressable>
        </View>

        <MessageList
          messages={chat.messages}
          isTyping={chat.isSending}
          theme={theme}
          strings={strings}
        />

        {chat.error ? (
          <ErrorBanner
            message={chat.error.message}
            onRetry={() => void chat.retry()}
            theme={theme}
            strings={strings}
          />
        ) : null}

        <View style={{ paddingBottom: BOTTOM_INSET, backgroundColor: theme.background }}>
          <Composer
            onSend={(content) => void chat.send(content)}
            disabled={chat.isSending}
            theme={theme}
            strings={strings}
          />
        </View>
      </KeyboardAvoider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 17, fontWeight: '600' },
  closeGlyph: { fontSize: 18, fontWeight: '600' },
});
