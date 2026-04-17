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

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-800 mb-2">
            请输入您想要分析的任务
          </label>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="例如：规划新产品从需求调研到上线的完整 roadmap"
            disabled={disabled || loading}
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-colors ${
              isTooShort || isTooLong
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500'
            } ${disabled || loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          />
          <div className="flex justify-between mt-2">
            <div className="text-sm">
              {isTooShort && (
                <span className="text-red-500">
                  请输入至少 {APP_CONFIG.MIN_TASK_LENGTH} 个字
                </span>
              )}
              {isTooLong && (
                <span className="text-red-500">
                  已超过 {APP_CONFIG.MAX_TASK_LENGTH} 字限制
                </span>
              )}
            </div>
            <span className={`text-sm ${task.length > APP_CONFIG.MAX_TASK_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
              {task.length}/{APP_CONFIG.MAX_TASK_LENGTH}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">常用示例：</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                disabled={disabled || loading}
                className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
              >
                {example.length > 20 ? example.slice(0, 20) + '...' : example}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            loading={loading}
            disabled={disabled || task.trim().length < APP_CONFIG.MIN_TASK_LENGTH || task.length > APP_CONFIG.MAX_TASK_LENGTH}
          >
            🔮 开始分析
          </Button>
        </div>
      </form>
    </Card>
  );
}
