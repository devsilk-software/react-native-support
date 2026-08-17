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
      .bootstrap({ installId })
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
