import { QuestionCard } from './QuestionCard';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
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

function CollectedInfoItem({ item, index }: { item: CollectedItem; index: number }) {
  const isSkipped = item.answer.startsWith('[跳过]');
  
  return (
    <div className="py-4 border-b border-stone-100 last:border-b-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-stone-400">
          第 {index + 1} 轮
        </span>
        {isSkipped && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
            已跳过
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-stone-900 mb-1">
        {item.question}
      </p>
      <p className={`text-sm ${isSkipped ? 'text-stone-400 italic' : 'text-stone-600'}`}>
        {isSkipped ? item.answer.replace('[跳过] ', '') : item.answer}
      </p>
    </div>
  );
}

function OriginalTaskCard({ task }: { task: string }) {
  return (
    <Card padding="md" className="mb-6 bg-stone-50/50 border-stone-200">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-stone-200 flex items-center justify-center">
          <span className="text-xs">📋</span>
        </div>
        <span className="text-sm font-medium text-stone-500">原始任务</span>
      </div>
      <p className="text-base font-medium text-stone-900 leading-relaxed">
        {task}
      </p>
    </Card>
  );
}

function CollectedInfoSection({ items }: { items: CollectedItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <Card padding="md" className="bg-stone-50/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-stone-200 flex items-center justify-center">
            <span className="text-xs">📝</span>
          </div>
          <span className="text-sm font-medium text-stone-500">
            已收集信息 ({items.length})
          </span>
        </div>
        <div className="divide-y divide-stone-100">
          {items.map((item, index) => (
            <CollectedInfoItem key={index} item={item} index={index} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function ProgressIndicator({ current, max }: { current: number; max: number }) {
  const progress = Math.min(current / max, 1);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-stone-500">对话进度</span>
        <span className="text-xs text-stone-400">
          {current} / {max} 轮
        </span>
      </div>
      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-stone-400 to-stone-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

function ErrorMessage({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card padding="lg" className="border-red-200 bg-red-50/50">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">⚠️</span>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-red-900 mb-1">出错了</h4>
          <p className="text-sm text-red-700 leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="danger" size="sm" onClick={onRetry}>
          重新开始
        </Button>
      </div>
    </Card>
  );
}

function ConversationComplete({
  onFinish,
  onReset,
}: {
  onFinish: () => void;
  onReset: () => void;
}) {
  return (
    <Card padding="lg" className="bg-stone-50/50">
      <div className="flex gap-4">
        <Button variant="secondary" onClick={onReset} className="flex-1">
          重新开始
        </Button>
        <Button variant="primary" onClick={onFinish} className="flex-1">
          生成方案
        </Button>
      </div>
    </Card>
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

  return (
    <div className="relative">
      <div className="absolute -top-4 -left-4 -right-4 h-32 bg-gradient-to-b from-stone-100/50 to-transparent pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center">
              <span className="text-lg">💭</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">思考模式</h2>
              <p className="text-sm text-stone-500">AI 将通过追问帮你明确任务需求</p>
            </div>
          </div>
          {!isComplete && currentQuestion && (
            <Button variant="ghost" size="sm" onClick={onFinish}>
              结束并生成
            </Button>
          )}
        </div>

        {!isComplete && currentRound > 0 && (
          <ProgressIndicator current={currentRound} max={maxRounds} />
        )}

        {originalTask && <OriginalTaskCard task={originalTask} />}

        {collectedInfo.length > 0 && (
          <CollectedInfoSection items={collectedInfo} />
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loading size="lg" />
            <p className="mt-4 text-sm text-stone-500">AI 正在思考中...</p>
          </div>
        )}

        {error && (
          <ErrorMessage message={error} onRetry={onReset} />
        )}

        {!loading && !error && currentQuestion && !isComplete && (
          <QuestionCard
            question={currentQuestion}
            currentRound={currentRound}
            maxRounds={maxRounds}
            onAnswer={onAnswer}
            onSkip={onSkip}
            disabled={loading}
          />
        )}

        {!loading && !error && isComplete && (
          <ConversationComplete
            onFinish={onFinish}
            onReset={onReset}
          />
        )}

        {!loading && !error && !currentQuestion && !isComplete && originalTask && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-sm text-stone-500">准备中...</p>
          </div>
        )}
      </div>
    </div>
  );
}
