import { useState } from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import './index.scss';
import type { AIResponse } from '@/types';
import Loading from '@/components/Loading';

interface ConversationPanelProps {
  question: AIResponse | null;
  currentRound: number;
  maxRounds: number;
  onSelectOption: (answer: string) => void;
  onSkip: () => void;
  isGenerating: boolean;
}

const ConversationPanel: React.FC<ConversationPanelProps> = ({
  question,
  currentRound,
  maxRounds,
  onSelectOption,
  onSkip,
  isGenerating,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [otherInput, setOtherInput] = useState('');

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

    onSelectOption(answer);
    setSelectedOption(null);
    setOtherInput('');
  };

  if (isGenerating) {
    return (
      <View className='conversation-panel'>
        <Loading message='正在研读天机…' />
      </View>
    );
  }

  if (!question?.question) {
    return null;
  }

  const progress = Array.from({ length: maxRounds }, (_, i) => i + 1);

  return (
    <View className='conversation-panel'>
      <View className='conversation-header'>
        <View className='conversation-progress'>
          <Text className='conversation-progress-text'>第 {currentRound} 轮 / 共 {maxRounds} 轮</Text>
          <View className='conversation-progress-dots'>
            {progress.map((i) => (
              <View 
                key={i} 
                className={`conversation-progress-dot ${i <= currentRound ? 'conversation-progress-dot--active' : ''}`}
              />
            ))}
          </View>
        </View>
        
        <View className='conversation-skip' onClick={onSkip}>
          <Text className='conversation-skip-text'>跳过 →</Text>
        </View>
      </View>

      <View className='conversation-question'>
        <View className='conversation-bubble'>
          <Text className='conversation-bubble-text'>{question.question}</Text>
        </View>
        {question.reasoning && (
          <Text className='conversation-hint'>命理师想了解…</Text>
        )}
      </View>

      <View className='conversation-options'>
        {question.options?.map((option, index) => (
          <View key={index}>
            <View 
              className={`conversation-option ${selectedOption === option ? 'conversation-option--selected' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              <View className={`conversation-option-dot ${selectedOption === option ? 'conversation-option-dot--selected' : ''}`} />
              <Text className='conversation-option-text'>{option}</Text>
            </View>

            {option === '其他' && selectedOption === '其他' && (
              <View className='conversation-other-input'>
                <Textarea
                  className='conversation-other-textarea'
                  value={otherInput}
                  onInput={(e) => setOtherInput(e.detail.value)}
                  placeholder='请输入其他内容...'
                  placeholderClass='conversation-other-placeholder'
                  autoHeight
                  maxlength={200}
                />
              </View>
            )}
          </View>
        ))}
      </View>

      <View className='conversation-actions'>
        <View 
          className={`conversation-action-btn conversation-action-btn--secondary ${!selectedOption ? 'conversation-action-btn--disabled' : ''}`}
          onClick={() => {
            if (selectedOption) {
              setSelectedOption(null);
              setOtherInput('');
            }
          }}
        >
          <Text className='conversation-action-btn-text'>取消</Text>
        </View>
        <View 
          className={`conversation-action-btn conversation-action-btn--primary ${!hasValidInput ? 'conversation-action-btn--disabled' : ''}`}
          onClick={handleConfirm}
        >
          <Text className='conversation-action-btn-text'>确认</Text>
        </View>
      </View>
    </View>
  );
};

export default ConversationPanel;
