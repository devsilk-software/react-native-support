# react-native-support

A 24/7 AI support agent inside your React Native app. Drop in one component,
give it your docs, and it answers your users' questions in their language,
around the clock, from your own knowledge base.

- **Works in Expo Go.** No native modules required, no dev build, no config plugin.
- **Answers only from your docs.** No invented refund policies. When it doesn't
  know, it says so and emails you the question.
- **Streams replies** word by word, keeps conversation history, and survives
  flaky mobile networks (retries are idempotent, never double-billed).
- **One component**, or bring your own UI with the headless entry point.

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

## Install

```sh
npm install react-native-support
# or: yarn add react-native-support / pnpm add react-native-support
```

`styled-components` comes along as a dependency. Everything else is optional
(see [Optional native modules](#optional-native-modules)).

## Quickstart

1. Create an account and an app in the dashboard, then copy the **test key**
   (`rns_pk_test_…`) from the API keys screen.
2. Add some knowledge: paste your FAQ or point the crawler at your docs site.
   The assistant answers only from this, so it is worth ten minutes.
3. Render `<SupportAI apiKey="rns_pk_test_…" />` anywhere in your tree, usually
   at the root next to your navigator.
4. Ship with a **live key** (`rns_pk_live_…`) when you are happy. Test-key
   conversations are unlimited and never count toward your quota.

## Props

| Prop          | Type                    | Default            | Notes                                                   |
| ------------- | ----------------------- | ------------------ | ------------------------------------------------------- |
| `apiKey`      | `string`                | —                  | Required. Test or live publishable key.                 |
| `theme`       | `SupportThemeOverride`  | built-in light     | Partial override, deep-merged with the defaults.         |
| `strings`     | `Partial<SupportStrings>` | English          | All user-visible copy.                                   |
| `defaultOpen` | `boolean`               | `false`            | Open the sheet on mount, e.g. from a deep link.          |
| `apiUrl`      | `string`                | hosted service     | Point at your own deployment of the platform.            |

### Theming

Every value is a token; there are no hardcoded colors or sizes in the
components.

```tsx
<SupportAI
  apiKey="rns_pk_live_…"
  theme={{
    colors: { primary: '#0F766E', userBubble: '#0F766E' },
    radius: { bubble: 20 },
  }}
/>
```

Override any of `colors`, `radius`, `spacing`, `typography`, `sizes`,
`opacity`, `borders`, `insets`, `shadows`, `animation`.

### Copy

```tsx
<SupportAI
  apiKey="rns_pk_live_…"
  strings={{
    headerTitle: 'Pomoc',
    inputPlaceholder: 'Zadaj pytanie…',
    emptyState: 'Zapytaj o cokolwiek. Zwykle odpowiadamy w kilka sekund.',
  }}
/>
```

Replies themselves always come back in whatever language the user writes in,
regardless of this copy.

## Headless

If you want your own chat interface, import the hooks instead of the UI:

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

`react-native-support/headless` pulls in no UI code, so nothing from
`styled-components` ends up in your bundle through this path.

## Optional native modules

Both are detected at runtime and degrade cleanly when absent, which is why the
package works in Expo Go as-is:

- **`react-native-keyboard-controller`** — interactive keyboard tracking in the
  chat sheet. Without it, the SDK uses its own keyboard frame listener on iOS
  and relies on `adjustResize` on Android.
- **`react-native-safe-area-context`** — real device insets. Ships with Expo Go
  and React Navigation, so most apps already have it; without it, sensible
  static insets are used.

## Privacy

The SDK sends the message text, a generated install id, and your app's bundle
id. It collects no device identifiers, contacts, or advertising ids, and
requires no tracking permission. Conversations belong to your account; end
users are anonymous install ids.

## Requirements

React 18+, React Native 0.72+ (New Architecture supported), iOS 15+, Android 7+.

## License

MIT © devsilk
