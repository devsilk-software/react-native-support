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
 * The single public component — one prop required beyond the endpoint:
 *
 *   <SupportAI apiKey="rns_pk_…" apiUrl="https://…" />
 *
 * Mounts its own provider, theme, floating button, and chat sheet. Anyone who
 * wants a different interface uses 'react-native-support/headless' instead.
 *
 * The ThemeProvider is scoped to this subtree: host apps that use
 * styled-components with their own theme are unaffected outside it.
 */
export interface SupportAIProps {
  apiKey: string;
  apiUrl: string;
  theme?: SupportThemeOverride;
  strings?: Partial<SupportStrings>;
}

function SupportAIInner({ strings }: { strings: SupportStrings }) {
  const [open, setOpen] = useState(false);
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

export function SupportAI({ apiKey, apiUrl, theme, strings }: SupportAIProps) {
  return (
    <SupportProvider apiKey={apiKey} apiUrl={apiUrl}>
      <ThemeProvider theme={mergeTheme(theme)}>
        <MaybeSafeAreaProvider>
          <MaybeKeyboardProvider>
            <SupportAIInner strings={mergeStrings(strings)} />
          </MaybeKeyboardProvider>
        </MaybeSafeAreaProvider>
      </ThemeProvider>
    </SupportProvider>
  );
}
