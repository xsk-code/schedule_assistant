import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import './index.scss';
import Taro from '@tarojs/taro';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useStatusBarHeight } from '@/hooks/useStatusBarHeight';
import type { HistoryRecord } from '@/types';
import Loading from '@/components/Loading';
import SihuaBar from '@/components/SihuaBar';
import ResultCard from '@/components/ResultCard';
import Empty from '@/components/Empty';
import ArrowLeft from '@/components/Icons/ArrowLeft';

export default function Detail() {
  const { records, getRecordById, deleteRecord } = useHistoryStore();
  const [record, setRecord] = useState<HistoryRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const statusBarHeight = useStatusBarHeight();

  useEffect(() => {
    const currentPages = Taro.getCurrentPages();
    const currentPage = currentPages[currentPages.length - 1];
    const options = currentPage.options as { id?: string };
    const id = options?.id;

    if (!id) {
      Taro.showToast({
        title: '记录不存在',
        icon: 'none',
      });
      setIsLoading(false);
      return;
    }

    let foundRecord = getRecordById(id);
    
    if (!foundRecord && records.length > 0) {
      foundRecord = records.find(r => r.id === id) || null;
    }

    if (foundRecord) {
      setRecord(foundRecord);
    } else {
      Taro.showToast({
        title: '记录不存在',
        icon: 'none',
      });
    }
    
    setIsLoading(false);
  }, [records, getRecordById]);

  const toggleStepCompletion = useCallback((stepIndex: number) => {
    if (!record) return;

    const newActionPath = [...record.result.actionPath];
    if (newActionPath[stepIndex]) {
      newActionPath[stepIndex] = {
        ...newActionPath[stepIndex],
        completed: !newActionPath[stepIndex].completed,
      };

      const updatedRecord: HistoryRecord = {
        ...record,
        result: {
          ...record.result,
          actionPath: newActionPath,
        },
      };

      setRecord(updatedRecord);
    }
  }, [record]);

  const handleDelete = useCallback(() => {
    if (!record) return;

    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？删除后无法恢复。',
      success: (res: { confirm: boolean; cancel: boolean }) => {
        if (res.confirm) {
          deleteRecord(record.id);
          Taro.showToast({
            title: '已删除',
            icon: 'success',
          });
          Taro.navigateBack();
        }
      },
    });
  }, [record, deleteRecord]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  };

  if (isLoading) {
    return (
      <View className='detail-container'>
        <Loading message='加载中...' />
      </View>
    );
  }

  if (!record) {
    return (
      <View className='detail-container'>
        <Empty
          title='记录不存在'
          description='该记录可能已被删除'
        />
      </View>
    );
  }

  const sihuaInfo = {
    solarDate: record.dateInfo.solarDate,
    lunarDate: record.dateInfo.lunarDate,
    dayGanZhi: `${record.dateInfo.dayGan}${record.dateInfo.dayZhi}`,
    dayGan: record.dateInfo.dayGan,
    dayZhi: record.dateInfo.dayZhi,
    sihua: record.sihua,
  };

  return (
    <ScrollView 
      className='detail-container'
      scrollY
      enhanced
      showScrollbar={false}
    >
      <View className='detail-nav' style={{ paddingTop: `${statusBarHeight}px` }}>
        <View className='detail-nav-back' onClick={() => Taro.navigateBack()}>
          <ArrowLeft size={36} color='#2C2420' />
        </View>
        <Text className='detail-nav-title'>深度解析</Text>
        <View className='detail-nav-placeholder' />
      </View>

      <View className='detail-header'>
        <View className='detail-task-card'>
          <Text className='detail-task-label'>原始任务</Text>
          <Text className='detail-task-text'>{record.task}</Text>
        </View>
        
        <View className='detail-meta'>
          <Text className='detail-meta-text'>{formatDate(record.createdAt)}</Text>
          <View className='detail-delete' onClick={handleDelete}>
            <Text className='detail-delete-text'>删除</Text>
          </View>
        </View>
      </View>

      <SihuaBar sihuaInfo={sihuaInfo} />

      <View className='detail-content'>
        <ResultCard
          result={record.result}
          onToggleStep={toggleStepCompletion}
          showActions={true}
        />
      </View>

      <View className='detail-footer'>
        <Text className='detail-footer-text'>基于四化能量理论</Text>
      </View>
    </ScrollView>
  );
}
