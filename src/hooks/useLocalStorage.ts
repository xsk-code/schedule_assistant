import { useState, useEffect, useCallback } from 'react';
import { getApiKey, setApiKey, clearApiKey, getHistory, addHistory, removeHistory, clearHistory, getConfig, setConfig } from '../services/storageService';
import { APP_CONFIG } from '../constants/appConfig';
import type { HistoryRecord, AppConfig } from '../types';

export function useLocalStorage() {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [history, setHistoryState] = useState<HistoryRecord[]>([]);
  const [config, setConfigState] = useState<AppConfig>({
    apiKey: '',
    apiKeyValid: null,
    theme: 'light',
    model: APP_CONFIG.DEFAULT_MODEL,
  });

  useEffect(() => {
    setApiKeyState(getApiKey());
    setHistoryState(getHistory());
    setConfigState(getConfig());
  }, []);

  const saveApiKey = useCallback((key: string) => {
    setApiKey(key);
    setApiKeyState(key);
  }, []);

  const removeApiKey = useCallback(() => {
    clearApiKey();
    setApiKeyState('');
  }, []);

  const saveHistory = useCallback((record: HistoryRecord) => {
    addHistory(record);
    setHistoryState(prev => {
      const updated = [record, ...prev];
      return updated.slice(0, 50);
    });
  }, []);

  const deleteHistory = useCallback((id: string) => {
    removeHistory(id);
    setHistoryState(prev => prev.filter(r => r.id !== id));
  }, []);

  const clearAllHistory = useCallback(() => {
    clearHistory();
    setHistoryState([]);
  }, []);

  const updateConfig = useCallback((partialConfig: Partial<AppConfig>) => {
    setConfig(partialConfig);
    setConfigState(prev => ({ ...prev, ...partialConfig }));
  }, []);

  return {
    apiKey,
    history,
    config,
    saveApiKey,
    removeApiKey,
    saveHistory,
    deleteHistory,
    clearAllHistory,
    updateConfig,
  };
}
