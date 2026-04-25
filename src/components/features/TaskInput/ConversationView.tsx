import { Loading } from '../../common/Loading';
import type { ConversationContext, AIQuestion, CollectedItem } from '../../../types';

interface ConversationViewProps {
  context: ConversationContext;
  currentQuestion: AIQuestion | null;
  loading: boolean;
  error: string | null;
  onAnswer: (answer: string) => void;
  onSkip: () => void;
  onFinish: () => void;
  onReset: () => void;
}

function ConversationPanel({
  question,
  currentRound,
  maxRounds,
  onSelectOption,
  onSkip,
  isGenerating,
}: {
  question: AIQuestion | null;
  currentRound: number;
  maxRounds: number;
  onSelectOption: (answer: string) => void;
  onSkip: () => void;
  isGenerating: boolean;
}) {
  if (isGenerating) {
    return (
      <div className="conversation-panel">
        <Loading message="正在研读天机…" />
      </div>
    );
  }

  if (!question?.question) {
    return null;
  }

  const progress = Array.from({ length: maxRounds }, (_, i) => i + 1);

  return (
    <div className="conversation-panel">
      <div className="conversation-header">
        <div className="conversation-progress">
          <span className="conversation-progress-text">
            第 {currentRound} 轮 / 共 {maxRounds} 轮
          </span>
          <div className="conversation-progress-dots">
            {progress.map((i) => (
              <div
                key={i}
                className={`conversation-progress-dot ${i <= currentRound ? 'conversation-progress-dot--active' : ''}`}
              />
            ))}
          </div>
        </div>

        <button className="conversation-skip" onClick={onSkip}>
          <span className="conversation-skip-text">跳过 →</span>
        </button>
      </div>

      <div className="conversation-question">
        <div className="conversation-bubble">
          <span className="conversation-bubble-text">{question.question}</span>
        </div>
        {question.hint && (
          <span className="conversation-hint">想进一步了解…</span>
        )}
      </div>

      <div className="conversation-options">
        {question.options?.map((option, index) => (
          <button
            key={index}
            className="conversation-option"
            onClick={() => onSelectOption(option)}
          >
            <div className="conversation-option-dot" />
            <span className="conversation-option-text">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CollectedInfoItem({ item, index }: { item: CollectedItem; index: number }) {
  const isSkipped = item.answer.startsWith('[跳过]');

  return (
    <div style={{ padding: '8px 0', borderBottom: '1px dashed var(--color-ink-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--color-ink-4)', fontFamily: '"Noto Serif SC", Georgia, serif' }}>
          第 {index + 1} 轮
        </span>
        {isSkipped && (
          <span style={{
            fontSize: 10,
            padding: '1px 6px',
            borderRadius: 4,
            backgroundColor: 'var(--color-ink-5)',
            color: 'var(--color-ink-3)',
          }}>
            已跳过
          </span>
        )}
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink-1)', marginBottom: 2, fontFamily: '"PingFang SC", sans-serif' }}>
        {item.question}
      </p>
      <p style={{
        fontSize: 12,
        color: isSkipped ? 'var(--color-ink-4)' : 'var(--color-ink-3)',
        fontStyle: isSkipped ? 'italic' : 'normal',
        fontFamily: '"Noto Serif SC", Georgia, serif',
      }}>
        {isSkipped ? item.answer.replace('[跳过] ', '') : item.answer}
      </p>
    </div>
  );
}

function CollectedInfoSection({ items }: { items: CollectedItem[] }) {
  if (items.length === 0) return null;

  return (
    <div style={{ padding: '0 20px', marginBottom: 20 }}>
      <div style={{
        backgroundColor: 'var(--color-bg-warm)',
        border: '1px dashed var(--color-ink-5)',
        borderRadius: 10,
        padding: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--color-ink-4)', fontFamily: '"Noto Serif SC", Georgia, serif' }}>
            已收集信息 ({items.length})
          </span>
        </div>
        {items.map((item, index) => (
          <CollectedInfoItem key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

export function ConversationView({
  context,
  currentQuestion,
  loading,
  error,
  onAnswer,
  onSkip,
  onFinish,
  onReset,
}: ConversationViewProps) {
  const { originalTask, collectedInfo, currentRound, maxRounds, isComplete } = context;

  if (error) {
    return (
      <div style={{ padding: '0 20px', marginBottom: 20 }}>
        <div style={{
          backgroundColor: 'var(--color-vermilion-light)',
          border: '1px solid var(--color-ji)',
          borderRadius: 10,
          padding: 16,
        }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ji)', marginBottom: 6, fontFamily: '"PingFang SC", sans-serif' }}>
            出错了
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-ink-2)', lineHeight: 1.8, fontFamily: '"Noto Serif SC", Georgia, serif', whiteSpace: 'pre-line' }}>
            {error}
          </p>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={onReset} style={{ fontSize: 13, padding: '8px 16px' }}>
              重新开始
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div style={{ padding: '0 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secondary" onClick={onReset} style={{ flex: 1 }}>
            重新开始
          </button>
          <button className="btn-secondary btn-secondary--primary" onClick={onFinish} style={{ flex: 1 }}>
            生成方案
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {originalTask && (
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <div style={{
            backgroundColor: 'var(--color-bg-warm)',
            border: '1px dashed var(--color-ink-5)',
            borderRadius: 10,
            padding: 12,
          }}>
            <span style={{ fontSize: 11, color: 'var(--color-ink-4)', fontFamily: '"Noto Serif SC", Georgia, serif', display: 'block', marginBottom: 4 }}>
              原始任务
            </span>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-ink-1)', lineHeight: 1.6, fontFamily: '"PingFang SC", sans-serif' }}>
              {originalTask}
            </p>
          </div>
        </div>
      )}

      {collectedInfo.length > 0 && (
        <CollectedInfoSection items={collectedInfo} />
      )}

      {!isComplete && (
        <button
          className="conversation-skip"
          onClick={onFinish}
          style={{ margin: '0 20px 16px auto', display: 'block' }}
        >
          <span className="conversation-skip-text">结束并生成 →</span>
        </button>
      )}

      <ConversationPanel
        question={currentQuestion}
        currentRound={currentRound}
        maxRounds={maxRounds}
        onSelectOption={onAnswer}
        onSkip={onSkip}
        isGenerating={loading}
      />
    </div>
  );
}
