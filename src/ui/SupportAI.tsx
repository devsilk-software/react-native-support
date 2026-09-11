import { useState } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { SupportProvider } from '../react/SupportContext';
import { useSupportChat } from '../react/useSupportChat';
import { ChatSheet } from './ChatSheet';
import { FloatingButton } from './components';
import { MaybeKeyboardProvider } from './useKeyboard';
import { MaybeSafeAreaProvider } from './useSafeArea';
import { mergeStrings, type SupportStrings } from './strings';
import { mergeTheme, type SupportThemeOverride } from './theme';

/**
 * The single public component. One required prop:
 *
 *   <SupportAI apiKey="rns_pk_…" />
 *
 * Mounts its own provider, theme, floating button, and chat sheet. Anyone who
 * wants a different interface uses 'react-native-support/headless' instead.
 *
 * The ThemeProvider is scoped to this subtree: host apps that use
 * styled-components with their own theme are unaffected outside it.
 */
export interface SupportAIProps {
  apiKey: string;
  /** Override the platform base URL. Defaults to the hosted service. */
  apiUrl?: string;
  theme?: SupportThemeOverride;
  strings?: Partial<SupportStrings>;
  /** Open the chat sheet on mount — e.g. when deep-linking straight into support. */
  defaultOpen?: boolean;
}

function SupportAIInner({
  strings,
  defaultOpen,
}: {
  strings: SupportStrings;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const chat = useSupportChat();
  return (
    <>
      <FloatingButton onPress={() => setOpen(true)} strings={strings} />
      <ChatSheet
        visible={open}
        onClose={() => setOpen(false)}
        chat={chat}
        strings={strings}
      />
    </>
  );
}

export function SupportAI({
  apiKey,
  apiUrl,
  theme,
  strings,
  defaultOpen = false,
}: SupportAIProps) {
  return (
    <SupportProvider apiKey={apiKey} apiUrl={apiUrl}>
      <ThemeProvider theme={mergeTheme(theme)}>
        <MaybeSafeAreaProvider>
          <MaybeKeyboardProvider>
            <SupportAIInner strings={mergeStrings(strings)} defaultOpen={defaultOpen} />
          </MaybeKeyboardProvider>
        </MaybeSafeAreaProvider>
      </ThemeProvider>
    </SupportProvider>
  );
}
