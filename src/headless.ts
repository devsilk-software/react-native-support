/**
 * Headless entry point — core + react layers only, no UI imports.
 * The single escape hatch for apps that bring their own chat interface.
 */
export { SupportClient } from './core/client';
export type { SendMessageInput, SendMessageResult } from './core/client';
export { SupportApiError, SupportNetworkError, isRetryable } from './core/errors';
export { generateId } from './core/ids';
export { tryRequire } from './core/tryRequire';
export type {
  ApiErrorBody,
  BootstrapRequest,
  BootstrapResponse,
  Citation,
  Message,
  SupportConfig,
} from './core/types';
export { SupportProvider, useSupport } from './react/SupportContext';
export type { SupportContextValue, SupportProviderProps } from './react/SupportContext';
export { useSupportChat } from './react/useSupportChat';
export type { SupportChat } from './react/useSupportChat';
