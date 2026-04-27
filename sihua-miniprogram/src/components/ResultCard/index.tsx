import { View, Text } from '@tarojs/components';
import './index.scss';
import type { AnalysisResult, ActionStep, DimensionAnalysis, JiDimensionAnalysis } from '@/types';
import ActionStepComponent from '@/components/ActionStep';
import { SIHUA_DIMENSION_NAMES, SIHUA_DIMENSION_MEANINGS } from '@/constants/sihuaRules';
import { AlertTriangle, XCircle, Lightbulb } from '@/components/Icons';

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
      <View key={key} className={`result-dimension result-dimension--${key}`}>
        <View className='result-dimension-header'>
          <View className='result-dimension-title'>
            <Text className='result-dimension-name'>{data.star}{SIHUA_DIMENSION_NAMES[key]}</Text>
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
          <View className='result-dimension-title'>
            <Text className='result-dimension-name'>{data.star}{SIHUA_DIMENSION_NAMES.ji}</Text>
            <Text className='result-dimension-meaning'>{SIHUA_DIMENSION_MEANINGS.ji}</Text>
          </View>
        </View>
        <Text className='result-dimension-analysis'>{data.analysis}</Text>
        
        {data.warnings.length > 0 && (
          <View className='result-dimension-section'>
            <View className='result-dimension-section-title'>
              <AlertTriangle size={24} color='#B46A5E' />
              <Text>注意事项</Text>
            </View>
            {data.warnings.map((warning, idx) => (
              <View key={idx} className='result-dimension-warning'>
                <Text className='result-dimension-warning-text'>{warning}</Text>
              </View>
            ))}
          </View>
        )}
        
        {data.avoid.length > 0 && (
          <View className='result-dimension-section'>
            <View className='result-dimension-section-title'>
              <XCircle size={24} color='#B46A5E' />
              <Text>建议避免</Text>
            </View>
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

  return (
    <View className='result-card'>
      <View className='result-summary'>
        <Text className='result-summary-label'>今日待办</Text>
        <View className='result-summary-decoration' />
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
          <View className='result-best-entry-label'>
            <View className='result-best-entry-seal' />
            <Text>最佳切入点</Text>
          </View>
          <View className='result-best-entry-content'>
            <Text className='result-best-entry-reason'>{result.bestEntry.reason}</Text>
            <Text className='result-best-entry-suggestion'>{result.bestEntry.suggestion}</Text>
          </View>
        </View>
      )}

      <View className='result-dimensions'>
        <Text className='result-dimensions-title'>四化深解</Text>
        
        {renderDimensionAnalysis('lu', result.fourDimensions.lu)}
        {renderDimensionAnalysis('quan', result.fourDimensions.quan)}
        {renderDimensionAnalysis('ke', result.fourDimensions.ke)}
        {renderJiAnalysis(result.fourDimensions.ji)}
      </View>

      {result.overallAdvice && (
        <View className='result-overall'>
          <View className='result-overall-label'>
            <Lightbulb size={24} color='#8C7E72' />
            <Text>整体建议</Text>
          </View>
          <Text className='result-overall-text'>{result.overallAdvice}</Text>
        </View>
      )}
    </View>
  );
};

export default ResultCard;
