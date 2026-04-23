import { View, Text } from '@tarojs/components';
import './index.scss';
import type { AnalysisResult, ActionStep, DimensionAnalysis, JiDimensionAnalysis } from '@/types';
import ActionStepComponent from '@/components/ActionStep';
import { SIHUA_DIMENSION_NAMES, SIHUA_DIMENSION_MEANINGS } from '@/constants/sihuaRules';

interface ResultCardProps {
  result: AnalysisResult;
  onToggleStep?: (stepIndex: number) => void;
  showActions?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onToggleStep,
  showActions = true,
}) => {
  const renderDimensionAnalysis = (
    key: 'lu' | 'quan' | 'ke',
    data: DimensionAnalysis
  ) => {
    return (
      <View key={key} className='result-dimension'>
        <View className='result-dimension-header'>
          <View className='result-dimension-icon' style={{ backgroundColor: getDimensionColor(key) }}>
            <Text className='result-dimension-icon-text'>{SIHUA_DIMENSION_NAMES[key]}</Text>
          </View>
          <View className='result-dimension-title'>
            <Text className='result-dimension-name'>{data.star}</Text>
            <Text className='result-dimension-meaning'>{SIHUA_DIMENSION_MEANINGS[key]}</Text>
          </View>
        </View>
        <Text className='result-dimension-analysis'>{data.analysis}</Text>
        {data.actions.length > 0 && (
          <View className='result-dimension-actions'>
            {data.actions.map((action, idx) => (
              <View key={idx} className='result-dimension-action'>
                <View className='result-dimension-action-dot' />
                <Text className='result-dimension-action-text'>{action}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderJiAnalysis = (data: JiDimensionAnalysis) => {
    return (
      <View className='result-dimension result-dimension--ji'>
        <View className='result-dimension-header'>
          <View className='result-dimension-icon result-dimension-icon--ji'>
            <Text className='result-dimension-icon-text'>忌</Text>
          </View>
          <View className='result-dimension-title'>
            <Text className='result-dimension-name'>{data.star}</Text>
            <Text className='result-dimension-meaning'>{SIHUA_DIMENSION_MEANINGS.ji}</Text>
          </View>
        </View>
        <Text className='result-dimension-analysis'>{data.analysis}</Text>
        
        {data.warnings.length > 0 && (
          <View className='result-dimension-section'>
            <Text className='result-dimension-section-title'>⚠️ 注意事项</Text>
            {data.warnings.map((warning, idx) => (
              <View key={idx} className='result-dimension-warning'>
                <Text className='result-dimension-warning-text'>{warning}</Text>
              </View>
            ))}
          </View>
        )}
        
        {data.avoid.length > 0 && (
          <View className='result-dimension-section'>
            <Text className='result-dimension-section-title'>🚫 建议避免</Text>
            {data.avoid.map((item, idx) => (
              <View key={idx} className='result-dimension-avoid'>
                <Text className='result-dimension-avoid-text'>{item}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const getDimensionColor = (key: string) => {
    switch (key) {
      case 'lu': return '#4A7C59';
      case 'quan': return '#92703A';
      case 'ke': return '#4A6B8A';
      case 'ji': return '#9B4A4A';
      default: return '#57534E';
    }
  };

  return (
    <View className='result-card'>
      <View className='result-summary'>
        <Text className='result-summary-label'>今日待办</Text>
        <Text className='result-summary-text'>{result.summary}</Text>
      </View>

      {showActions && result.actionPath.length > 0 && (
        <View className='result-actions'>
          {result.actionPath.map((step, index) => (
            <ActionStepComponent
              key={step.step}
              step={step}
              onToggle={() => onToggleStep?.(index)}
            />
          ))}
        </View>
      )}

      {result.bestEntry && (
        <View className='result-best-entry'>
          <Text className='result-best-entry-label'>💡 最佳切入点</Text>
          <View className='result-best-entry-content'>
            <Text className='result-best-entry-reason'>{result.bestEntry.reason}</Text>
            <Text className='result-best-entry-suggestion'>{result.bestEntry.suggestion}</Text>
          </View>
        </View>
      )}

      <View className='result-dimensions'>
        <Text className='result-dimensions-title'>四维深度分析</Text>
        
        {renderDimensionAnalysis('lu', result.fourDimensions.lu)}
        {renderDimensionAnalysis('quan', result.fourDimensions.quan)}
        {renderDimensionAnalysis('ke', result.fourDimensions.ke)}
        {renderJiAnalysis(result.fourDimensions.ji)}
      </View>

      {result.overallAdvice && (
        <View className='result-overall'>
          <Text className='result-overall-label'>📌 整体建议</Text>
          <Text className='result-overall-text'>{result.overallAdvice}</Text>
        </View>
      )}
    </View>
  );
};

export default ResultCard;
