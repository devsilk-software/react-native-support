import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { SupportClient } from '../core/client';
import { generateId } from '../core/ids';
import type { BootstrapResponse, SupportConfig } from '../core/types';

/**
 * Provider layer. `<SupportAI />` mounts this internally; headless
 * consumers mount it themselves and build their own UI on the hooks.
 */

export interface SupportContextValue {
  client: SupportClient;
  installId: string;
  bootstrap: BootstrapResponse | null;
  bootstrapError: Error | null;
}

const SupportContext = createContext<SupportContextValue | null>(null);

/**
 * The app's bundle id / package name, when an optional provider is installed.
 * The platform uses it for the per-project allowlist; absent is fine. The
 * requires stay literal inside try/catch — Metro's rule for optional deps.
 */
function detectBundleId(): string | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const app = require('expo-application') as { applicationId?: string | null };
    if (app.applicationId) return app.applicationId;
  } catch {
    // not an Expo app, or expo-application not installed
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const info = require('react-native-device-info') as { getBundleId?: () => string };
    const bundleId = info.getBundleId?.();
    if (bundleId) return bundleId;
  } catch {
    // react-native-device-info not installed
  }
  return undefined;
}

export interface SupportProviderProps extends SupportConfig {
  children: ReactNode;
}

/**
 * Install id: stable per provider instance for now. Persisting it across app
 * launches (AsyncStorage as an optional peer) will arrive with the device
 * collectors — the wire contract already carries it, so that change is local.
 */
export function SupportProvider({ apiKey, apiUrl, children }: SupportProviderProps) {
  const installIdRef = useRef<string | null>(null);
  installIdRef.current ??= generateId('inst_');
  const installId = installIdRef.current;

  const client = useMemo(() => new SupportClient({ apiKey, apiUrl }), [apiKey, apiUrl]);

  const [bootstrap, setBootstrap] = useState<BootstrapResponse | null>(null);
  const [bootstrapError, setBootstrapError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setBootstrap(null);
    setBootstrapError(null);
    client
      .bootstrap({ installId, bundleId: detectBundleId() })
      .then((result) => {
        if (!cancelled) setBootstrap(result);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setBootstrapError(error instanceof Error ? error : new Error(String(error)));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [client, installId]);

  const value = useMemo(
    () => ({ client, installId, bootstrap, bootstrapError }),
    [client, installId, bootstrap, bootstrapError],
  );

  return <SupportContext.Provider value={value}>{children}</SupportContext.Provider>;
}

export function useSupport(): SupportContextValue {
  const ctx = useContext(SupportContext);
  if (!ctx) {
    throw new Error(
      'useSupport must be used inside <SupportProvider> (or <SupportAI>, which mounts one).',
    );
  }
  return ctx;
}
