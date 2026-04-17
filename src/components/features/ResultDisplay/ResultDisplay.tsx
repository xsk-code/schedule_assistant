import { useState } from 'react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import type { AnalysisResult } from '../../../types';

interface ResultDisplayProps {
  result: AnalysisResult;
  onCopy?: () => void;
  onSave?: () => void;
  onReanalyze?: () => void;
}

const DIMENSION_INFO = {
  lu: { icon: '🟢', label: '禄', name: '机遇与资源', color: 'emerald' },
  quan: { icon: '🟠', label: '权', name: '执行与决断', color: 'amber' },
  ke: { icon: '🔵', label: '科', name: '计划与学习', color: 'blue' },
  ji: { icon: '🔴', label: '忌', name: '风险与注意', color: 'red' },
};

export function ResultDisplay({ result, onCopy, onSave, onReanalyze }: ResultDisplayProps) {
  const [expandedDimensions, setExpandedDimensions] = useState<Set<string>>(new Set(['lu']));

  const toggleDimension = (dim: string) => {
    setExpandedDimensions(prev => {
      const next = new Set(prev);
      if (next.has(dim)) {
        next.delete(dim);
      } else {
        next.add(dim);
      }
      return next;
    });
  };

  const bestEntryDim = DIMENSION_INFO[result.bestEntry.dimension];

  return (
    <div className="space-y-6 w-full">
      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          今日最佳切入点
        </h2>
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{bestEntryDim.icon}</span>
            <span className="font-semibold text-indigo-800">
              【{bestEntryDim.label}维度】{result.bestEntry.suggestion}
            </span>
          </div>
          <p className="text-indigo-700 text-sm">{result.bestEntry.reason}</p>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🌈</span>
          四维深度分析
        </h2>
        <div className="space-y-3">
          {(['lu', 'quan', 'ke', 'ji'] as const).map((dim) => {
            const info = DIMENSION_INFO[dim];
            const data = result.fourDimensions[dim];
            const isExpanded = expandedDimensions.has(dim);

            return (
              <div
                key={dim}
                className={`border rounded-lg overflow-hidden transition-colors`}
              >
                <button
                  onClick={() => toggleDimension(dim)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{info.icon}</span>
                    <span className="font-semibold text-gray-800">
                      {info.label}：{info.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({data.star})
                    </span>
                  </div>
                  <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 bg-gray-50 border-t">
                    <p className="text-gray-700 mb-3">{data.analysis}</p>

                    {dim === 'ji' ? (
                      <>
                        <div className="mb-3">
                          <p className="font-medium text-red-700 mb-1">⚠️ 注意事项：</p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {(data as any).warnings?.map((warning: string, idx: number) => (
                              <li key={idx}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-red-700 mb-1">❌ 建议避免：</p>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {(data as any).avoid?.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-700 mb-1">✅ 行动：</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {(data as any).actions?.map((action: string, idx: number) => (
                            <li key={idx}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          最小行动路径
        </h2>
        <div className="space-y-4">
          {result.actionPath.map((step, index) => {
            const dimInfo = DIMENSION_INFO[step.dimension];
            const isLast = index === result.actionPath.length - 1;

            return (
              <div key={step.step} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      step.dimension === 'lu' ? 'bg-emerald-500' :
                      step.dimension === 'quan' ? 'bg-amber-500' :
                      step.dimension === 'ke' ? 'bg-blue-500' :
                      'bg-red-500'
                    }`}>
                      {step.step}
                    </div>
                    {!isLast && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                    )}
                  </div>

                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{dimInfo.icon}</span>
                      <span className="font-semibold text-gray-800">{step.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        step.priority === '高' ? 'bg-red-100 text-red-700' :
                        step.priority === '中' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {step.priority}优
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{step.description}</p>
                    <p className="text-xs text-gray-400">⏱️ {step.timeEstimate}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          综合建议
        </h2>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">{result.overallAdvice}</p>
        </div>
      </Card>

      <div className="flex flex-wrap justify-center gap-3">
        {onReanalyze && (
          <Button variant="secondary" onClick={onReanalyze}>
            🔄 重新分析
          </Button>
        )}
        {onSave && (
          <Button variant="secondary" onClick={onSave}>
            💾 保存记录
          </Button>
        )}
        {onCopy && (
          <Button onClick={onCopy}>
            📋 复制结果
          </Button>
        )}
      </div>
    </div>
  );
}
