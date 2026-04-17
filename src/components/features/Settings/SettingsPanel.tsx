import { useState, useEffect } from 'react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { testApiKey } from '../../../services/aiService';
import { AVAILABLE_MODELS } from '../../../constants/appConfig';

interface SettingsPanelProps {
  currentApiKey: string;
  currentModel: string;
  onSaveApiKey: (key: string) => void;
  onClearApiKey: () => void;
  onSaveModel: (model: string) => void;
}

export function SettingsPanel({ currentApiKey, currentModel, onSaveApiKey, onClearApiKey, onSaveModel }: SettingsPanelProps) {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [model, setModel] = useState(currentModel);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

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
        setTestResult({ success: true, message: '✅ API Key 有效，可以正常使用' });
      } else {
        setTestResult({ success: false, message: '❌ API Key 无效，请检查后重试' });
      }
    } catch {
      setTestResult({ success: false, message: '❌ 网络错误，请稍后重试' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    if (apiKey.trim()) {
      onSaveApiKey(apiKey.trim());
    }
    onSaveModel(model);
    setTestResult({ success: true, message: '✅ 已保存设置' });
  };

  const handleClear = () => {
    setApiKey('');
    onClearApiKey();
    setTestResult(null);
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🔑</span>
          API 设置
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              硅基流动 API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI 模型
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {AVAILABLE_MODELS.find((m) => m.value === model)?.description}
            </p>
          </div>

          {testResult && (
            <div className={`p-3 rounded-lg ${
              testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {testResult.message}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleTest} loading={testing}>
              测试连接
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
            {currentApiKey && (
              <Button variant="danger" onClick={handleClear}>
                清除
              </Button>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <p className="text-sm font-medium text-blue-800 mb-2">💡 如何获取 API Key？</p>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>访问 <a href="https://siliconflow.cn" target="_blank" rel="noopener noreferrer" className="underline">siliconflow.cn</a></li>
              <li>注册/登录账号</li>
              <li>在控制台创建 API Key</li>
            </ol>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">ℹ️</span>
          关于
        </h2>
        <div className="text-gray-600 space-y-2">
          <p><strong>四化节奏师</strong> v1.0.0</p>
          <p>基于紫微斗数四化能量的 AI 任务拆分助手</p>
          <p className="text-sm">
            通过分析用户输入的任务描述，结合当日的禄权科忌四星能量，智能地为用户提供任务的最小行动路径和个性化行动建议。
          </p>
        </div>
      </Card>
    </div>
  );
}
