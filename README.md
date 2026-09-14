<div align="center">

# react-native-support

**A 24/7 AI support agent inside your React Native app.**

Drop in one component, give it your docs, and your users get answers in their
own language, at any hour, without leaving the app.

[![npm](https://img.shields.io/npm/v/react-native-support.svg)](https://www.npmjs.com/package/react-native-support)
[![license](https://img.shields.io/npm/l/react-native-support.svg)](./LICENSE)
![platforms](https://img.shields.io/badge/platforms-iOS%20%7C%20Android%20%7C%20Expo%20Go-informational)

</div>

---

```tsx
import { SupportAI } from 'react-native-support';

export default function App() {
  return (
    <>
      <YourApp />
      <SupportAI apiKey="rns_pk_test_…" />
    </>
  );
}
```

That is the whole integration: a floating support button, a chat sheet, and a
grounded assistant behind it.

## What your users see

```
                                   How do I get a refund?  ◀ user
  ▶ Refunds are handled by Apple and Google, not by us.
    On iOS, request one from Apple's Report a Problem page.

                                  ¿Puedo exportar mis notas?  ◀ user
  ▶ Sí. Abre un cuaderno, toca el icono de compartir
    y elige Exportar como PDF.
```

Replies stream in word by word, in whatever language the question was asked.

## Why this one

- **Works in Expo Go.** No native modules required, no dev build, no config plugin.
- **Answers from your docs, or not at all.** No invented refund policies. When your
  documentation does not cover something, the assistant says so and emails you the
  question instead of guessing.
- **Built for mobile reality.** Retries are idempotent, so a flaky connection never
  double-sends or double-bills. The keyboard behaves inside modals, which is
  harder than it sounds.
- **Yours to style.** Every colour, radius, and size is a theme token. No
  hardcoded values, no fighting the widget.
- **Or headless.** Import the hooks and build your own interface.

## Install

```sh
npm install react-native-support
# yarn add react-native-support · pnpm add react-native-support
```

`styled-components` comes along as a dependency. Everything else is optional —
see [Optional native modules](#optional-native-modules).

## Quickstart

1. Sign in at [app.react-native-support.com](https://app.react-native-support.com) —
   that creates your account and first app — then copy the **test key**
   (`rns_pk_test_…`) from the API keys screen.
2. Add knowledge: paste your FAQ, or point the crawler at your docs site. The
   assistant answers only from this, so it is worth ten minutes.
3. Render `<SupportAI apiKey="rns_pk_test_…" />`, usually at the root of your tree
   next to your navigator.
4. Ship with a **live key** (`rns_pk_live_…`) when you are happy. Test-key
   conversations are unlimited and never count toward your quota.

## Props

| Prop | Type | Default | |
| --- | --- | --- | --- |
| `apiKey` | `string` | — | **Required.** Test or live publishable key. |
| `theme` | `SupportThemeOverride` | built-in light | Partial override, deep-merged with the defaults. |
| `strings` | `Partial<SupportStrings>` | English | Every user-visible string. |
| `defaultOpen` | `boolean` | `false` | Open the sheet on mount, e.g. from a deep link. |
| `apiUrl` | `string` | hosted service | Point at your own deployment of the platform. |

### Theming

```tsx
<SupportAI
  apiKey="rns_pk_live_…"
  theme={{
    colors: { primary: '#0F766E', userBubble: '#0F766E' },
    radius: { bubble: 20 },
  }}
/>
```

Override any of `colors`, `radius`, `spacing`, `typography`, `sizes`, `opacity`,
`borders`, `insets`, `shadows`, `animation`. Autocomplete lists every token.

### Copy

```tsx
<SupportAI
  apiKey="rns_pk_live_…"
  strings={{
    headerTitle: 'Ayuda',
    inputPlaceholder: 'Escribe tu pregunta…',
    emptyState: 'Pregúntanos lo que quieras. Solemos responder en segundos.',
  }}
/>
```

This is your app's chrome. Replies themselves always come back in whatever
language the user writes in, regardless of these strings.

## Headless

Bring your own interface and keep the state machine:

```tsx
import { SupportProvider, useSupportChat } from 'react-native-support/headless';

function MyChat() {
  const { messages, send, isSending, isThinking, error, retry } = useSupportChat();
  // render however you like
}

<SupportProvider apiKey="rns_pk_live_…">
  <MyChat />
</SupportProvider>;
```

`react-native-support/headless` imports no UI code, so nothing from
`styled-components` reaches your bundle through this path.

## How it behaves

| Situation | What the user sees |
| --- | --- |
| The docs answer the question | A grounded answer, streamed, in their language |
| The docs do not cover it | An honest "I don't have that information", and you get an email with the question |
| Your monthly quota is used up | "Your question has been sent to the team" — the question is kept for you, never lost, and nothing about billing is shown |
| No connection | A retry they can tap |

## Optional native modules

Both are detected at runtime and degrade cleanly when missing, which is why this
works in Expo Go as-is:

- **`react-native-keyboard-controller`** — interactive keyboard tracking in the
  chat sheet. Without it, the SDK uses its own keyboard frame listener on iOS and
  relies on `adjustResize` on Android.
- **`react-native-safe-area-context`** — real device insets. Ships with Expo Go and
  React Navigation, so most apps already have it; without it, sensible static
  insets are used.

Installing either later requires no code change.

## Troubleshooting

**The assistant says it doesn't know anything.** Its knowledge base is empty or
too thin — add sources in the dashboard. This is by design: it never answers from
general knowledge, only from your documentation.

**The keyboard covers the input.** Install `react-native-keyboard-controller` for
interactive tracking. The built-in fallback handles the common cases, but a
custom modal stack can still confuse it.

**Requests fail with 401.** The key is revoked, or you are using a live key while
the project's bundle-id allowlist names a different app.

**Nothing arrives in the dashboard.** Check whether you shipped a test key: test
conversations are real, but they are marked test and excluded from quota and
usage.

## Example app

[`example/`](./example) is a runnable Expo app wired to a local platform — the
fastest way to see the chat, and a reference for integration.

## Privacy

The SDK sends the message text, a generated install id, and your app's bundle id.
No device identifiers, no contacts, no advertising id, no tracking permission
required. Conversations belong to your account; end users are anonymous install
ids.

## Requirements

React 18+, React Native 0.72+ (New Architecture supported), iOS 15+, Android 7+.

## Links

- [Dashboard](https://app.react-native-support.com) — apps, knowledge, API keys, conversations
- [Issues](https://github.com/devsilk-software/react-native-support/issues)

## License

Apache-2.0 © devsilk
