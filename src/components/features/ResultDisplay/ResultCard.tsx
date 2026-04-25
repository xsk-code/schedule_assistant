import { useState } from 'react';
import type { AnalysisResult, DimensionAnalysis, JiDimensionAnalysis } from '../../../types';
import { SIHUA_DIMENSION_NAMES, SIHUA_DIMENSION_MEANINGS } from '../../../constants/sihuaRules';

interface ResultCardProps {
  result: AnalysisResult;
  onToggleStep?: (stepIndex: number) => void;
  showActions?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onToggleStep,
  showActions = true,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
    onToggleStep?.(index);
  };

  const renderDimensionAnalysis = (
    key: 'lu' | 'quan' | 'ke',
    data: DimensionAnalysis
  ) => {
    return (
      <div key={key} className={`result-dimension result-dimension--${key}`}>
        <div className="result-dimension-header">
          <div className="result-dimension-title">
            <span className="result-dimension-name">{data.star}</span>
            <span className="result-dimension-meaning">{SIHUA_DIMENSION_MEANINGS[key]}</span>
          </div>
        </div>
        <span className="result-dimension-analysis">{data.analysis}</span>
        {data.actions.length > 0 && (
          <div className="result-dimension-actions">
            {data.actions.map((action, idx) => (
              <div key={idx} className="result-dimension-action">
                <div className="result-dimension-action-dot" />
                <span className="result-dimension-action-text">{action}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderJiAnalysis = (data: JiDimensionAnalysis) => {
    return (
      <div className="result-dimension result-dimension--ji">
        <div className="result-dimension-header">
          <div className="result-dimension-title">
            <span className="result-dimension-name">{data.star}</span>
            <span className="result-dimension-meaning">{SIHUA_DIMENSION_MEANINGS.ji}</span>
          </div>
        </div>
        <span className="result-dimension-analysis">{data.analysis}</span>

        {data.warnings.length > 0 && (
          <div className="result-dimension-section">
            <div className="result-dimension-section-title">
              <span>⚠</span>
              <span>注意事项</span>
            </div>
            {data.warnings.map((warning, idx) => (
              <div key={idx} className="result-dimension-warning">
                <span className="result-dimension-warning-text">{warning}</span>
              </div>
            ))}
          </div>
        )}

        {data.avoid.length > 0 && (
          <div className="result-dimension-section">
            <div className="result-dimension-section-title">
              <span>✕</span>
              <span>建议避免</span>
            </div>
            {data.avoid.map((item, idx) => (
              <div key={idx} className="result-dimension-avoid">
                <span className="result-dimension-avoid-text">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getDimensionColor = (dimension: string) => {
    switch (dimension) {
      case 'lu': return '#5E8B6A';
      case 'quan': return '#B8944C';
      case 'ke': return '#6B8FAB';
      case 'ji': return '#B46A5E';
      default: return '#B5A99A';
    }
  };

  return (
    <div className="result-card">
      <div className="result-summary">
        <span className="result-summary-label">今日待办</span>
        <div className="result-summary-decoration" />
        <span className="result-summary-text">{result.summary}</span>
      </div>

      {showActions && result.actionPath.length > 0 && (
        <div className="result-actions">
          {result.actionPath.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            return (
              <div
                key={step.step}
                className={`action-step ${isCompleted ? 'action-step--completed' : ''}`}
                onClick={() => toggleStep(index)}
              >
                <button
                  className="action-step-checkbox"
                  style={{
                    borderColor: isCompleted ? undefined : getDimensionColor(step.dimension)
                  }}
                >
                  {isCompleted && (
                    <span className="action-step-checkbox-icon">✓</span>
                  )}
                </button>

                <div className="action-step-content">
                  <div className="action-step-header">
                    <span className="action-step-title">{step.title}</span>
                    <div className="action-step-meta">
                      <div className="action-step-tag action-step-tag--dimension">
                        <span className="action-step-tag-text">{SIHUA_DIMENSION_NAMES[step.dimension as keyof typeof SIHUA_DIMENSION_NAMES]}</span>
                      </div>
                      <div className="action-step-tag">
                        <span className="action-step-tag-text">{step.priority}优</span>
                      </div>
                      <div className="action-step-tag">
                        <span className="action-step-tag-text">{step.timeEstimate}</span>
                      </div>
                    </div>
                  </div>

                  {step.description && (
                    <span className="action-step-description">{step.description}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {result.bestEntry && (
        <div className="result-best-entry">
          <div className="result-best-entry-label">
            <div className="result-best-entry-seal" />
            <span>最佳切入点</span>
          </div>
          <div className="result-best-entry-content">
            <span className="result-best-entry-reason">{result.bestEntry.reason}</span>
            <span className="result-best-entry-suggestion">{result.bestEntry.suggestion}</span>
          </div>
        </div>
      )}

      <div className="result-dimensions">
        <span className="result-dimensions-title">四化深解</span>

        {renderDimensionAnalysis('lu', result.fourDimensions.lu)}
        {renderDimensionAnalysis('quan', result.fourDimensions.quan)}
        {renderDimensionAnalysis('ke', result.fourDimensions.ke)}
        {renderJiAnalysis(result.fourDimensions.ji)}
      </div>

      {result.overallAdvice && (
        <div className="result-overall">
          <div className="result-overall-label">
            <span>💡</span>
            <span>整体建议</span>
          </div>
          <span className="result-overall-text">{result.overallAdvice}</span>
        </div>
      )}
    </div>
  );
};

export { ResultCard };
