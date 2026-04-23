import { View, Text } from '@tarojs/components';
import './index.scss';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = '加载中...' }) => {
  return (
    <View className='loading'>
      <View className='loading-spinner'>
        <View className='loading-spinner-item loading-spinner-item--1' />
        <View className='loading-spinner-item loading-spinner-item--2' />
        <View className='loading-spinner-item loading-spinner-item--3' />
        <View className='loading-spinner-item loading-spinner-item--4' />
      </View>
      <Text className='loading-text'>{message}</Text>
    </View>
  );
};

export default Loading;
