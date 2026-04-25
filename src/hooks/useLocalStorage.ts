import { useState, useEffect, useCallback } from 'react';
import { getHistory, addHistory, removeHistory, clearHistory, getConfig, setConfig } from '../services/storageService';
import { APP_CONFIG } from '../constants/appConfig';
import type { HistoryRecord, AppConfig } from '../types';

export function useLocalStorage() {
  const [history, setHistoryState] = useState<HistoryRecord[]>([]);
  const [config, setConfigState] = useState<AppConfig>({
    theme: 'light',
    model: APP_CONFIG.DEFAULT_MODEL,
  });

  useEffect(() => {
    setHistoryState(getHistory());
    setConfigState(getConfig());
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
    history,
    config,
    saveHistory,
    deleteHistory,
    clearAllHistory,
    updateConfig,
  };
}
