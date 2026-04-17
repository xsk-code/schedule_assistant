import React, { useState, useEffect } from 'react';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import { APP_CONFIG } from '../../../constants/appConfig';

interface TaskInputProps {
  onSubmit: (task: string) => void;
  disabled?: boolean;
  loading?: boolean;
  initialValue?: string;
}

const EXAMPLES = [
  '规划新产品从需求调研到上线的完整 roadmap',
  '准备高等数学、线性代数、概率论三门课程的期末考试复习',
  '今天需要完成产品原型、回复投资人邮件、面试候选人和团队周会',
];

export function TaskInput({ onSubmit, disabled = false, loading = false, initialValue }: TaskInputProps) {
  const [task, setTask] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setTask(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim().length >= APP_CONFIG.MIN_TASK_LENGTH) {
      onSubmit(task.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setTask(example);
  };

  const isTooShort = task.length > 0 && task.length < APP_CONFIG.MIN_TASK_LENGTH;
  const isTooLong = task.length > APP_CONFIG.MAX_TASK_LENGTH;
  const charCount = task.length;
  const charProgress = Math.min(charCount / APP_CONFIG.MAX_TASK_LENGTH, 1);

  return (
    <Card className="animate-slide-up" padding="lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2">
            <span className="text-display text-xl font-semibold text-stone-800">
              描述你的任务
            </span>
            <p className="text-sm text-stone-500 mt-1">
              越详细，分析越精准
            </p>
          </label>
          
          <div className="relative">
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="例如：规划新产品从需求调研到上线的完整 roadmap"
              disabled={disabled || loading}
              rows={5}
              className={`
                w-full px-5 py-4 rounded-xl border-2 resize-none transition-all duration-300
                ${isFocused ? 'border-stone-900 ring-4 ring-stone-900/5' : 'border-stone-200'}
                ${isTooShort || isTooLong ? 'border-red-400' : ''}
                ${disabled || loading ? 'bg-stone-100 cursor-not-allowed' : 'bg-white'}
              `}
            />
            
            <div className="absolute bottom-3 right-3 flex items-center gap-3">
              <span className={`text-xs font-medium ${isTooLong ? 'text-red-500' : 'text-stone-400'}`}>
                {charCount.toLocaleString()}
              </span>
              <div className="w-16 h-1 bg-stone-200 rounded-full overflow-hidden">
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
                <span className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  请输入至少 {APP_CONFIG.MIN_TASK_LENGTH} 个字
                </span>
              )}
              {isTooLong && (
                <span className="text-sm text-red-500 flex items-center gap-1">
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

        <div className="mb-6">
          <p className="text-xs text-stone-400 uppercase tracking-wider mb-3">参考示例</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                disabled={disabled || loading}
                className={`
                  px-4 py-2 text-sm rounded-full border transition-all duration-200
                  ${task === example 
                    ? 'bg-stone-900 text-white border-stone-900' 
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-800'
                  }
                  ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {example.length > 18 ? example.slice(0, 18) + '...' : example}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            size="lg"
            loading={loading}
            disabled={disabled || task.trim().length < APP_CONFIG.MIN_TASK_LENGTH || task.length > APP_CONFIG.MAX_TASK_LENGTH}
            className="min-w-48"
          >
            {loading ? '分析中...' : '开始分析'}
          </Button>
        </div>
      </form>
    </Card>
  );
}