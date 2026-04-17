import type { HistoryRecord, AppConfig } from '../types';
import { APP_CONFIG } from '../constants/appConfig';

export function getApiKey(): string {
  return localStorage.getItem(APP_CONFIG.STORAGE_KEYS.API_KEY) || '';
}

export function setApiKey(apiKey: string): void {
  localStorage.setItem(APP_CONFIG.STORAGE_KEYS.API_KEY, apiKey);
}

export function clearApiKey(): void {
  localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.API_KEY);
}

export function getHistory(): HistoryRecord[] {
  const data = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.HISTORY);
  if (!data) return [];
  try {
    return JSON.parse(data) as HistoryRecord[];
  } catch {
    return [];
  }
}

export function addHistory(record: HistoryRecord): void {
  const history = getHistory();
  history.unshift(record);
  
  if (history.length > APP_CONFIG.MAX_HISTORY_COUNT) {
    history.splice(APP_CONFIG.MAX_HISTORY_COUNT);
  }
  
  localStorage.setItem(APP_CONFIG.STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function removeHistory(id: string): void {
  const history = getHistory();
  const filtered = history.filter(r => r.id !== id);
  localStorage.setItem(APP_CONFIG.STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
}

export function clearHistory(): void {
  localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.HISTORY);
}

export function getConfig(): AppConfig {
  const data = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CONFIG);
  const defaultConfig: AppConfig = {
    apiKey: '',
    apiKeyValid: null,
    theme: 'light',
    model: APP_CONFIG.DEFAULT_MODEL,
  };
  
  if (!data) return defaultConfig;
  
  try {
    const saved = JSON.parse(data) as Partial<AppConfig>;
    return { ...defaultConfig, ...saved };
  } catch {
    return defaultConfig;
  }
}

export function setConfig(config: Partial<AppConfig>): void {
  const current = getConfig();
  const updated = { ...current, ...config };
  localStorage.setItem(APP_CONFIG.STORAGE_KEYS.CONFIG, JSON.stringify(updated));
}
