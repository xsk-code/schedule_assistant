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
          <Text className='text-tertiary'>正在研读天机…</Text>
        </View>
      </View>
    );
  }

  const { dayGanZhi, lunarDate, sihua } = sihuaInfo;

  return (
    <View className='sihua-bar'>
      <View className='sihua-bar-date'>
        <Text className='sihua-bar-date-ganzhi'>{dayGanZhi}</Text>
        <Text className='sihua-bar-date-lunar'>{lunarDate}</Text>
      </View>
      
      <View className='sihua-bar-items'>
        <View className='sihua-item'>
          <View className='sihua-item-dot sihua-item-dot--lu' />
          <Text className='sihua-item-name sihua-item-name--lu'>{sihua.lu}{SIHUA_DIMENSION_NAMES.lu}</Text>
        </View>
        
        <View className='sihua-item'>
          <View className='sihua-item-dot sihua-item-dot--quan' />
          <Text className='sihua-item-name sihua-item-name--quan'>{sihua.quan}{SIHUA_DIMENSION_NAMES.quan}</Text>
        </View>
        
        <View className='sihua-item'>
          <View className='sihua-item-dot sihua-item-dot--ke' />
          <Text className='sihua-item-name sihua-item-name--ke'>{sihua.ke}{SIHUA_DIMENSION_NAMES.ke}</Text>
        </View>
        
        <View className='sihua-item'>
          <View className='sihua-item-dot sihua-item-dot--ji' />
          <Text className='sihua-item-name sihua-item-name--ji'>{sihua.ji}{SIHUA_DIMENSION_NAMES.ji}</Text>
        </View>
      </View>

      <View className='sihua-bar-divider' />
    </View>
  );
};

export default SihuaBar;
