import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import './index.scss';
import Taro from '@tarojs/taro';
import { useHistoryStore } from '@/store/useHistoryStore';
import { storageService } from '@/services/storageService';
import { APP_CONFIG } from '@/constants/appConfig';

interface AppSettings {
  apiKey: string;
  maxRounds: number;
}

export default function Mine() {
  const { records, clearAll } = useHistoryStore();
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    maxRounds: 3,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedSettings = storageService.getSettings();
    const apiKey = process.env.TARO_APP_API_KEY || savedSettings.apiKey || '';
    setSettings({
      apiKey,
      maxRounds: savedSettings.maxRounds || APP_CONFIG.CONVERSATION.MAX_ROUNDS,
    });
  }, []);

  const handleApiKeyChange = useCallback((e: any) => {
    const value = e.detail.value || '';
    setSettings(prev => ({ ...prev, apiKey: value }));
  }, []);

  const handleMaxRoundsChange = useCallback((e: any) => {
    const value = parseInt(e.detail.value, 10) || 3;
    const clampedValue = Math.min(Math.max(value, 1), 10);
    setSettings(prev => ({ ...prev, maxRounds: clampedValue }));
  }, []);

  const handleSaveSettings = useCallback(() => {
    setIsSaving(true);
    
    try {
      storageService.setSettings(settings);
      Taro.showToast({
        title: '保存成功',
        icon: 'success',
      });
    } catch (error) {
      Taro.showToast({
        title: '保存失败',
        icon: 'none',
      });
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

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
      title: '关于四化节奏师',
      content: `版本：1.0.0\n\n四化节奏师是一款基于紫微斗数四化理论的任务分析工具。\n\n通过 AI 驱动的深度分析，帮助您在对的时间做对的事。\n\n核心功能：\n• 每日四化能量显示\n• 任务四化能量匹配分析\n• 四维深度分析（禄权科忌）\n• 智能行动路径规划\n\n技术栈：\n• Taro + React + TypeScript\n• Tailwind CSS\n• Zustand\n• lunar-javascript\n• SiliconFlow API`,
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
      <View className='mine-header'>
        <View className='mine-avatar'>
          <Text className='mine-avatar-text'>四</Text>
        </View>
        <View className='mine-info'>
          <Text className='mine-name'>四化节奏师</Text>
          <Text className='mine-desc'>让每日任务与四化能量同步</Text>
        </View>
      </View>

      <View className='mine-stats'>
        <View className='mine-stat-item'>
          <Text className='mine-stat-label'>已分析</Text>
          <Text className='mine-stat-value'>{records.length} 个任务</Text>
        </View>
      </View>

      <View className='mine-section'>
        <Text className='mine-section-title'>API 设置</Text>
        
        <View className='mine-setting-item'>
          <Text className='mine-setting-label'>API Key</Text>
          <View className='mine-setting-input-wrapper'>
            <Input
              className='mine-setting-input'
              password
              placeholder='请输入 SiliconFlow API Key'
              value={settings.apiKey}
              onInput={handleApiKeyChange}
              placeholderClass='mine-placeholder'
            />
          </View>
        </View>

        <View className='mine-setting-item'>
          <Text className='mine-setting-label'>思考模式轮数</Text>
          <View className='mine-setting-input-wrapper'>
            <Input
              className='mine-setting-input mine-setting-input--number'
              type='number'
              placeholder='3'
              value={settings.maxRounds.toString()}
              onInput={handleMaxRoundsChange}
              placeholderClass='mine-placeholder'
            />
          </View>
        </View>

        <View 
          className={`mine-action-btn ${isSaving ? 'mine-action-btn--disabled' : 'mine-action-btn--primary'}`}
          onClick={!isSaving ? handleSaveSettings : undefined}
        >
          <Text className='mine-action-btn-text'>保存设置</Text>
        </View>

        <Text className='mine-setting-hint'>
          API Key 可在 SiliconFlow 官网获取。如已配置环境变量，可留空。
        </Text>
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
          <Text className='mine-setting-label'>关于四化节奏师</Text>
          <View className='mine-setting-arrow'>
            <Text className='mine-setting-arrow-text'>›</Text>
          </View>
        </View>
      </View>

      <View className='mine-footer'>
        <Text className='mine-footer-text'>基于紫微斗数四化理论</Text>
        <Text className='mine-footer-text'>AI 驱动的任务分析引擎</Text>
      </View>
    </ScrollView>
  );
}
