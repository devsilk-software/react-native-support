import { useState } from 'react';
import styled from 'styled-components/native';
import { Typography } from './Typography';
import { t, useSupportTheme, variant } from '../theme';
import type { SupportStrings } from '../strings';

/** Multiline input that grows to a themed max height, plus a send control. */
type SendState = 'enabled' | 'disabled';

const sendBackground = variant<SendState, string>({
  enabled: (th) => th.colors.primary,
  disabled: (th) => th.colors.border,
});

export function Composer({
  onSend,
  disabled,
  strings,
}: {
  onSend: (content: string) => void;
  disabled: boolean;
  strings: SupportStrings;
}) {
  const [text, setText] = useState('');
  const theme = useSupportTheme();
  const canSend = !disabled && text.trim().length > 0;
  const sendState: SendState = canSend ? 'enabled' : 'disabled';

  const submit = () => {
    if (!canSend) return;
    const content = text;
    setText('');
    onSend(content);
  };

  return (
    <Row>
      <Input
        value={text}
        onChangeText={setText}
        placeholder={strings.inputPlaceholder}
        multiline
        maxLength={theme.sizes.composerMaxLength}
        accessibilityLabel={strings.inputPlaceholder}
        // Enter inserts a newline on multiline inputs; sending is the button's job.
      />
      <SendButton
        onPress={submit}
        disabled={!canSend}
        $variant={sendState}
        accessibilityRole="button"
        accessibilityLabel={strings.send}
      >
        <SendGlyph variant="header" color="onPrimary" weight="600">
          {'↑'}
        </SendGlyph>
      </SendButton>
    </Row>
  );
}

const Row = styled.View`
  flex-direction: row;
  align-items: flex-end;
  padding: ${t((th) => th.spacing.sm)}px;
  gap: ${t((th) => th.spacing.sm)}px;
  border-top-width: ${t((th) => th.borders.hairline)}px;
  border-top-color: ${t((th) => th.colors.border)};
  background-color: ${t((th) => th.colors.background)};
`;

const Input = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: t((th) => th.colors.placeholder)({ theme }),
}))`
  flex: 1;
  border-radius: ${t((th) => th.radii.input)}px;
  padding: ${t((th) => th.spacing.sm)}px ${t((th) => th.spacing.md)}px;
  font-size: ${t((th) => th.typography.body.fontSize)}px;
  max-height: ${t((th) => th.sizes.composerMaxHeight)}px;
  background-color: ${t((th) => th.colors.inputBackground)};
  color: ${t((th) => th.colors.inputText)};
`;

const SendButton = styled.Pressable<{ $variant: SendState }>`
  width: ${t((th) => th.sizes.sendButton)}px;
  height: ${t((th) => th.sizes.sendButton)}px;
  border-radius: ${t((th) => th.sizes.sendButton / 2)}px;
  align-items: center;
  justify-content: center;
  background-color: ${sendBackground};
`;

/** Glyph sizing is the only thing not covered by the header variant. */
const SendGlyph = styled(Typography)`
  font-size: ${t((th) => th.sizes.glyph)}px;
`;
