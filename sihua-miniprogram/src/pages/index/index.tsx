import { useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import './index.scss';
import Taro from '@tarojs/taro';
import { useTaskStore } from '@/store/useTaskStore';
import SihuaBar from '@/components/SihuaBar';
import TaskInput from '@/components/TaskInput';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import ConversationPanel from '@/components/ConversationPanel';
import ResultCard from '@/components/ResultCard';

export default function Index() {
  const {
    sihuaInfo,
    task,
    mode,
    status,
    error,
    result,
    conversation,
    initSihua,
    setTask,
    setMode,
    startAnalysis,
    continueConversation,
    skipConversation,
    resetTask,
    saveToHistory,
    toggleStepCompletion,
  } = useTaskStore();

  useEffect(() => {
    initSihua();
  }, [initSihua]);

  useEffect(() => {
    if (error) {
      Taro.showToast({
        title: error,
        icon: 'none',
        duration: 3000,
      });
    }
  }, [error]);

  const handleSubmit = useCallback(() => {
    if (!task || task.trim().length === 0) {
      Taro.showToast({
        title: '请输入任务描述',
        icon: 'none',
      });
      return;
    }
    startAnalysis();
  }, [task, startAnalysis]);

  const handleSaveToHistory = useCallback(() => {
    const record = saveToHistory();
    if (record) {
      Taro.showToast({
        title: '已保存到历史记录',
        icon: 'success',
      });
    }
  }, [saveToHistory]);

  const handleNewAnalysis = useCallback(() => {
    resetTask();
  }, [resetTask]);

  const renderContent = () => {
    if (status === 'analyzing') {
      return (
        <View className='home-content'>
          <Loading message='正在分析任务...' />
        </View>
      );
    }

    if (status === 'conversing') {
      return (
        <View className='home-content'>
          <ConversationPanel
            question={conversation.currentQuestion}
            currentRound={conversation.currentRound}
            maxRounds={conversation.maxRounds}
            onSelectOption={continueConversation}
            onSkip={skipConversation}
            isGenerating={conversation.isGenerating}
          />
        </View>
      );
    }

    if (status === 'success' && result) {
      return (
        <View className='home-content'>
          <ResultCard
            result={result}
            onToggleStep={toggleStepCompletion}
            showActions={true}
          />
          
          <View className='home-actions'>
            <View className='home-action-btn home-action-btn--primary' onClick={handleSaveToHistory}>
              <Text className='home-action-btn-text'>保存记录</Text>
            </View>
            <View className='home-action-btn' onClick={handleNewAnalysis}>
              <Text className='home-action-btn-text home-action-btn-text--secondary'>新的分析</Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View className='home-content'>
        <Empty
          title='输入您的任务'
          description='别蛮干将根据今日四化能量，帮你找到最省力的行动路径'
        />
      </View>
    );
  };

  return (
    <ScrollView 
      className='home-container'
      scrollY
      enhanced
      showScrollbar={false}
    >
      <View className='home-header'>
        <Text className='home-title'>别蛮干</Text>
        <Text className='home-subtitle'>等对时机再出手</Text>
      </View>

      {sihuaInfo && <SihuaBar sihuaInfo={sihuaInfo} />}

      <TaskInput
        value={task}
        mode={mode}
        onModeChange={setMode}
        onChange={setTask}
        onSubmit={handleSubmit}
        loading={status === 'analyzing' || status === 'conversing'}
        disabled={status === 'analyzing' || status === 'conversing'}
      />

      {renderContent()}

    </ScrollView>
  );
}
