# react-native-support

AI customer support SDK for React Native. Add a 24/7 AI support agent to your
app in minutes — works in Expo Go, no native build required.

```tsx
import { SupportAI } from 'react-native-support';

export default function App() {
  return (
    <>
      {/* your app */}
      <SupportAI apiKey="rns_pk_..." apiUrl="https://your-platform.example.com" />
    </>
  );
}
```

## Design

- **Zero required native dependencies.** Everything optional degrades instead
  of failing: install `react-native-keyboard-controller` (dev build) and the
  chat silently upgrades to interactive keyboard tracking; without it, React
  Native's built-in `KeyboardAvoidingView` is used and Expo Go works as-is.
- **Three layers** — `core` (pure TS, no React), `react` (provider + hooks),
  `ui` (components). `react-native-support/headless` exposes core + react for
  apps that bring their own chat interface.
- **Test keys** (`rns_pk_test_…`) never count toward quota; live keys
  (`rns_pk_live_…`) do.

## Development

```bash
npm install
npm run typecheck && npm run lint && npm test && npm run build
```

Backed by [`support-platform`](https://github.com/devsilk-software/support-platform).

## Branches

- `develop` — default; all work lands here
- `master` — latest released version only
