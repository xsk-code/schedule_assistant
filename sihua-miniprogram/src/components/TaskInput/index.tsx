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
          placeholder='落笔写下今日所虑(描述越详细，分析越准确)…'
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
          <View className='task-input-mode-dot' />
          <Text className='task-input-mode-text'>速览</Text>
        </View>
        <View 
          className={`task-input-mode-item ${mode === 'thinking' ? 'task-input-mode-item--active' : ''}`}
          onClick={() => !disabled && onModeChange('thinking')}
        >
          <View className='task-input-mode-dot' />
          <Text className='task-input-mode-text'>深思</Text>
        </View>
      </View>
      
      <Button
        className={`task-input-submit ${loading ? 'task-input-submit--loading' : ''}`}
        onClick={onSubmit}
        disabled={loading || disabled}
        loading={loading}
      >
        {loading ? '研读中…' : '落笔开卷'}
      </Button>
    </View>
  );
};

export default TaskInput;
