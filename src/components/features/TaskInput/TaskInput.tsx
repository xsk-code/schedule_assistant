import React, { useState, useEffect } from 'react';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { ConversationView } from './ConversationView';
import { useConversation } from '../../../hooks/useConversation';
import { APP_CONFIG } from '../../../constants/appConfig';
import type { TaskMode, CollectedItem } from '../../../types';

interface TaskInputProps {
  onSubmit: (task: string) => void;
  onThinkingComplete?: (task: string, collectedInfo: CollectedItem[]) => void;
  disabled?: boolean;
  loading?: boolean;
  initialValue?: string;
  apiKey?: string;
  model?: string;
}

const EXAMPLES = [
  '规划新产品从需求调研到上线的完整 roadmap',
  '准备高等数学、线性代数、概率论三门课程的期末考试复习',
  '今天需要完成产品原型、回复投资人邮件、面试候选人和团队周会',
];

export function TaskInput({
  onSubmit,
  onThinkingComplete,
  disabled = false,
  loading = false,
  initialValue,
  apiKey = '',
  model,
}: TaskInputProps) {
  const [task, setTask] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mode, setMode] = useState<TaskMode>('simple');
  const [isInConversation, setIsInConversation] = useState(false);

  const conversation = useConversation();

  useEffect(() => {
    if (initialValue) {
      setTask(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim().length >= APP_CONFIG.MIN_TASK_LENGTH) {
      if (mode === 'simple') {
        onSubmit(task.trim());
      } else {
        if (!apiKey.trim()) {
          alert('请先在设置中配置 API Key');
          return;
        }
        setIsInConversation(true);
        conversation.startConversation(task.trim(), apiKey, model);
      }
    }
  };

  const handleExampleClick = (example: string) => {
    setTask(example);
  };

  const handleModeChange = (newMode: TaskMode) => {
    if (newMode !== mode) {
      setMode(newMode);
      if (isInConversation) {
        setIsInConversation(false);
        conversation.reset();
      }
    }
  };

  const handleConversationAnswer = (answer: string) => {
    conversation.answerQuestion(answer);
  };

  const handleConversationSkip = () => {
    conversation.skipQuestion();
  };

  const handleConversationFinish = () => {
    if (onThinkingComplete) {
      onThinkingComplete(
        conversation.context.originalTask,
        conversation.context.collectedInfo
      );
    } else {
      onSubmit(conversation.context.originalTask);
    }
  };

  const handleConversationReset = () => {
    setIsInConversation(false);
    conversation.reset();
  };

  const isTooShort = task.length > 0 && task.length < APP_CONFIG.MIN_TASK_LENGTH;
  const isTooLong = task.length > APP_CONFIG.MAX_TASK_LENGTH;
  const charCount = task.length;
  const charProgress = Math.min(charCount / APP_CONFIG.MAX_TASK_LENGTH, 1);

  if (isInConversation) {
    return (
      <ConversationView
        context={conversation.context}
        currentQuestion={conversation.currentQuestion}
        loading={conversation.loading}
        error={conversation.error}
        onAnswer={handleConversationAnswer}
        onSkip={handleConversationSkip}
        onFinish={handleConversationFinish}
        onReset={handleConversationReset}
      />
    );
  }

  return (
    <div className="relative">
      <div className="absolute -top-4 -left-4 -right-4 h-32 bg-gradient-to-b from-stone-100/50 to-transparent pointer-events-none" />

      <Card className="relative" padding="lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <label className="block">
                <span className="text-display text-2xl font-bold text-stone-900 tracking-tight">
                  任务拆分
                </span>
                <p className="text-sm text-stone-500 mt-1.5">
                  输入你的任务，AI 将结合今日四化为你规划最优行动路径
                </p>
              </label>

              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleModeChange('simple')}
                  disabled={disabled || loading}
                  className={`
                    px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${mode === 'simple'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                    }
                    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  ⚡ 简单
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('thinking')}
                  disabled={disabled || loading}
                  className={`
                    px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${mode === 'thinking'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                    }
                    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  💭 思考
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="描述你想要完成的任务..."
                disabled={disabled || loading}
                rows={6}
                className={`
                  w-full px-5 py-4 rounded-2xl border-2 resize-none transition-all duration-300
                  ${isFocused ? 'border-stone-900 ring-4 ring-stone-900/5' : 'border-stone-200'}
                  ${isTooShort || isTooLong ? 'border-red-400' : ''}
                  ${disabled || loading ? 'bg-stone-100 cursor-not-allowed' : 'bg-white'}
                `}
              />

              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <span className={`text-xs font-medium ${isTooLong ? 'text-red-500' : 'text-stone-400'}`}>
                  {charCount.toLocaleString()}
                </span>
                <div className="w-20 h-1 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isTooLong ? 'bg-red-500' : charProgress > 0.8 ? 'bg-amber-500' : 'bg-stone-900'
                    }`}
                    style={{ width: `${charProgress * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isTooShort && (
                  <span className="text-sm text-red-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    请输入至少 {APP_CONFIG.MIN_TASK_LENGTH} 个字
                  </span>
                )}
                {isTooLong && (
                  <span className="text-sm text-red-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    已超过 {APP_CONFIG.MAX_TASK_LENGTH} 字限制
                  </span>
                )}
              </div>
              <span className="text-xs text-stone-400">
                / {APP_CONFIG.MAX_TASK_LENGTH.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs text-stone-400 uppercase tracking-wider mb-2.5">参考示例</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  disabled={disabled || loading}
                  className={`
                    px-3 py-2 text-sm rounded-xl border transition-all duration-200
                    ${task === example
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-800'
                    }
                    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {example.length > 20 ? example.slice(0, 20) + '...' : example}
                </button>
              ))}
            </div>
          </div>

          {mode === 'thinking' && (
            <div className="mb-5 p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-start gap-3">
                <span className="text-lg">💡</span>
                <div>
                  <p className="text-sm font-medium text-stone-900 mb-1">思考模式已启用</p>
                  <p className="text-sm text-stone-600">
                    AI 将通过多轮追问深入了解你的需求，生成更精准的任务拆分方案。
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-1">
            <Button
              type="submit"
              size="lg"
              loading={loading}
              disabled={disabled || task.trim().length < APP_CONFIG.MIN_TASK_LENGTH || task.length > APP_CONFIG.MAX_TASK_LENGTH}
              className="min-w-56 text-base"
            >
              {loading ? '分析中...' : mode === 'thinking' ? '开始深入分析' : '开始智能拆分'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
