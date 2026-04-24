import { useState } from 'react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import type { AnalysisResult, ActionStep } from '../../../types';

interface ResultDisplayProps {
  result: AnalysisResult;
  onCopy?: () => void;
  onSave?: () => void;
  onReanalyze?: () => void;
}

const PRIORITY_LABELS: Record<string, string> = {
  '高': '高优',
  '中': '中优',
  '低': '低优',
};

const DIMENSION_META = {
  lu: { label: '化禄', color: 'emerald' },
  quan: { label: '化权', color: 'amber' },
  ke: { label: '化科', color: 'blue' },
  ji: { label: '化忌', color: 'red' },
} as const;

const DIMENSION_STYLES = {
  emerald: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  amber: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  blue: { dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  red: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};

function TodoItem({
  step,
  completed,
  onToggle,
}: {
  step: ActionStep;
  completed: boolean;
  onToggle: () => void;
}) {
  const isJi = step.dimension === 'ji';

  return (
    <div
      className={`flex items-start gap-3 py-3 ${
        completed ? 'opacity-50' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          completed
            ? 'bg-stone-800 border-stone-800'
            : 'border-stone-300 hover:border-stone-500'
        }`}
      >
        {completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium text-stone-800 leading-snug ${completed ? 'line-through' : ''}`}>
          {step.title}
        </p>
        <p className={`text-sm text-stone-500 mt-0.5 leading-relaxed ${completed ? 'line-through' : ''}`}>
          {step.description}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isJi
                ? 'bg-red-50 text-red-600'
                : step.priority === '高'
                ? 'bg-stone-100 text-stone-600'
                : step.priority === '中'
                ? 'bg-stone-50 text-stone-500'
                : 'bg-stone-50 text-stone-400'
            }`}
          >
            {isJi ? '提醒' : PRIORITY_LABELS[step.priority] || step.priority}
          </span>
          {!isJi && step.timeEstimate && (
            <span className="text-xs text-stone-400">{step.timeEstimate}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SihuaInsight({ result }: { result: AnalysisResult }) {
  const [expanded, setExpanded] = useState(false);
  const [detailDim, setDetailDim] = useState<string | null>(null);

  const dimensions = (['lu', 'quan', 'ke', 'ji'] as const).map((dim) => {
    const meta = DIMENSION_META[dim];
    const styles = DIMENSION_STYLES[meta.color];
    const data = result.fourDimensions[dim];
    return { dim, meta, styles, data };
  });

  return (
    <Card padding="none" className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
      >
        <span className="text-sm text-stone-500">为什么这样安排？</span>
        <span
          className={`text-stone-400 text-xs transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-stone-100">
          <div className="space-y-3 mt-4">
            {dimensions.map(({ dim, meta, styles, data }) => (
              <div key={dim}>
                <button
                  onClick={() => setDetailDim(detailDim === dim ? null : dim)}
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} mt-1.5 flex-shrink-0`} />
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${styles.text}`}>
                        {meta.label}{data.star}
                      </span>
                      <p className="text-sm text-stone-600 mt-0.5 leading-relaxed">
                        {data.analysis}
                      </p>
                    </div>
                  </div>
                </button>

                {detailDim === dim && (
                  <div className={`mt-2 ml-4 p-3 rounded-lg ${styles.bg} ${styles.border} border`}>
                    {dim === 'ji' ? (
                      <div className="space-y-2">
                        {(data as any).warnings?.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-red-600 mb-1">注意事项</p>
                            <ul className="space-y-1">
                              {(data as any).warnings.map((w: string, i: number) => (
                                <li key={i} className="text-xs text-stone-600">— {w}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {(data as any).avoid?.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-red-500 mb-1">建议避免</p>
                            <ul className="space-y-1">
                              {(data as any).avoid.map((a: string, i: number) => (
                                <li key={i} className="text-xs text-stone-600">× {a}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      (data as any).actions?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-stone-600 mb-1">行动建议</p>
                          <ul className="space-y-1">
                            {(data as any).actions.map((a: string, i: number) => (
                              <li key={i} className="text-xs text-stone-600">→ {a}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export function ResultDisplay({ result, onCopy, onSave, onReanalyze }: ResultDisplayProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (step: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(step)) {
        next.delete(step);
      } else {
        next.add(step);
      }
      return next;
    });
  };

  const todoItems = result.actionPath;
  const normalItems = todoItems.filter((s) => s.dimension !== 'ji');
  const reminderItems = todoItems.filter((s) => s.dimension === 'ji');

  return (
    <div className="space-y-6 w-full">
      <Card className="animate-scale-in" padding="lg">
        <h3 className="text-display text-xl font-semibold text-stone-800 mb-3">
          今日待办
        </h3>
        <p className="text-sm text-stone-400 mb-6 leading-relaxed">
          {result.summary}
        </p>

        <div className="divide-y divide-stone-100">
          {normalItems.map((step) => (
            <TodoItem
              key={step.step}
              step={step}
              completed={completedSteps.has(step.step)}
              onToggle={() => toggleStep(step.step)}
            />
          ))}
          {reminderItems.length > 0 && (
            <>
              <div className="py-4">
                <span className="text-xs text-stone-400 font-medium">提醒</span>
              </div>
              {reminderItems.map((step) => (
                <TodoItem
                  key={step.step}
                  step={step}
                  completed={completedSteps.has(step.step)}
                  onToggle={() => toggleStep(step.step)}
                />
              ))}
            </>
          )}
        </div>
      </Card>

      <div className="animate-slide-up">
        <SihuaInsight result={result} />
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-2">
        {onReanalyze && (
          <Button variant="secondary" onClick={onReanalyze}>
            重新分析
          </Button>
        )}
        {onSave && (
          <Button variant="secondary" onClick={onSave}>
            归档案卷
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
