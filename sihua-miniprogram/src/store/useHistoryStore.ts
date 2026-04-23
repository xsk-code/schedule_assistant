import { create } from 'zustand';
import type { HistoryRecord } from '@/types';
import { storageService } from '@/services/storageService';

interface HistoryState {
  records: HistoryRecord[];
  isLoaded: boolean;
  
  loadHistory: () => void;
  addRecord: (record: HistoryRecord) => void;
  deleteRecord: (id: string) => void;
  clearAll: () => void;
  getRecordById: (id: string) => HistoryRecord | null;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  records: [],
  isLoaded: false,

  loadHistory: () => {
    const records = storageService.getHistory();
    set({ records, isLoaded: true });
  },

  addRecord: (record: HistoryRecord) => {
    const records = storageService.addHistory(record);
    set({ records });
  },

  deleteRecord: (id: string) => {
    const records = storageService.deleteHistory(id);
    set({ records });
  },

  clearAll: () => {
    storageService.clearHistory();
    set({ records: [] });
  },

  getRecordById: (id: string) => {
    const { records } = get();
    return records.find(item => item.id === id) || null;
  },
}));
