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
  lu: { label: '禄', name: '机遇与资源', color: 'emerald', symbol: '◆', gradient: 'from-emerald-50 to-emerald-100' },
  quan: { label: '权', name: '执行与决断', color: 'amber', symbol: '◇', gradient: 'from-amber-50 to-amber-100' },
  ke: { label: '科', name: '计划与学习', color: 'blue', symbol: '◆', gradient: 'from-blue-50 to-blue-100' },
  ji: { label: '忌', name: '风险与注意', color: 'red', symbol: '◇', gradient: 'from-red-50 to-red-100' },
};

const DIMENSION_COLORS = {
  emerald: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    light: 'bg-emerald-50',
  },
  amber: {
    bg: 'bg-amber-600',
    text: 'text-amber-700',
    border: 'border-amber-200',
    light: 'bg-amber-50',
  },
  blue: {
    bg: 'bg-blue-600',
    text: 'text-blue-700',
    border: 'border-blue-200',
    light: 'bg-blue-50',
  },
  red: {
    bg: 'bg-red-600',
    text: 'text-red-700',
    border: 'border-red-200',
    light: 'bg-red-50',
  },
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
  const bestEntryColors = DIMENSION_COLORS[bestEntryDim.color as keyof typeof DIMENSION_COLORS];

  return (
    <div className="space-y-6 w-full">
      <Card className="animate-scale-in overflow-hidden" padding="none">
        <div className={`bg-gradient-to-r ${bestEntryDim.gradient} p-6`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 ${bestEntryColors.bg} rounded-xl flex items-center justify-center text-white text-xl font-bold`}>
              {bestEntryDim.symbol}
            </div>
            <div>
              <p className="text-sm text-stone-500 mb-0.5">今日最佳切入点</p>
              <h3 className={`text-display text-xl font-bold ${bestEntryColors.text}`}>
                {bestEntryDim.label}维度
              </h3>
            </div>
          </div>
          
          <div className={`${bestEntryColors.light} rounded-xl p-4 mt-2`}>
            <p className="font-semibold text-stone-800 mb-1">{result.bestEntry.suggestion}</p>
            <p className="text-sm text-stone-600 leading-relaxed">{result.bestEntry.reason}</p>
          </div>
        </div>
      </Card>

      <Card className="animate-slide-up" padding="lg">
        <h3 className="text-display text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <span className="text-stone-400">四维深度分析</span>
        </h3>
        
        <div className="space-y-3">
          {(['lu', 'quan', 'ke', 'ji'] as const).map((dim) => {
            const info = DIMENSION_INFO[dim];
            const colors = DIMENSION_COLORS[info.color as keyof typeof DIMENSION_COLORS];
            const data = result.fourDimensions[dim];
            const isExpanded = expandedDimensions.has(dim);

            return (
              <div
                key={dim}
                className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                  isExpanded ? `${colors.border} shadow-sm` : 'border-stone-200'
                }`}
              >
                <button
                  onClick={() => toggleDimension(dim)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                      {info.symbol}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-800">{info.label}</span>
                        <span className="text-sm text-stone-500">·</span>
                        <span className="text-sm text-stone-600">{info.name}</span>
                      </div>
                      <p className={`text-sm ${colors.text} font-medium`}>{data.star}</p>
                    </div>
                  </div>
                  <span className={`text-stone-400 text-sm transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </button>

                {isExpanded && (
                  <div className={`px-5 pb-5 pt-3 ${colors.light} border-t-2 ${colors.border}`}>
                    <p className="text-stone-700 leading-relaxed mb-4">{data.analysis}</p>

                    {dim === 'ji' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium text-red-700 mb-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            注意事项
                          </p>
                          <ul className="space-y-1.5">
                            {(data as any).warnings?.map((warning: string, idx: number) => (
                              <li key={idx} className="text-sm text-stone-600 flex items-start gap-2">
                                <span className="text-red-400 mt-1">—</span>
                                {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-red-700 mb-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            建议避免
                          </p>
                          <ul className="space-y-1.5">
                            {(data as any).avoid?.map((item: string, idx: number) => (
                              <li key={idx} className="text-sm text-stone-600 flex items-start gap-2">
                                <span className="text-red-300 mt-1">×</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-stone-700 mb-2 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.bg.replace('bg-', 'bg-').replace('-600', '-500')}`} />
                          行动建议
                        </p>
                        <ul className="space-y-1.5">
                          {(data as any).actions?.map((action: string, idx: number) => (
                            <li key={idx} className="text-sm text-stone-600 flex items-start gap-2">
                              <span className={`${colors.text} mt-0.5`}>→</span>
                              {action}
                            </li>
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

      <Card className="animate-slide-up" padding="lg">
        <h3 className="text-display text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <span className="text-stone-400">最小行动路径</span>
        </h3>
        
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-stone-200" />
          
          <div className="space-y-4">
            {result.actionPath.map((step, index) => {
              const dimInfo = DIMENSION_INFO[step.dimension];
              const dimColors = DIMENSION_COLORS[dimInfo.color as keyof typeof DIMENSION_COLORS];
              const isLast = index === result.actionPath.length - 1;

              return (
                <div key={step.step} className="relative flex items-start gap-5 pl-1">
                  <div className={`relative z-10 w-10 h-10 rounded-full ${dimColors.bg} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                    {step.step}
                  </div>
                  
                  <div className={`flex-1 pb-6 ${!isLast ? 'border-b border-dashed border-stone-200' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold ${dimColors.text}`}>{step.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${dimColors.light} ${dimColors.text} font-medium`}>
                        {step.priority}优先级
                      </span>
                    </div>
                    <p className="text-stone-600 text-sm mb-2 leading-relaxed">{step.description}</p>
                    <p className="text-xs text-stone-400 flex items-center gap-1">
                      <span className="opacity-60">⏱</span>
                      {step.timeEstimate}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="animate-slide-up" padding="lg">
        <h3 className="text-display text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <span className="text-stone-400">综合建议</span>
        </h3>
        <div className="bg-gradient-to-r from-stone-50 to-stone-100 rounded-xl p-5">
          <p className="text-stone-700 leading-relaxed text-balance">{result.overallAdvice}</p>
        </div>
      </Card>

      <div className="flex flex-wrap justify-center gap-3 pt-4">
        {onReanalyze && (
          <Button variant="secondary" onClick={onReanalyze}>
            重新分析
          </Button>
        )}
        {onSave && (
          <Button variant="secondary" onClick={onSave}>
            保存记录
          </Button>
        )}
        {onCopy && (
          <Button onClick={onCopy}>
            复制结果
          </Button>
        )}
      </div>
    </div>
  );
}