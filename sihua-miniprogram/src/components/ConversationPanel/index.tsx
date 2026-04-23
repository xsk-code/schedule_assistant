import { View, Text, Button } from '@tarojs/components';
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
  if (isGenerating) {
    return (
      <View className='conversation-panel'>
        <Loading message='思考中...' />
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
          <Text className='conversation-hint'>{question.reasoning}</Text>
        )}
      </View>

      <View className='conversation-options'>
        {question.options?.map((option, index) => (
          <View 
            key={index}
            className='conversation-option'
            onClick={() => onSelectOption(option)}
          >
            <Text className='conversation-option-text'>{option}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ConversationPanel;
