import { View, Text } from '@tarojs/components';
import './index.scss';

interface EmptyProps {
  icon?: string;
  title?: string;
  description?: string;
}

const Empty: React.FC<EmptyProps> = ({
  title = '落笔写下所虑',
  description = '四化能量将为你指引方向',
}) => {
  return (
    <View className='empty'>
      <View className='empty-icon'>
        <View className='empty-mountain'>
          <View className='empty-mountain-row'>
            <View className='empty-mountain-dot--tiny' />
            <View className='empty-mountain-dot--tiny' />
            <View className='empty-mountain-dot--tiny' />
            <View className='empty-mountain-dot--small' />
            <View className='empty-mountain-dot' />
            <View className='empty-mountain-dot--small' />
            <View className='empty-mountain-dot--tiny' />
            <View className='empty-mountain-dot--tiny' />
            <View className='empty-mountain-dot--tiny' />
          </View>
          <View className='empty-mountain-row'>
            <View className='empty-mountain-dot--tiny' />
            <View className='empty-mountain-dot--tiny' />
            <View className='empty-mountain-dot--small' />
            <View className='empty-mountain-dot' />
            <View className='empty-mountain-dot--small' />
            <View className='empty-mountain-dot--tiny' />
            <View className='empty-mountain-dot--tiny' />
          </View>
          <View className='empty-mountain-row'>
            <View className='empty-mountain-dot--tiny' />
            <View className='empty-mountain-dot--small' />
            <View className='empty-mountain-dot' />
            <View className='empty-mountain-dot--small' />
            <View className='empty-mountain-dot--tiny' />
          </View>
        </View>
      </View>
      <Text className='empty-title'>{title}</Text>
      {description && (
        <Text className='empty-description'>{description}</Text>
      )}
    </View>
  );
};

export default Empty;
