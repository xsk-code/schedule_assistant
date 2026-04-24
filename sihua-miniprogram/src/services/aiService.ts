import Taro from '@tarojs/taro';
import type { SihuaInfo, AnalysisResult, ActionStep, DimensionAnalysis, JiDimensionAnalysis, CollectedItem } from '@/types';
import { buildAnalysisPrompt } from '@/utils/promptBuilder';
import { APP_CONFIG } from '@/constants/appConfig';
import { storageService } from './storageService';

export interface APIError {
  type: 'network' | 'timeout' | 'auth' | 'rate_limit' | 'server' | 'invalid_response' | 'unknown';
  message: string;
  status?: number;
  originalError?: unknown;
}

export function createAPIError(
  type: APIError['type'],
  message: string,
  status?: number,
  originalError?: unknown
): Error {
  const error = new Error(message);
  (error as any).apiErrorType = type;
  (error as any).status = status;
  (error as any).originalError = originalError;
  return error;
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function convertKeysToCamelCase(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToCamelCase(item));
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
      const camelKey = snakeToCamel(key);
      result[camelKey] = convertKeysToCamelCase(value);
    });
    return result;
  }
  
  return obj;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateString(value: unknown, fieldName: string): string {
  if (!isString(value)) {
    throw new Error(`期望 ${fieldName} 是字符串，但得到 ${typeof value}`);
  }
  return value;
}

function validateArray(value: unknown, fieldName: string): unknown[] {
  if (!isArray(value)) {
    throw new Error(`期望 ${fieldName} 是数组，但得到 ${typeof value}`);
  }
  return value;
}

function validateObject(value: unknown, fieldName: string): Record<string, unknown> {
  if (!isObject(value)) {
    throw new Error(`期望 ${fieldName} 是对象，但得到 ${typeof value}`);
  }
  return value;
}

function validateDimensionAnalysis(data: unknown, dim: string): DimensionAnalysis {
  const obj = validateObject(data, `fourDimensions.${dim}`);
  return {
    star: validateString(obj.star, `fourDimensions.${dim}.star`),
    analysis: validateString(obj.analysis, `fourDimensions.${dim}.analysis`),
    actions: validateArray(obj.actions, `fourDimensions.${dim}.actions`).map((item, idx) => 
      validateString(item, `fourDimensions.${dim}.actions[${idx}]`)
    ),
  };
}

function validateJiDimensionAnalysis(data: unknown): JiDimensionAnalysis {
  const obj = validateObject(data, 'fourDimensions.ji');
  return {
    star: validateString(obj.star, 'fourDimensions.ji.star'),
    analysis: validateString(obj.analysis, 'fourDimensions.ji.analysis'),
    warnings: validateArray(obj.warnings, 'fourDimensions.ji.warnings').map((item, idx) =>
      validateString(item, `fourDimensions.ji.warnings[${idx}]`)
    ),
    avoid: validateArray(obj.avoid, 'fourDimensions.ji.avoid').map((item, idx) =>
      validateString(item, `fourDimensions.ji.avoid[${idx}]`)
    ),
  };
}

function validateActionStep(data: unknown, index: number): ActionStep {
  const obj = validateObject(data, `actionPath[${index}]`);
  
  const priority = validateString(obj.priority, `actionPath[${index}].priority`);
  if (!['高', '中', '低'].includes(priority)) {
    throw new Error(`actionPath[${index}].priority 期望是 "高"、"中" 或 "低"，但得到 "${priority}"`);
  }
  
  const dimension = validateString(obj.dimension, `actionPath[${index}].dimension`);
  if (!['lu', 'quan', 'ke', 'ji'].includes(dimension)) {
    throw new Error(`actionPath[${index}].dimension 期望是 "lu"、"quan"、"ke" 或 "ji"，但得到 "${dimension}"`);
  }
  
  return {
    step: typeof obj.step === 'number' ? obj.step : parseInt(String(obj.step), 10) || 0,
    title: validateString(obj.title, `actionPath[${index}].title`),
    description: validateString(obj.description, `actionPath[${index}].description`),
    dimension: dimension as 'lu' | 'quan' | 'ke' | 'ji',
    priority: priority as '高' | '中' | '低',
    timeEstimate: validateString(obj.timeEstimate || obj.time_estimate, `actionPath[${index}].timeEstimate`),
  };
}

function validateAnalysisResult(data: unknown): AnalysisResult {
  const obj = validateObject(data, 'root');
  
  const fourDimensionsData = obj.fourDimensions || obj.four_dimensions;
  const fourDimensionsObj = validateObject(fourDimensionsData, 'fourDimensions');
  
  const actionPathData = obj.actionPath || obj.action_path;
  const actionPathArray = validateArray(actionPathData, 'actionPath');

  let bestEntry: AnalysisResult['bestEntry'] = undefined;
  const bestEntryData = obj.bestEntry || obj.best_entry;
  if (bestEntryData) {
    try {
      const bestEntryObj = validateObject(bestEntryData, 'bestEntry');
      const bestEntryDimension = validateString(bestEntryObj.dimension, 'bestEntry.dimension');
      if (['lu', 'quan', 'ke'].includes(bestEntryDimension)) {
        bestEntry = {
          dimension: bestEntryDimension as 'lu' | 'quan' | 'ke',
          reason: validateString(bestEntryObj.reason, 'bestEntry.reason'),
          suggestion: validateString(bestEntryObj.suggestion, 'bestEntry.suggestion'),
        };
      }
    } catch {
    }
  }

  let overallAdvice: string | undefined = undefined;
  try {
    overallAdvice = validateString(obj.overallAdvice || obj.overall_advice, 'overallAdvice');
  } catch {
  }
  
  const result: AnalysisResult = {
    summary: validateString(obj.summary, 'summary'),
    bestEntry,
    fourDimensions: {
      lu: validateDimensionAnalysis(fourDimensionsObj.lu, 'lu'),
      quan: validateDimensionAnalysis(fourDimensionsObj.quan, 'quan'),
      ke: validateDimensionAnalysis(fourDimensionsObj.ke, 'ke'),
      ji: validateJiDimensionAnalysis(fourDimensionsObj.ji),
    },
    actionPath: actionPathArray.map((item, idx) => validateActionStep(item, idx)),
    overallAdvice,
  };
  
  return result;
}

export async function analyzeTask(
  task: string,
  sihuaInfo: SihuaInfo,
  collectedInfo: CollectedItem[] = []
): Promise<AnalysisResult> {
  const url = `${APP_CONFIG.API_BASE_URL}/chat/completions`;
  const savedSettings = storageService.getSettings();
  const apiKey = APP_CONFIG.API_KEY || savedSettings.apiKey || '';
  const model = APP_CONFIG.DEFAULT_MODEL;

  if (!apiKey) {
    throw createAPIError('auth', 'API Key 未配置。请在「我的」页面中设置 API Key，或在开发环境中配置 TARO_APP_API_KEY 环境变量。');
  }

  const prompt = buildAnalysisPrompt(task, sihuaInfo, collectedInfo);

  try {
    const response = await Taro.request({
      url,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      data: {
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: APP_CONFIG.TEMPERATURE,
        max_tokens: APP_CONFIG.MAX_TOKENS,
      },
      timeout: APP_CONFIG.API_TIMEOUT,
    });

    if (response.statusCode !== 200) {
      const errorData = response.data as any;
      const errorObject = errorData.error as { message?: string } | undefined;
      const errorMessage = errorObject?.message || `API调用失败: ${response.statusCode}`;
      
      if (response.statusCode === 401) {
        throw createAPIError('auth', `API Key 无效或已过期。\n详细信息: ${errorMessage}`, response.statusCode, errorData);
      }
      
      if (response.statusCode === 429) {
        throw createAPIError('rate_limit', `请求过于频繁，请稍后重试。\n详细信息: ${errorMessage}`, response.statusCode, errorData);
      }
      
      if (response.statusCode >= 500) {
        throw createAPIError('server', `服务器错误 (${response.statusCode})。请稍后重试。\n详细信息: ${errorMessage}`, response.statusCode, errorData);
      }
      
      throw createAPIError('server', errorMessage, response.statusCode, errorData);
    }

    const data = response.data as any;
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw createAPIError('invalid_response', 'API 返回内容为空。请检查模型是否可用。', response.statusCode, data);
    }
    
    try {
      const rawResult = JSON.parse(content);
      const camelCaseResult = convertKeysToCamelCase(rawResult);
      const validatedResult = validateAnalysisResult(camelCaseResult);
      return validatedResult;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : '未知错误';
      throw createAPIError('invalid_response', 
        `AI 返回的数据格式不符合预期。\n\n错误原因: ${errorMsg}\n\n返回内容预览:\n${content.substring(0, 300)}...`, 
        response.statusCode, e);
    }
  } catch (error) {
    if (error instanceof Error && (error as any).apiErrorType) {
      throw error;
    }
    
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    if (errorMsg.includes('timeout') || errorMsg.includes('超时')) {
      throw createAPIError('timeout', 
        `API 调用超时 (${APP_CONFIG.API_TIMEOUT / 1000}秒)。\n可能的原因：\n1. 网络连接不稳定\n2. 模型响应较慢\n\n建议：请检查网络连接或稍后重试。`,
        undefined, error);
    }
    
    if (errorMsg.includes('request') || errorMsg.includes('网络')) {
      throw createAPIError('network', 
        `网络连接失败。\n可能的原因：\n1. 无法连接到硅基流动 API\n2. 网络连接中断\n\n建议：请检查您的网络连接`,
        undefined, error);
    }
    
    throw createAPIError('unknown', 
      `发生未知错误: ${errorMsg}`,
      undefined, error);
  }
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  const url = `${APP_CONFIG.API_BASE_URL}/models`;
  
  try {
    const response = await Taro.request({
      url,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    return response.statusCode === 200;
  } catch {
    return false;
  }
}
