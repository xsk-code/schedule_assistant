type DebugLogValue = unknown;

export const DEBUG_LOGS_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_DEBUG_LOGS === 'true';

export function isDebugLoggingEnabled(): boolean {
  return DEBUG_LOGS_ENABLED;
}

export function debugLog(...args: DebugLogValue[]): void {
  if (!isDebugLoggingEnabled()) {
    return;
  }

  console.log(...args);
}

export function debugGroup(...args: DebugLogValue[]): void {
  if (!isDebugLoggingEnabled()) {
    return;
  }

  console.group(...args);
}

export function debugGroupEnd(): void {
  if (!isDebugLoggingEnabled()) {
    return;
  }

  console.groupEnd();
}
