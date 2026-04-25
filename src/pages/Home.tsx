import { useState, useEffect } from 'react';
import { SihuaBar } from '../components/features/SihuaCard/SihuaBar';
import { TaskInput } from '../components/features/TaskInput/TaskInput';
import { ResultCard } from '../components/features/ResultDisplay/ResultCard';
import { Loading } from '../components/common/Loading';
import { Empty } from '../components/common/Empty';
import { useSihua } from '../hooks/useSihua';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import type { HistoryRecord, CollectedItem } from '../types';

interface HomePageProps {
  apiKey: string;
  model?: string;
  onSaveHistory: (record: HistoryRecord) => void;
  initialTask?: string | null;
  onClearReuseTask?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function HomePage({ apiKey, model, onSaveHistory, initialTask, onClearReuseTask, onLoadingChange }: HomePageProps) {
  const { sihuaInfo, loading: sihuaLoading } = useSihua();
  const { result, loading: analysisLoading, error: analysisError, analyze, clearResult } = useAIAnalysis();
  const [currentTask, setCurrentTask] = useState('');
  const [, setCollectedInfo] = useState<CollectedItem[]>([]);

  useEffect(() => {
    if (initialTask) {
      setCurrentTask(initialTask);
    }
  }, [initialTask]);

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(analysisLoading);
    }
  }, [analysisLoading, onLoadingChange]);

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
    alert('案卷已归档');
  };

  const handleReanalyze = () => {
    clearResult();
    if (onClearReuseTask) {
      onClearReuseTask();
    }
  };

  const renderContent = () => {
    if (analysisLoading) {
      return (
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <Loading message="正在分析任务..." />
        </div>
      );
    }

    if (analysisError) {
      return (
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <div style={{
            backgroundColor: 'var(--color-vermilion-light)',
            border: '1px solid var(--color-ji)',
            borderRadius: 10,
            padding: 16,
          }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ji)', marginBottom: 6, fontFamily: '"PingFang SC", sans-serif' }}>
              分析失败
            </p>
            <p style={{ fontSize: 13, color: 'var(--color-ink-2)', lineHeight: 1.8, fontFamily: '"Noto Serif SC", Georgia, serif' }}>
              {analysisError}
            </p>
          </div>
        </div>
      );
    }

    if (result) {
      return (
        <div>
          <ResultCard
            result={result}
            showActions={true}
          />

          <div className="home-actions">
            <button className="btn-secondary btn-secondary--primary" onClick={handleSave}>
              归档案卷
            </button>
            <button className="btn-secondary" onClick={handleReanalyze}>
              新的分析
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: '0 20px', marginBottom: 20 }}>
        <Empty
          title="输入您的任务"
          description="别蛮干将根据今日四化能量，帮你找到最省力的行动路径"
        />
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingBottom: 20 }}>
      <div style={{ padding: '48px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <span style={{
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--color-ink-1)',
          marginBottom: 8,
          fontFamily: '"Noto Serif SC", Georgia, "PingFang SC", serif',
          letterSpacing: '0.02em',
          display: 'block',
        }}>
          别蛮干
        </span>
        <span style={{
          fontSize: 12,
          color: 'var(--color-ink-4)',
          lineHeight: 1.6,
          fontFamily: '"PingFang SC", sans-serif',
        }}>
          找对方向再出手
        </span>
      </div>

      {sihuaInfo && <SihuaBar sihuaInfo={sihuaInfo} />}
      {sihuaLoading && (
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <Loading message="正在加载四化信息…" />
        </div>
      )}

      {!apiKey.trim() && sihuaInfo && (
        <div style={{ padding: '0 20px', marginBottom: 12 }}>
          <div style={{
            backgroundColor: 'var(--color-vermilion-light)',
            border: '1px dashed var(--color-ji)',
            borderRadius: 10,
            padding: 12,
          }}>
            <span style={{ fontSize: 13, color: 'var(--color-ji)', fontFamily: '"PingFang SC", sans-serif' }}>
              请先在「我的」中配置 API Key 才能开始分析
            </span>
          </div>
        </div>
      )}

      <TaskInput
        onSubmit={(task) => handleAnalyze(task)}
        onThinkingComplete={handleThinkingComplete}
        loading={analysisLoading}
        disabled={!sihuaInfo}
        initialValue={initialTask || undefined}
        apiKey={apiKey}
        model={model}
      />

      {renderContent()}
    </div>
  );
}
