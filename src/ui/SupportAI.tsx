import { useState } from 'react';
import { SupportProvider } from '../react/SupportContext';
import { useSupportChat } from '../react/useSupportChat';
import { ChatSheet } from './ChatSheet';
import { FloatingButton } from './FloatingButton';
import { MaybeKeyboardProvider } from './useKeyboard';
import { mergeStrings, type SupportStrings } from './strings';
import { mergeTheme, type SupportTheme } from './theme';

/**
 * The single public component — plan §2's one-prop promise:
 *
 *   <SupportAI apiKey="rns_pk_…" apiUrl="https://…" />
 *
 * Mounts its own provider, floating button, and chat sheet. Anyone who wants
 * a different interface uses `react-native-support/headless` instead.
 */
export interface SupportAIProps {
  apiKey: string;
  apiUrl: string;
  theme?: Partial<SupportTheme>;
  strings?: Partial<SupportStrings>;
}

function SupportAIInner({
  theme,
  strings,
}: {
  theme: SupportTheme;
  strings: SupportStrings;
}) {
  const [open, setOpen] = useState(false);
  const chat = useSupportChat();
  return (
    <>
      <FloatingButton onPress={() => setOpen(true)} theme={theme} strings={strings} />
      <ChatSheet
        visible={open}
        onClose={() => setOpen(false)}
        chat={chat}
        theme={theme}
        strings={strings}
      />
    </>
  );
}

export function SupportAI({ apiKey, apiUrl, theme, strings }: SupportAIProps) {
  return (
    <SupportProvider apiKey={apiKey} apiUrl={apiUrl}>
      <MaybeKeyboardProvider>
        <SupportAIInner theme={mergeTheme(theme)} strings={mergeStrings(strings)} />
      </MaybeKeyboardProvider>
    </SupportProvider>
  );
}
