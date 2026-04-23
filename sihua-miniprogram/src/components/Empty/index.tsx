import { View, Text } from '@tarojs/components';
import './index.scss';

interface EmptyProps {
  icon?: string;
  title?: string;
  description?: string;
}

const Empty: React.FC<EmptyProps> = ({
  icon = '📭',
  title = '暂无数据',
  description = '',
}) => {
  return (
    <View className='empty'>
      <Text className='empty-icon'>{icon}</Text>
      <Text className='empty-title'>{title}</Text>
      {description && (
        <Text className='empty-description'>{description}</Text>
      )}
    </View>
  );
};

export default Empty;
