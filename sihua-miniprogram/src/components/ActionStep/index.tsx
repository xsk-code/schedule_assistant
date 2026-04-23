import { View, Text } from '@tarojs/components';
import './index.scss';
import type { ActionStep } from '@/types';
import { SIHUA_DIMENSION_NAMES } from '@/constants/sihuaRules';

interface ActionStepProps {
  step: ActionStep;
  onToggle?: () => void;
  showDimension?: boolean;
}

const ActionStepComponent: React.FC<ActionStepProps> = ({
  step,
  onToggle,
  showDimension = true,
}) => {
  const getDimensionColor = (dimension: string) => {
    switch (dimension) {
      case 'lu': return '#6B9E7A';
      case 'quan': return '#C49A5C';
      case 'ke': return '#7BA3C4';
      case 'ji': return '#C47A7A';
      default: return '#A8A29E';
    }
  };

  return (
    <View 
      className={`action-step ${step.completed ? 'action-step--completed' : ''}`}
      onClick={onToggle}
    >
      <View 
        className='action-step-checkbox'
        style={{ borderColor: getDimensionColor(step.dimension) }}
      >
        {step.completed && (
          <Text className='action-step-checkbox-icon'>✓</Text>
        )}
      </View>

      <View className='action-step-content'>
        <View className='action-step-header'>
          <Text className='action-step-title'>{step.title}</Text>
          <View className='action-step-meta'>
            {showDimension && (
              <View className='action-step-tag action-step-tag--dimension'>
                <Text className='action-step-tag-text'>{SIHUA_DIMENSION_NAMES[step.dimension as keyof typeof SIHUA_DIMENSION_NAMES]}</Text>
              </View>
            )}
            <View className='action-step-tag'>
              <Text className='action-step-tag-text'>{step.priority}优</Text>
            </View>
            <View className='action-step-tag'>
              <Text className='action-step-tag-text'>{step.timeEstimate}</Text>
            </View>
          </View>
        </View>
        
        {step.description && (
          <Text className='action-step-description'>{step.description}</Text>
        )}
      </View>
    </View>
  );
};

export default ActionStepComponent;
