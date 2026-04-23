import Taro from '@tarojs/taro';
import type { HistoryRecord, AppConfig } from '@/types';
import { APP_CONFIG } from '@/constants/appConfig';

export interface UserSettings {
  apiKey: string;
  maxRounds: number;
}

export const storageService = {
  getHistory(): HistoryRecord[] {
    try {
      const data = Taro.getStorageSync(APP_CONFIG.STORAGE_KEYS.HISTORY);
      return data || [];
    } catch {
      return [];
    }
  },

  setHistory(history: HistoryRecord[]): void {
    try {
      Taro.setStorageSync(APP_CONFIG.STORAGE_KEYS.HISTORY, history);
    } catch (error) {
      console.error('存储历史记录失败:', error);
    }
  },

  addHistory(record: HistoryRecord): HistoryRecord[] {
    const history = this.getHistory();
    history.unshift(record);
    
    if (history.length > APP_CONFIG.MAX_HISTORY_COUNT) {
      history.splice(APP_CONFIG.MAX_HISTORY_COUNT);
    }
    
    this.setHistory(history);
    return history;
  },

  getHistoryById(id: string): HistoryRecord | null {
    const history = this.getHistory();
    return history.find(item => item.id === id) || null;
  },

  deleteHistory(id: string): HistoryRecord[] {
    const history = this.getHistory();
    const filtered = history.filter(item => item.id !== id);
    this.setHistory(filtered);
    return filtered;
  },

  clearHistory(): void {
    try {
      Taro.removeStorageSync(APP_CONFIG.STORAGE_KEYS.HISTORY);
    } catch (error) {
      console.error('清除历史记录失败:', error);
    }
  },

  getConfig(): AppConfig {
    try {
      const data = Taro.getStorageSync(APP_CONFIG.STORAGE_KEYS.CONFIG);
      return data || { theme: 'light' };
    } catch {
      return { theme: 'light' };
    }
  },

  setConfig(config: AppConfig): void {
    try {
      Taro.setStorageSync(APP_CONFIG.STORAGE_KEYS.CONFIG, config);
    } catch (error) {
      console.error('存储配置失败:', error);
    }
  },

  getSettings(): UserSettings {
    try {
      const data = Taro.getStorageSync(APP_CONFIG.STORAGE_KEYS.SETTINGS);
      return data || { apiKey: '', maxRounds: APP_CONFIG.CONVERSATION.MAX_ROUNDS };
    } catch {
      return { apiKey: '', maxRounds: APP_CONFIG.CONVERSATION.MAX_ROUNDS };
    }
  },

  setSettings(settings: UserSettings): void {
    try {
      Taro.setStorageSync(APP_CONFIG.STORAGE_KEYS.SETTINGS, settings);
    } catch (error) {
      console.error('存储设置失败:', error);
    }
  }
};
