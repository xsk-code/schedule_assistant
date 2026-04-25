import { useState, useEffect } from 'react';
import { SihuaBar } from '../components/features/SihuaCard/SihuaBar';
import { TaskInput } from '../components/features/TaskInput/TaskInput';
import { ResultCard } from '../components/features/ResultDisplay/ResultCard';
import { Loading } from '../components/common/Loading';
import { Empty } from '../components/common/Empty';
import { useSihua } from '../hooks/useSihua';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import { testApiKey } from '../services/aiService';
import { AVAILABLE_MODELS } from '../constants/appConfig';
import type { HistoryRecord, CollectedItem } from '../types';

interface HomePageProps {
  apiKey: string;
  model?: string;
  onSaveApiKey: (key: string) => void;
  onClearApiKey: () => void;
  onSaveModel: (model: string) => void;
  onSaveHistory: (record: HistoryRecord) => void;
  initialTask?: string | null;
  onClearReuseTask?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function HomePage({ apiKey, model, onSaveApiKey, onClearApiKey, onSaveModel, onSaveHistory, initialTask, onClearReuseTask, onLoadingChange }: HomePageProps) {
  const { sihuaInfo, loading: sihuaLoading } = useSihua();
  const { result, loading: analysisLoading, error: analysisError, analyze, clearResult } = useAIAnalysis();
  const [currentTask, setCurrentTask] = useState('');
  const [, setCollectedInfo] = useState<CollectedItem[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsApiKey, setSettingsApiKey] = useState(apiKey);
  const [settingsModel, setSettingsModel] = useState(model || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

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

  useEffect(() => {
    setSettingsApiKey(apiKey);
  }, [apiKey]);

  useEffect(() => {
    setSettingsModel(model || '');
  }, [model]);

  const handleAnalyze = async (task: string, info: CollectedItem[] = []) => {
    if (!sihuaInfo) return;
    if (!apiKey.trim()) {
      setShowSettings(true);
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

  const handleTestApiKey = async () => {
    if (!settingsApiKey.trim()) {
      setTestResult({ success: false, message: '请输入 API Key' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const valid = await testApiKey(settingsApiKey.trim());
      if (valid) {
        setTestResult({ success: true, message: 'API Key 有效' });
      } else {
        setTestResult({ success: false, message: 'API Key 无效' });
      }
    } catch {
      setTestResult({ success: false, message: '网络错误，请稍后重试' });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveSettings = () => {
    if (settingsApiKey.trim()) {
      onSaveApiKey(settingsApiKey.trim());
    }
    onSaveModel(settingsModel);
    setTestResult({ success: true, message: '已保存设置' });
    setTimeout(() => {
      setShowSettings(false);
      setTestResult(null);
    }, 800);
  };

  const handleClearApiKey = () => {
    setSettingsApiKey('');
    onClearApiKey();
    setTestResult(null);
  };

  const renderSettingsModal = () => {
    if (!showSettings) return null;

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(44, 36, 32, 0.4)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 100,
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowSettings(false);
            setTestResult(null);
          }
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-bg)',
            borderRadius: '16px 16px 0 0',
            padding: '24px 20px',
            paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
            maxWidth: 500,
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--color-ink-1)',
              fontFamily: '"Noto Serif SC", Georgia, serif',
            }}>
              设置
            </span>
            <button
              onClick={() => { setShowSettings(false); setTestResult(null); }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 18,
                color: 'var(--color-ink-4)',
                padding: 4,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: 16 }}>
            <span style={{
              fontSize: 12,
              color: 'var(--color-ink-4)',
              display: 'block',
              marginBottom: 8,
              fontFamily: '"Noto Serif SC", Georgia, serif',
            }}>
              API Key
            </span>
            <input
              type="password"
              value={settingsApiKey}
              onChange={(e) => setSettingsApiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px dashed var(--color-ink-5)',
                borderRadius: 8,
                backgroundColor: 'var(--color-bg-warm)',
                fontSize: 13,
                color: 'var(--color-ink-1)',
                outline: 'none',
                fontFamily: '"PingFang SC", sans-serif',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <span style={{
              fontSize: 12,
              color: 'var(--color-ink-4)',
              display: 'block',
              marginBottom: 8,
              fontFamily: '"Noto Serif SC", Georgia, serif',
            }}>
              模型
            </span>
            <select
              value={settingsModel}
              onChange={(e) => setSettingsModel(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px dashed var(--color-ink-5)',
                borderRadius: 8,
                backgroundColor: 'var(--color-bg-warm)',
                fontSize: 13,
                color: 'var(--color-ink-1)',
                outline: 'none',
                fontFamily: '"PingFang SC", sans-serif',
                boxSizing: 'border-box',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {testResult && (
            <div style={{
              padding: '8px 12px',
              borderRadius: 8,
              marginBottom: 12,
              fontSize: 12,
              backgroundColor: testResult.success ? 'var(--color-lu)' : 'var(--color-ji)',
              color: 'var(--color-bg)',
              fontFamily: '"PingFang SC", sans-serif',
              opacity: 0.9,
            }}>
              {testResult.message}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button
              className="btn-secondary"
              onClick={handleTestApiKey}
              disabled={testing}
              style={{ flex: 1, fontSize: 13, padding: '10px' }}
            >
              {testing ? '测试中…' : '测试连接'}
            </button>
            <button
              className="btn-primary"
              onClick={handleSaveSettings}
              style={{ flex: 1, fontSize: 13, padding: '10px' }}
            >
              保存
            </button>
            {apiKey && (
              <button
                className="btn-secondary"
                onClick={handleClearApiKey}
                style={{ fontSize: 13, padding: '10px 16px', color: 'var(--color-ji)' }}
              >
                清除
              </button>
            )}
          </div>

          <div style={{
            padding: 12,
            borderRadius: 8,
            backgroundColor: 'var(--color-bg-warm)',
            border: '1px dashed var(--color-ink-5)',
          }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-ink-2)', display: 'block', marginBottom: 4, fontFamily: '"PingFang SC", sans-serif' }}>
              如何获取 API Key？
            </span>
            <ol style={{ fontSize: 11, color: 'var(--color-ink-3)', paddingLeft: 16, margin: 0, lineHeight: 1.8, fontFamily: '"PingFang SC", sans-serif' }}>
              <li>访问 <a href="https://siliconflow.cn" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-vermilion)' }}>siliconflow.cn</a></li>
              <li>注册/登录账号</li>
              <li>在控制台创建 API Key</li>
            </ol>
          </div>
        </div>
      </div>
    );
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
      <div style={{ padding: '48px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            position: 'absolute',
            right: 20,
            top: 48,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={apiKey.trim() ? 'var(--color-ink-4)' : 'var(--color-ji)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
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
          <div
            style={{
              backgroundColor: 'var(--color-vermilion-light)',
              border: '1px dashed var(--color-ji)',
              borderRadius: 10,
              padding: 12,
              cursor: 'pointer',
            }}
            onClick={() => setShowSettings(true)}
          >
            <span style={{ fontSize: 13, color: 'var(--color-ji)', fontFamily: '"PingFang SC", sans-serif' }}>
              点击右上角 ⚙ 配置 API Key 后即可开始分析
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
      {renderSettingsModal()}
    </div>
  );
}
