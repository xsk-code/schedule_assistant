import { View, Text } from '@tarojs/components';
import './index.scss';
import type { SihuaInfo } from '@/types';
import { SIHUA_DIMENSION_NAMES } from '@/constants/sihuaRules';

interface SihuaBarProps {
  sihuaInfo: SihuaInfo | null;
}

const SihuaBar: React.FC<SihuaBarProps> = ({ sihuaInfo }) => {
  if (!sihuaInfo) {
    return (
      <View className='sihua-bar'>
        <View className='sihua-bar-loading'>
          <Text className='text-tertiary'>加载中...</Text>
        </View>
      </View>
    );
  }

  const { dayGanZhi, sihua } = sihuaInfo;

  return (
    <View className='sihua-bar'>
      <View className='sihua-bar-date'>
        <Text className='sihua-bar-date-title'>今日</Text>
        <Text className='sihua-bar-date-ganzhi'>{dayGanZhi}日</Text>
      </View>
      
      <View className='sihua-bar-items'>
        <View className='sihua-item sihua-item--lu'>
          <View className='sihua-item-dot sihua-item-dot--lu' />
          <Text className='sihua-item-name'>{SIHUA_DIMENSION_NAMES.lu}{sihua.lu}</Text>
        </View>
        
        <View className='sihua-item sihua-item--quan'>
          <View className='sihua-item-dot sihua-item-dot--quan' />
          <Text className='sihua-item-name'>{SIHUA_DIMENSION_NAMES.quan}{sihua.quan}</Text>
        </View>
        
        <View className='sihua-item sihua-item--ke'>
          <View className='sihua-item-dot sihua-item-dot--ke' />
          <Text className='sihua-item-name'>{SIHUA_DIMENSION_NAMES.ke}{sihua.ke}</Text>
        </View>
        
        <View className='sihua-item sihua-item--ji'>
          <View className='sihua-item-dot sihua-item-dot--ji' />
          <Text className='sihua-item-name'>{SIHUA_DIMENSION_NAMES.ji}{sihua.ji}</Text>
        </View>
      </View>
    </View>
  );
};

export default SihuaBar;
