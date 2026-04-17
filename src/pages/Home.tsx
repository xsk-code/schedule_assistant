import { useState, useEffect } from 'react';
import { SihuaCard } from '../components/features/SihuaCard/SihuaCard';
import { TaskInput } from '../components/features/TaskInput/TaskInput';
import { ResultDisplay } from '../components/features/ResultDisplay/ResultDisplay';
import { Loading } from '../components/common/Loading';
import { useSihua } from '../hooks/useSihua';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import type { HistoryRecord } from '../types';

interface HomePageProps {
  apiKey: string;
  model?: string;
  onSaveHistory: (record: HistoryRecord) => void;
  initialTask?: string | null;
  onClearReuseTask?: () => void;
}

export function HomePage({ apiKey, model, onSaveHistory, initialTask, onClearReuseTask }: HomePageProps) {
  const { sihuaInfo, loading: sihuaLoading, error: sihuaError } = useSihua();
  const { result, loading: analysisLoading, error: analysisError, analyze, clearResult } = useAIAnalysis();
  const [currentTask, setCurrentTask] = useState('');

  useEffect(() => {
    if (initialTask) {
      setCurrentTask(initialTask);
    }
  }, [initialTask]);

  const handleAnalyze = async (task: string) => {
    if (!sihuaInfo) return;
    if (!apiKey.trim()) {
      alert('请先在设置中配置 API Key');
      return;
    }

    setCurrentTask(task);
    try {
      await analyze(task, sihuaInfo, apiKey, model);
    } catch {
    }
  };

  const handleSave = () => {
    if (!result || !sihuaInfo) return;

    const record: HistoryRecord = {
      id: Date.now().toString(),
      task: currentTask,
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
      result,
    };

    onSaveHistory(record);
    alert('已保存到历史记录');
  };

  const handleCopy = () => {
    if (!result) return;
    const text = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      alert('已复制到剪贴板');
    }).catch(() => {
      alert('复制失败，请手动复制');
    });
  };

  const handleReanalyze = () => {
    clearResult();
    if (onClearReuseTask) {
      onClearReuseTask();
    }
  };

  return (
    <div className="space-y-8">
      <SihuaCard
        sihuaInfo={sihuaInfo}
        loading={sihuaLoading}
        error={sihuaError}
      />

      {!result ? (
        <>
          <TaskInput
            onSubmit={handleAnalyze}
            loading={analysisLoading}
            disabled={!sihuaInfo}
            initialValue={initialTask || undefined}
          />

          {analysisError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">❌ {analysisError}</p>
            </div>
          )}

          {!apiKey.trim() && sihuaInfo && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-700">
                ⚠️ 请先在 <strong>设置</strong> 中配置 API Key 才能开始分析
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              🔮 分析结果
            </h2>
            <p className="text-sm text-gray-500 truncate max-w-lg mx-auto">
              任务：{currentTask}
            </p>
          </div>

          <ResultDisplay
            result={result}
            onCopy={handleCopy}
            onSave={handleSave}
            onReanalyze={handleReanalyze}
          />
        </>
      )}

      {analysisLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-xl">
            <Loading size="lg" text="AI 正在分析您的任务，请稍候..." />
          </div>
        </div>
      )}
    </div>
  );
}
