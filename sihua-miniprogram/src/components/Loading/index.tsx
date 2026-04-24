import { View, Text } from '@tarojs/components';
import './index.scss';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = '正在研读天机…' }) => {
  return (
    <View className='loading'>
      <View className='loading-dots'>
        <View className='loading-dot loading-dot--1' />
        <View className='loading-dot loading-dot--2' />
        <View className='loading-dot loading-dot--3' />
      </View>
      <Text className='loading-text'>{message}</Text>
    </View>
  );
};

export default Loading;
