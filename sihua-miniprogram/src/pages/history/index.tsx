import { useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import './index.scss';
import Taro from '@tarojs/taro';
import { useHistoryStore } from '@/store/useHistoryStore';
import Empty from '@/components/Empty';
import type { HistoryRecord } from '@/types';

export default function History() {
  const { records, isLoaded, loadHistory, deleteRecord, clearAll } = useHistoryStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}月${day}日 ${hours}:${minutes}`;
  };

  const handleItemClick = useCallback((record: HistoryRecord) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${record.id}`,
    });
  }, []);

  const handleDelete = useCallback((id: string, e: any) => {
    e.stopPropagation();
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？删除后无法恢复。',
      success: (res: { confirm: boolean; cancel: boolean }) => {
        if (res.confirm) {
          deleteRecord(id);
          Taro.showToast({
            title: '已删除',
            icon: 'success',
          });
        }
      },
    });
  }, [deleteRecord]);

  const handleClearAll = useCallback(() => {
    Taro.showModal({
      title: '清空案卷',
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

  const renderSihuaTag = (label: string, star: string) => {
    const labels: Record<string, string> = {
      lu: '禄',
      quan: '权',
      ke: '科',
      ji: '忌',
    };

    return (
      <View 
        className={`history-sihua-tag`}
      >
        <View className={`history-sihua-tag-dot history-sihua-tag-dot--${label}`} />
        <Text className={`history-sihua-tag-label history-sihua-tag-label--${label}`}>
          {labels[label]}
        </Text>
        <Text className='history-sihua-tag-star'>{star}</Text>
      </View>
    );
  };

  return (
    <ScrollView 
      className='history-container'
      scrollY
      enhanced
      showScrollbar={false}
    >
      <View className='history-header'>
        <View className='history-header-left'>
          <Text className='history-title'>案卷</Text>
          <Text className='history-count'>共 {records.length} 条</Text>
        </View>
        {records.length > 0 && (
          <View className='history-header-right' onClick={handleClearAll}>
            <Text className='history-clear'>清空</Text>
          </View>
        )}
      </View>

      {!isLoaded ? (
        <View className='history-loading'>
          <Text className='history-loading-text'>正在研读天机…</Text>
        </View>
      ) : records.length === 0 ? (
        <View className='history-empty'>
          <Empty
            title='暂无案卷'
            description='您的任务分析记录将显示在这里'
          />
        </View>
      ) : (
        <View className='history-list'>
          {records.map((record) => (
            <View 
              key={record.id}
              className='history-item'
              onClick={() => handleItemClick(record)}
            >
              <View className='history-item-header'>
                <Text className='history-item-task' numberOfLines={2}>
                  {record.task}
                </Text>
                <View 
                  className='history-item-delete'
                  onClick={(e) => handleDelete(record.id, e)}
                >
                  <Text className='history-item-delete-icon'>×</Text>
                </View>
              </View>

              <View className='history-item-meta'>
                <Text className='history-item-date'>
                  {formatDate(record.createdAt)}
                </Text>
                <Text className='history-item-ganzhi'>
                  {record.dateInfo.dayGan}{record.dateInfo.dayZhi}日
                </Text>
              </View>

              <View className='history-item-sihua'>
                {renderSihuaTag('lu', record.sihua.lu)}
                {renderSihuaTag('quan', record.sihua.quan)}
                {renderSihuaTag('ke', record.sihua.ke)}
                {renderSihuaTag('ji', record.sihua.ji)}
              </View>

              <View className='history-item-summary'>
                <Text className='history-item-summary-label'>今日待办</Text>
                <Text className='history-item-summary-text' numberOfLines={2}>
                  {record.result.summary}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

    </ScrollView>
  );
}
