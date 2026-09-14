# Changelog

## 1.0.0 — 14 September 2026

First stable release. An AI support agent for React Native apps: one component,
answers drawn from your own documentation, backed by a hosted platform.

### Chat

- `<SupportAI apiKey="…" />` renders a floating button and a full chat sheet.
  `apiKey` is the only required prop; the service URL defaults to the hosted
  platform.
- Replies stream in word by word over SSE, with typing dots shown only until the
  first token arrives.
- Keyboard handling that survives modal presentation, using
  `react-native-keyboard-controller` when installed and a frame listener
  otherwise.
- Safe-area insets from `react-native-safe-area-context` when present, sensible
  static values when not.

### Grounding and honesty

- Answers come only from the developer's knowledge base. Questions it cannot
  answer are escalated to the developer by email rather than guessed at.
- Replies never contain links, which keeps App Store and Play policy on outside
  payment intact even when the knowledge base mentions a web store.
- Server error text is never shown to end users; an exhausted plan reads as
  "support is unavailable", never as a billing message.
- Questions that arrive after a plan's monthly quota runs out are kept for the
  developer and acknowledged to the user, rather than refused.

### Integration

- `react-native-support/headless` exposes the client, provider and
  `useSupportChat` with no UI code, for apps bringing their own interface.
- Every colour, radius, spacing and type style is a theme token, overridable per
  group. All user-visible copy is overridable through `strings`.
- Session tokens are obtained at bootstrap and refreshed automatically; requests
  are idempotent, so a retry on a flaky connection never double-sends.
- Works in Expo Go with no native build; optional native modules upgrade the
  experience without requiring a code change.

### Package

- Apache-2.0.
- CommonJS, ESM and TypeScript definitions; `src` shipped for Metro's source
  condition.
- `styled-components` is the only runtime dependency. React Native,
  `react-native-keyboard-controller` and `react-native-safe-area-context` are
  peers, the latter two optional.
