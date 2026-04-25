import { useState, useCallback } from 'react';
import { analyzeTask } from '../services/aiService';
import type { SihuaInfo, AnalysisResult, CollectedItem } from '../types';

export function useAIAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (
    task: string,
    sihuaInfo: SihuaInfo,
    model?: string,
    collectedInfo: CollectedItem[] = []
  ) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeTask(task, sihuaInfo, model, collectedInfo);
      setResult(analysisResult);
      return analysisResult;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '分析失败';
      setError(errorMessage);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    loading,
    error,
    analyze,
    clearResult,
  };
}
