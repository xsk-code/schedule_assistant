import { create } from 'zustand';
import type { SihuaInfo, AnalysisResult, CollectedItem, AIResponse, TaskMode, TaskStatus, HistoryRecord } from '@/types';
import { getTodaySihua } from '@/services/sihuaService';
import { analyzeTask } from '@/services/aiService';
import { clarifyTask } from '@/services/conversationService';
import { storageService } from '@/services/storageService';
import { APP_CONFIG } from '@/constants/appConfig';

interface TaskState {
  mode: TaskMode;
  status: TaskStatus;
  error: string | null;
  
  task: string;
  sihuaInfo: SihuaInfo | null;
  result: AnalysisResult | null;
  
  conversation: {
    currentRound: number;
    maxRounds: number;
    collectedInfo: CollectedItem[];
    currentQuestion: AIResponse | null;
    isGenerating: boolean;
  };
  
  initSihua: () => void;
  setMode: (mode: TaskMode) => void;
  setTask: (task: string) => void;
  startAnalysis: () => Promise<void>;
  continueConversation: (answer: string) => Promise<void>;
  skipConversation: () => Promise<void>;
  resetTask: () => void;
  saveToHistory: () => HistoryRecord | null;
  toggleStepCompletion: (stepIndex: number) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  mode: 'simple',
  status: 'idle',
  error: null,
  
  task: '',
  sihuaInfo: null,
  result: null,
  
  conversation: {
    currentRound: 0,
    maxRounds: APP_CONFIG.CONVERSATION.MAX_ROUNDS,
    collectedInfo: [],
    currentQuestion: null,
    isGenerating: false,
  },

  initSihua: () => {
    try {
      const sihua = getTodaySihua();
      set({ sihuaInfo: sihua });
    } catch (error) {
      console.error('初始化四化信息失败:', error);
    }
  },

  setMode: (mode: TaskMode) => {
    set({ mode });
  },

  setTask: (task: string) => {
    set({ task });
  },

  startAnalysis: async () => {
    const { task, sihuaInfo, mode } = get();
    
    if (!task || task.trim().length < APP_CONFIG.MIN_TASK_LENGTH) {
      set({ 
        status: 'error', 
        error: `任务描述太短，至少需要 ${APP_CONFIG.MIN_TASK_LENGTH} 个字符` 
      });
      return;
    }

    if (!sihuaInfo) {
      set({ 
        status: 'error', 
        error: '无法获取今日四化信息，请检查网络连接' 
      });
      return;
    }

    if (mode === 'thinking') {
      set({ 
        status: 'conversing',
        error: null,
        conversation: {
          currentRound: 1,
          maxRounds: APP_CONFIG.CONVERSATION.MAX_ROUNDS,
          collectedInfo: [],
          currentQuestion: null,
          isGenerating: true,
        }
      });

      try {
        const response = await clarifyTask(task, [], 1, APP_CONFIG.CONVERSATION.MAX_ROUNDS);
        
        set(state => ({
          conversation: {
            ...state.conversation,
            currentQuestion: response,
            isGenerating: false,
          }
        }));

        if (!response.needsMoreInfo) {
          await get().skipConversation();
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '对话初始化失败';
        set({ 
          status: 'error', 
          error: errorMsg,
          conversation: {
            ...get().conversation,
            isGenerating: false,
          }
        });
      }
    } else {
      set({ status: 'analyzing', error: null });

      try {
        const result = await analyzeTask(task, sihuaInfo, []);
        set({ status: 'success', result });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '分析失败';
        set({ status: 'error', error: errorMsg });
      }
    }
  },

  continueConversation: async (answer: string) => {
    const { task, sihuaInfo, conversation } = get();
    const { currentRound, maxRounds, collectedInfo, currentQuestion } = conversation;

    if (!currentQuestion?.question) return;

    const newCollectedInfo: CollectedItem[] = [
      ...collectedInfo,
      {
        question: currentQuestion.question,
        answer,
        timestamp: Date.now(),
      }
    ];

    const nextRound = currentRound + 1;

    set(state => ({
      conversation: {
        ...state.conversation,
        currentRound: nextRound,
        collectedInfo: newCollectedInfo,
        isGenerating: true,
      }
    }));

    if (nextRound > maxRounds) {
      await get().skipConversation();
      return;
    }

    try {
      const response = await clarifyTask(task, newCollectedInfo, nextRound, maxRounds);

      if (response.needsMoreInfo && nextRound <= maxRounds) {
        set(state => ({
          conversation: {
            ...state.conversation,
            currentQuestion: response,
            isGenerating: false,
          }
        }));
      } else {
        if (!sihuaInfo) {
          set({ status: 'error', error: '无法获取今日四化信息' });
          return;
        }

        set({ status: 'analyzing' });
        const result = await analyzeTask(task, sihuaInfo, newCollectedInfo);
        set({ 
          status: 'success', 
          result,
          conversation: {
            ...get().conversation,
            isGenerating: false,
          }
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '对话继续失败';
      set({ 
        status: 'error', 
        error: errorMsg,
        conversation: {
          ...get().conversation,
          isGenerating: false,
        }
      });
    }
  },

  skipConversation: async () => {
    const { task, sihuaInfo, conversation } = get();
    const { collectedInfo } = conversation;

    if (!sihuaInfo) {
      set({ status: 'error', error: '无法获取今日四化信息' });
      return;
    }

    set({ status: 'analyzing' });

    try {
      const result = await analyzeTask(task, sihuaInfo, collectedInfo);
      set({ 
        status: 'success', 
        result,
        conversation: {
          ...get().conversation,
          isGenerating: false,
        }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '分析失败';
      set({ status: 'error', error: errorMsg });
    }
  },

  resetTask: () => {
    set({
      status: 'idle',
      error: null,
      task: '',
      result: null,
      conversation: {
        currentRound: 0,
        maxRounds: APP_CONFIG.CONVERSATION.MAX_ROUNDS,
        collectedInfo: [],
        currentQuestion: null,
        isGenerating: false,
      }
    });
  },

  saveToHistory: () => {
    const { task, sihuaInfo, result } = get();
    
    if (!sihuaInfo || !result) return null;

    const record: HistoryRecord = {
      id: `history_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      task,
      createdAt: new Date().toISOString(),
      dateInfo: {
        solarDate: sihuaInfo.solarDate,
        lunarDate: sihuaInfo.lunarDate,
        dayGan: sihuaInfo.dayGan,
        dayZhi: sihuaInfo.dayZhi,
      },
      sihua: {
        lu: sihuaInfo.sihua.lu,
        quan: sihuaInfo.sihua.quan,
        ke: sihuaInfo.sihua.ke,
        ji: sihuaInfo.sihua.ji,
      },
      result: {
        ...result,
        actionPath: result.actionPath.map(step => ({
          ...step,
          completed: false,
        })),
      },
    };

    storageService.addHistory(record);
    return record;
  },

  toggleStepCompletion: (stepIndex: number) => {
    const { result } = get();
    if (!result) return;

    const newActionPath = [...result.actionPath];
    if (newActionPath[stepIndex]) {
      newActionPath[stepIndex] = {
        ...newActionPath[stepIndex],
        completed: !newActionPath[stepIndex].completed,
      };

      set({
        result: {
          ...result,
          actionPath: newActionPath,
        }
      });
    }
  },
}));
