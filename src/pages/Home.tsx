import { useState, useEffect } from 'react';
import { SihuaCard } from '../components/features/SihuaCard/SihuaCard';
import { TaskInput } from '../components/features/TaskInput/TaskInput';
import { ResultDisplay } from '../components/features/ResultDisplay/ResultDisplay';
import { Loading } from '../components/common/Loading';
import { useSihua } from '../hooks/useSihua';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import type { HistoryRecord, CollectedItem } from '../types';

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
  const [, setCollectedInfo] = useState<CollectedItem[]>([]);
  const [showSihua, setShowSihua] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setCurrentTask(initialTask);
    }
  }, [initialTask]);

  const handleAnalyze = async (task: string, info: CollectedItem[] = []) => {
    if (!sihuaInfo) return;
    if (!apiKey.trim()) {
      alert('请先在设置中配置 API Key');
      return;
    }

    setCurrentTask(task);
    setCollectedInfo(info);
    try {
      await analyze(task, sihuaInfo, apiKey, model, info);
    } catch {
    }
  };

  const handleThinkingComplete = (task: string, info: CollectedItem[]) => {
    handleAnalyze(task, info);
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
      <div className="animate-slide-up">
        <TaskInput
          onSubmit={(task) => handleAnalyze(task)}
          onThinkingComplete={handleThinkingComplete}
          loading={analysisLoading}
          disabled={!sihuaInfo}
          initialValue={initialTask || undefined}
          apiKey={apiKey}
          model={model}
        />
      </div>

      {!apiKey.trim() && sihuaInfo && (
        <div className="animate-slide-up stagger-1 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-700 text-sm">
            ⚠️ 请先在 <strong>设置</strong> 中配置 API Key 才能开始分析
          </p>
        </div>
      )}

      {analysisError && (
        <div className="animate-slide-up bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 text-sm">分析失败：{analysisError}</p>
        </div>
      )}

      {!result && !analysisLoading && (
        <div className="animate-fade-in">
          <button
            onClick={() => setShowSihua(!showSihua)}
            className="w-full flex items-center justify-between px-4 py-3 bg-stone-100 hover:bg-stone-150 rounded-xl transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="text-stone-600 text-sm">今日四化能量</span>
              <span className="text-xs text-stone-400">
                {sihuaInfo?.dayGanZhi || '加载中...'}
              </span>
            </div>
            <span className={`text-stone-400 text-sm transition-transform duration-300 ${showSihua ? 'rotate-180' : ''}`}>
              ▾
            </span>
          </button>
          
          {showSihua && (
            <div className="mt-3 animate-slide-up">
              <SihuaCard
                sihuaInfo={sihuaInfo}
                loading={sihuaLoading}
                error={sihuaError}
              />
            </div>
          )}
        </div>
      )}

      {result && (
        <>
          <div className="text-center mb-4">
            <h2 className="text-display text-xl font-semibold text-stone-800">
              分析结果
            </h2>
            <p className="text-sm text-stone-500 mt-1 truncate max-w-lg mx-auto">
              {currentTask}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full mx-4 animate-scale-in">
            <Loading size="lg" text="AI 正在分析您的任务..." />
          </div>
        </div>
      )}
    </div>
  );
}