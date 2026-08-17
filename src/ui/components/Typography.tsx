import type { ReactNode } from 'react';
import type { TextProps } from 'react-native';
import styled from 'styled-components/native';
import type { SupportTheme, TypographyVariant } from '../theme';

/**
 * The single way text is rendered inside the chat. No component in ui/ uses a
 * raw <Text>; every string goes through here, so a brand's type choices —
 * sizes, weights, a custom font family — apply everywhere by editing theme
 * tokens, and never by hunting through components.
 *
 * `variant` picks the token set, `color` names a theme color (never a hex),
 * and `weight` overrides the variant's weight for emphasis cases (a bold
 * retry label on an otherwise regular banner, for instance).
 */
export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: keyof SupportTheme['colors'];
  weight?: SupportTheme['typography'][TypographyVariant]['fontWeight'];
  children?: ReactNode;
}

export function Typography({
  variant = 'body',
  color = 'text',
  weight,
  ...rest
}: TypographyProps) {
  return <StyledText $variant={variant} $color={color} $weight={weight} {...rest} />;
}

const StyledText = styled.Text<{
  $variant: TypographyVariant;
  $color: keyof SupportTheme['colors'];
  $weight?: SupportTheme['typography'][TypographyVariant]['fontWeight'];
}>`
  ${({ theme, $variant, $color, $weight }) => {
    const th = theme as SupportTheme;
    const v = th.typography[$variant];
    return `
      font-size: ${v.fontSize}px;
      line-height: ${v.lineHeight}px;
      font-weight: ${$weight ?? v.fontWeight};
      color: ${th.colors[$color]};
      ${v.fontFamily ? `font-family: ${v.fontFamily};` : ''}
    `;
  }}
`;
