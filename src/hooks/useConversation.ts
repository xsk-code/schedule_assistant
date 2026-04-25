import { useState, useCallback } from 'react';
import { clarifyTask } from '../services/conversationService';
import { APP_CONFIG } from '../constants/appConfig';
import type { ConversationContext, CollectedItem, AIQuestion, AIResponse } from '../types';

interface UseConversationReturn {
  context: ConversationContext;
  currentQuestion: AIQuestion | null;
  loading: boolean;
  error: string | null;
  summary: string | null;

  startConversation: (task: string, model?: string) => Promise<void>;
  answerQuestion: (answer: string) => Promise<void>;
  skipQuestion: () => Promise<void>;
  finishConversation: () => Promise<void>;
  reset: () => void;
}

export function useConversation(): UseConversationReturn {
  const [context, setContext] = useState<ConversationContext>({
    originalTask: '',
    collectedInfo: [],
    currentRound: 0,
    isComplete: false,
    isGenerating: false,
    maxRounds: 5,
  });

  const [currentQuestion, setCurrentQuestion] = useState<AIQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [model, setModel] = useState<string>(APP_CONFIG.DEFAULT_MODEL);

  const handleAIResponse = useCallback((response: AIResponse, _questionText: string) => {
    if (response.needsMoreInfo && response.question && response.options) {
      setCurrentQuestion({
        question: response.question,
        options: response.options,
        hint: response.reasoning,
      });
    } else {
      setCurrentQuestion(null);
      setSummary(response.summary || null);
      setContext((prev) => ({
        ...prev,
        isComplete: true,
      }));
    }
  }, []);

  const startConversation = useCallback(async (
    task: string,
    selectedModel?: string
  ) => {
    setLoading(true);
    setError(null);
    setModel(selectedModel || APP_CONFIG.DEFAULT_MODEL);

    setContext({
      originalTask: task,
      collectedInfo: [],
      currentRound: 1,
      isComplete: false,
      isGenerating: false,
      maxRounds: 5,
    });

    try {
      const response = await clarifyTask(
        task,
        [],
        1,
        selectedModel
      );

      handleAIResponse(response, '');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '开始对话失败';
      setError(errorMessage);
      setContext((prev) => ({ ...prev, isComplete: true }));
    } finally {
      setLoading(false);
    }
  }, [handleAIResponse]);

  const processAnswer = useCallback(async (
    question: string,
    answer: string,
    isSkipped: boolean = false
  ) => {
    setLoading(true);
    setError(null);

    const collectedItem: CollectedItem = {
      question,
      answer: isSkipped ? `[跳过] ${answer}` : answer,
      timestamp: Date.now(),
    };

    const newCollectedInfo = [...context.collectedInfo, collectedItem];
    const nextRound = context.currentRound + 1;

    if (nextRound > context.maxRounds) {
      setCurrentQuestion(null);
      setSummary(null);
      setContext((prev) => ({
        ...prev,
        collectedInfo: newCollectedInfo,
        isComplete: true,
      }));
      setLoading(false);
      return;
    }

    try {
      const response = await clarifyTask(
        context.originalTask,
        newCollectedInfo,
        nextRound,
        model
      );

      if (response.needsMoreInfo && response.question && response.options) {
        setCurrentQuestion({
          question: response.question,
          options: response.options,
          hint: response.reasoning,
        });
        setContext((prev) => ({
          ...prev,
          collectedInfo: newCollectedInfo,
          currentRound: nextRound,
        }));
      } else {
        setCurrentQuestion(null);
        setSummary(response.summary || null);
        setContext((prev) => ({
          ...prev,
          collectedInfo: newCollectedInfo,
          isComplete: true,
        }));
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '处理回答失败';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [context, model]);

  const answerQuestion = useCallback(async (answer: string) => {
    if (!currentQuestion) return;
    await processAnswer(currentQuestion.question, answer);
  }, [currentQuestion, processAnswer]);

  const skipQuestion = useCallback(async () => {
    if (!currentQuestion) return;
    await processAnswer(currentQuestion.question, '用户选择跳过此问题', true);
  }, [currentQuestion, processAnswer]);

  const finishConversation = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCurrentQuestion(null);
    setSummary('用户主动结束对话');
    setContext((prev) => ({
      ...prev,
      isComplete: true,
    }));
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    setContext({
      originalTask: '',
      collectedInfo: [],
      currentRound: 0,
      isComplete: false,
      isGenerating: false,
      maxRounds: 5,
    });
    setCurrentQuestion(null);
    setLoading(false);
    setError(null);
    setSummary(null);
    setModel(APP_CONFIG.DEFAULT_MODEL);
  }, []);

  return {
    context,
    currentQuestion,
    loading,
    error,
    summary,
    startConversation,
    answerQuestion,
    skipQuestion,
    finishConversation,
    reset,
  };
}
