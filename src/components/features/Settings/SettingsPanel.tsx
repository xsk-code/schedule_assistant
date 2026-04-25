import { useState, useEffect } from 'react';
import { testApiKey } from '../../../services/aiService';
import { AVAILABLE_MODELS } from '../../../constants/appConfig';

interface SettingsPanelProps {
  currentApiKey: string;
  currentModel: string;
  onSaveApiKey: (key: string) => void;
  onClearApiKey: () => void;
  onSaveModel: (model: string) => void;
  historyCount?: number;
  onClearHistory?: () => void;
}

export function SettingsPanel({
  currentApiKey,
  currentModel,
  onSaveApiKey,
  onClearApiKey,
  onSaveModel,
  historyCount = 0,
  onClearHistory,
}: SettingsPanelProps) {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [model, setModel] = useState(currentModel);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  useEffect(() => {
    setApiKey(currentApiKey);
  }, [currentApiKey]);

  useEffect(() => {
    setModel(currentModel);
  }, [currentModel]);

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: '请输入 API Key' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const valid = await testApiKey(apiKey.trim());
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

  const handleSave = () => {
    if (apiKey.trim()) {
      onSaveApiKey(apiKey.trim());
    }
    onSaveModel(model);
    setTestResult({ success: true, message: '已保存设置' });
    setShowApiKeyInput(false);
  };

  const handleClear = () => {
    setApiKey('');
    onClearApiKey();
    setTestResult(null);
  };

  const handleClearHistory = () => {
    if (clearConfirm) {
      onClearHistory?.();
      setClearConfirm(false);
    } else {
      setClearConfirm(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingBottom: 20 }}>
      <div style={{ padding: '48px 20px 20px' }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--color-ink-1)',
            fontFamily: '"Noto Serif SC", Georgia, "PingFang SC", serif',
            letterSpacing: '0.02em',
          }}>
            别蛮干
          </span>
        </div>
        <span style={{
          fontSize: 12,
          color: 'var(--color-ink-4)',
          fontFamily: '"Noto Serif SC", Georgia, "PingFang SC", serif',
        }}>
          借助天时行动
        </span>
      </div>

      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--color-ink-1)',
            marginBottom: 2,
            fontFamily: '"PingFang SC", sans-serif',
          }}>
            {historyCount} 个任务
          </span>
          <span style={{
            fontSize: 12,
            color: 'var(--color-ink-4)',
            fontFamily: '"Noto Serif SC", Georgia, serif',
          }}>
            已分析
          </span>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <span style={{
          fontSize: 12,
          color: 'var(--color-ink-4)',
          padding: '0 0 8px',
          display: 'block',
          fontFamily: '"Noto Serif SC", Georgia, serif',
        }}>
          数据管理
        </span>

        <div
          className="mine-setting-item mine-setting-item--clickable"
          onClick={handleClearHistory}
        >
          <span className="mine-setting-label">
            {clearConfirm ? '确认清空？再次点击确认' : '清空历史记录'}
          </span>
          <div className="mine-setting-arrow">
            <span className="mine-setting-arrow-text">›</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <span style={{
          fontSize: 12,
          color: 'var(--color-ink-4)',
          padding: '0 0 8px',
          display: 'block',
          fontFamily: '"Noto Serif SC", Georgia, serif',
        }}>
          AI 设置
        </span>

        <div
          className="mine-setting-item mine-setting-item--clickable"
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
        >
          <span className="mine-setting-label">
            API Key {currentApiKey ? '(已配置)' : '(未配置)'}
          </span>
          <div className="mine-setting-arrow">
            <span className="mine-setting-arrow-text">›</span>
          </div>
        </div>

        {showApiKeyInput && (
          <div style={{ padding: '12px 0' }}>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
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

            <div style={{ marginTop: 8 }}>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
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
                marginTop: 8,
                fontSize: 12,
                backgroundColor: testResult.success ? 'var(--color-lu)' : 'var(--color-ji)',
                color: 'var(--color-bg)',
                fontFamily: '"PingFang SC", sans-serif',
                opacity: 0.9,
              }}>
                {testResult.message}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                className="btn-secondary"
                onClick={handleTest}
                disabled={testing}
                style={{ flex: 1, fontSize: 13, padding: '10px' }}
              >
                {testing ? '测试中…' : '测试连接'}
              </button>
              <button
                className="btn-primary"
                onClick={handleSave}
                style={{ flex: 1, fontSize: 13, padding: '10px' }}
              >
                保存
              </button>
              {currentApiKey && (
                <button
                  className="btn-secondary"
                  onClick={handleClear}
                  style={{ fontSize: 13, padding: '10px 16px', color: 'var(--color-ji)' }}
                >
                  清除
                </button>
              )}
            </div>

            <div style={{
              padding: '12px',
              borderRadius: 8,
              marginTop: 12,
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
        )}
      </div>

      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <span style={{
          fontSize: 12,
          color: 'var(--color-ink-4)',
          padding: '0 0 8px',
          display: 'block',
          fontFamily: '"Noto Serif SC", Georgia, serif',
        }}>
          关于
        </span>

        <div
          className="mine-setting-item mine-setting-item--clickable"
          onClick={() => setShowAbout(!showAbout)}
        >
          <span className="mine-setting-label">关于别蛮干</span>
          <div className="mine-setting-arrow">
            <span className="mine-setting-arrow-text">›</span>
          </div>
        </div>

        {showAbout && (
          <div style={{
            padding: '12px 0',
            fontSize: 12,
            color: 'var(--color-ink-3)',
            lineHeight: 1.8,
            fontFamily: '"Noto Serif SC", Georgia, serif',
          }}>
            <p style={{ fontWeight: 600, color: 'var(--color-ink-1)', marginBottom: 4, fontFamily: '"PingFang SC", sans-serif' }}>
              别蛮干 v1.0.0
            </p>
            <p>基于紫微斗数四化能量的 AI 任务拆分助手</p>
            <p style={{ marginTop: 4 }}>找对方向再出手——通过 AI 驱动的深度分析，帮你在对的时间做对的事。</p>
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 20px',
        gap: 4,
        marginTop: 20,
      }}>
        <span style={{ fontSize: 11, color: 'var(--color-ink-4)', fontFamily: '"Noto Serif SC", Georgia, serif' }}>
          基于四化能量理论
        </span>
        <span style={{ fontSize: 11, color: 'var(--color-ink-4)', fontFamily: '"Noto Serif SC", Georgia, serif' }}>
          AI 驱动的任务分析引擎
        </span>
      </div>
    </div>
  );
}
