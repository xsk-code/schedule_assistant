import { View, Text, Textarea, Button } from '@tarojs/components';
import './index.scss';
import type { TaskMode } from '@/types';

interface TaskInputProps {
  value: string;
  onChange: (value: string) => void;
  mode: TaskMode;
  onModeChange: (mode: TaskMode) => void;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const TaskInput: React.FC<TaskInputProps> = ({
  value,
  onChange,
  mode,
  onModeChange,
  onSubmit,
  loading = false,
  disabled = false,
}) => {
  return (
    <View className='task-input'>
      <View className='task-input-area'>
        <Textarea
          className='task-input-textarea'
          placeholder='描述你想要完成的任务...'
          placeholderClass='task-input-placeholder'
          value={value}
          onInput={(e) => onChange(e.detail.value)}
          maxlength={500}
          autoHeight
          disabled={disabled}
        />
      </View>
      
      <View className='task-input-mode'>
        <View 
          className={`task-input-mode-item ${mode === 'simple' ? 'task-input-mode-item--active' : ''}`}
          onClick={() => !disabled && onModeChange('simple')}
        >
          <Text className='task-input-mode-icon'>⚡</Text>
          <Text className='task-input-mode-text'>简单</Text>
        </View>
        <View 
          className={`task-input-mode-item ${mode === 'thinking' ? 'task-input-mode-item--active' : ''}`}
          onClick={() => !disabled && onModeChange('thinking')}
        >
          <Text className='task-input-mode-icon'>💭</Text>
          <Text className='task-input-mode-text'>思考</Text>
        </View>
      </View>
      
      <Button
        className={`task-input-submit ${loading ? 'task-input-submit--loading' : ''}`}
        onClick={onSubmit}
        disabled={loading || disabled}
        loading={loading}
      >
        {loading ? '分析中...' : '开始智能拆分'}
      </Button>
    </View>
  );
};

export default TaskInput;
