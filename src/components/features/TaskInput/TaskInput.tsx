import React, { useState, useEffect } from 'react';
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
  model?: string;
}

const TaskInput: React.FC<TaskInputProps> = ({
  onSubmit,
  onThinkingComplete,
  disabled = false,
  loading = false,
  initialValue,
  model,
}) => {
  const [task, setTask] = useState('');
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
        setIsInConversation(true);
        conversation.startConversation(task.trim(), model);
      }
    }
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
    <div className="task-input">
      <form onSubmit={handleSubmit}>
        <div className="task-input-area">
          <textarea
            className="task-input-textarea"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="落笔写下今日所虑(描述越详细，分析越准确)…"
            disabled={disabled || loading}
            rows={4}
          />
        </div>

        <div className="task-input-mode">
          <div
            className={`task-input-mode-item ${mode === 'simple' ? 'task-input-mode-item--active' : ''}`}
            onClick={() => !disabled && !loading && handleModeChange('simple')}
          >
            <div className="task-input-mode-dot" />
            <span className="task-input-mode-text">速览</span>
          </div>
          <div
            className={`task-input-mode-item ${mode === 'thinking' ? 'task-input-mode-item--active' : ''}`}
            onClick={() => !disabled && !loading && handleModeChange('thinking')}
          >
            <div className="task-input-mode-dot" />
            <span className="task-input-mode-text">深思</span>
          </div>
        </div>

        <button
          type="submit"
          className={`task-input-submit ${loading ? 'task-input-submit--loading' : ''}`}
          disabled={loading || disabled || task.trim().length < APP_CONFIG.MIN_TASK_LENGTH}
        >
          {loading ? '研读中…' : '落笔开卷'}
        </button>
      </form>
    </div>
  );
};

export { TaskInput };
