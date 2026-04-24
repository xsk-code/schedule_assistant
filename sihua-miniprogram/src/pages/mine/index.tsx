import { useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import './index.scss';
import Taro from '@tarojs/taro';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useStatusBarHeight } from '@/hooks/useStatusBarHeight';

export default function Mine() {
  const { records, clearAll } = useHistoryStore();
  const statusBarHeight = useStatusBarHeight();

  const handleClearHistory = useCallback(() => {
    Taro.showModal({
      title: '清空历史记录',
      content: `确定要清空所有 ${records.length} 条历史记录吗？此操作无法撤销。`,
      success: (res: { confirm: boolean; cancel: boolean }) => {
        if (res.confirm) {
          clearAll();
          Taro.showToast({
            title: '已清空',
            icon: 'success',
          });
        }
      },
    });
  }, [records.length, clearAll]);

  const handleAbout = useCallback(() => {
    Taro.showModal({
      title: '关于别蛮干',
      content: `版本：1.0.0\n\n别蛮干是一款基于四化能量理论的任务分析工具。\n\n找对方向再出手——通过 AI 驱动的深度分析，帮你在对的时间做对的事。\n\n核心功能：\n• 每日四化能量显示\n• 任务四化能量匹配分析\n• 四维深度分析（禄权科忌）\n• 智能行动路径规划\n\n技术栈：\n• Taro + React + TypeScript\n• Tailwind CSS\n• Zustand\n• lunar-javascript\n• SiliconFlow API`,
      showCancel: false,
      confirmText: '知道了',
    });
  }, []);

  return (
    <ScrollView 
      className='mine-container'
      scrollY
      enhanced
      showScrollbar={false}
    >
      <View className='mine-header' style={{ paddingTop: `${statusBarHeight + 8}px` }}>
        <View className='mine-avatar'>
          <Text className='mine-avatar-text'>别</Text>
        </View>
        <View className='mine-info'>
          <Text className='mine-name'>别蛮干</Text>
          <Text className='mine-desc'>借助天时行动</Text>
        </View>
      </View>

      <View className='mine-stats'>
        <View className='mine-stat-item'>
          <Text className='mine-stat-label'>已分析</Text>
          <Text className='mine-stat-value'>{records.length} 个任务</Text>
        </View>
      </View>

      <View className='mine-section'>
        <Text className='mine-section-title'>数据管理</Text>
        
        <View 
          className='mine-setting-item mine-setting-item--clickable'
          onClick={handleClearHistory}
        >
          <Text className='mine-setting-label'>清空历史记录</Text>
          <View className='mine-setting-arrow'>
            <Text className='mine-setting-arrow-text'>›</Text>
          </View>
        </View>
      </View>

      <View className='mine-section'>
        <Text className='mine-section-title'>关于</Text>
        
        <View 
          className='mine-setting-item mine-setting-item--clickable'
          onClick={handleAbout}
        >
          <Text className='mine-setting-label'>关于别蛮干</Text>
          <View className='mine-setting-arrow'>
            <Text className='mine-setting-arrow-text'>›</Text>
          </View>
        </View>
      </View>

      <View className='mine-footer'>
        <Text className='mine-footer-text'>基于四化能量理论</Text>
        <Text className='mine-footer-text'>AI 驱动的任务分析引擎</Text>
      </View>
    </ScrollView>
  );
}
