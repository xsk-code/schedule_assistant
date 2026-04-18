import React, { useState } from 'react';
import { OptionCard } from './OptionCard';
import { Button } from '../../common/Button';
import { Card } from '../../common/Card';
import type { AIQuestion } from '../../../types';

interface QuestionCardProps {
  question: AIQuestion;
  currentRound: number;
  maxRounds: number;
  onAnswer: (answer: string) => void;
  onSkip: () => void;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  currentRound,
  maxRounds,
  onAnswer,
  onSkip,
  disabled = false,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [otherInput, setOtherInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const isOtherOption = selectedOption === '其他';
  const hasValidInput = isOtherOption ? otherInput.trim().length > 0 : selectedOption !== null;

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    if (option !== '其他') {
      setOtherInput('');
    }
  };

  const handleConfirm = () => {
    if (!hasValidInput) return;

    let answer = selectedOption as string;
    if (isOtherOption) {
      answer = `其他：${otherInput.trim()}`;
    }

    onAnswer(answer);
    setSelectedOption(null);
    setOtherInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (hasValidInput && !disabled) {
        handleConfirm();
      }
    }
  };

  return (
    <Card padding="lg" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-stone-200 via-stone-400 to-stone-200" />
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-stone-500">
              第 {currentRound} 轮
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-sm text-stone-400">
              共 {maxRounds} 轮
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-stone-400" />
          <h3 className="text-lg font-semibold text-stone-900">
            {question.question}
          </h3>
        </div>

        {question.hint && (
          <p className="text-sm text-stone-500 ml-4 mb-6">
            {question.hint}
          </p>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <div key={index}>
            <OptionCard
              label={option}
              selected={selectedOption === option}
              onClick={() => handleOptionClick(option)}
              disabled={disabled}
              isOther={option === '其他'}
            />

            {option === '其他' && selectedOption === '其他' && (
              <div className="mt-3 ml-9">
                <input
                  type="text"
                  value={otherInput}
                  onChange={(e) => setOtherInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder="请输入其他内容..."
                  disabled={disabled}
                  className={`
                    w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                    bg-white text-stone-700 placeholder-stone-400
                    ${isFocused
                      ? 'border-stone-900 ring-4 ring-stone-900/5'
                      : 'border-stone-200'
                    }
                    ${disabled ? 'bg-stone-100 cursor-not-allowed' : ''}
                  `}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={onSkip}
          disabled={disabled}
          className="flex-1"
        >
          跳过
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={disabled || !hasValidInput}
          loading={disabled}
          className="flex-1"
        >
          确认
        </Button>
      </div>
    </Card>
  );
}
