import type { SihuaInfo, AnalysisResult, ActionStep, DimensionAnalysis, JiDimensionAnalysis, CollectedItem } from '../types';
import { buildAnalysisPrompt } from '../utils/promptBuilder';
import { APP_CONFIG } from '../constants/appConfig';

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

export function logError(type: string, details: Record<string, unknown>) {
  console.group(`🔴 [API Error] ${type}`);
  Object.entries(details).forEach(([key, value]) => {
    console.log(`  ${key}:`, value);
  });
  console.groupEnd();
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
  console.group('🔍 [Data Validation] 开始验证 AI 响应格式');
  console.log('原始数据:', data);
  
  try {
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
        console.log('⚠️ bestEntry 验证失败，跳过（兼容旧数据）');
      }
    }

    let overallAdvice: string | undefined = undefined;
    try {
      overallAdvice = validateString(obj.overallAdvice || obj.overall_advice, 'overallAdvice');
    } catch {
      console.log('⚠️ overallAdvice 缺失，跳过（兼容旧数据）');
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
    
    console.log('✅ [Data Validation] 验证成功');
    console.groupEnd();
    return result;
  } catch (error) {
    console.log('❌ [Data Validation] 验证失败');
    console.log('错误:', error);
    console.groupEnd();
    throw error;
  }
}

export async function analyzeTask(
  task: string,
  sihuaInfo: SihuaInfo,
  model: string = APP_CONFIG.DEFAULT_MODEL,
  collectedInfo: CollectedItem[] = []
): Promise<AnalysisResult> {
  const url = '/api/chat';
  
  console.group('📤 [API Request] analyzeTask');
  console.log('  URL:', url);
  console.log('  Model:', model);
  console.log('  Task length:', task.length);
  console.log('  Collected info count:', collectedInfo.length);
  console.groupEnd();

  const prompt = buildAnalysisPrompt(task, sihuaInfo, collectedInfo);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    logError('Timeout', {
      url,
      model,
      timeout: `${APP_CONFIG.API_TIMEOUT / 1000}秒`,
    });
    controller.abort();
  }, APP_CONFIG.API_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    console.group('📥 [API Response]');
    console.log('  Status:', response.status, response.statusText);
    console.log('  OK:', response.ok);
    console.groupEnd();
    
    if (!response.ok) {
      let errorData: Record<string, unknown> = {};
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { parseError: '无法解析错误响应' };
      }

      logError('API Error', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url,
        model,
      });

      const errorObject = errorData.error as { message?: string } | undefined;
      const errorMessage = errorObject?.message || `API调用失败: ${response.status}`;
      
      if (response.status === 401) {
        throw createAPIError('auth', `API Key 无效或已过期。请检查服务端 API Key 配置。\n详细信息: ${errorMessage}`, response.status, errorData);
      }
      
      if (response.status === 429) {
        throw createAPIError('rate_limit', `请求过于频繁，请稍后重试。\n详细信息: ${errorMessage}`, response.status, errorData);
      }
      
      if (response.status >= 500) {
        throw createAPIError('server', `服务器错误 (${response.status})。请稍后重试。\n详细信息: ${errorMessage}`, response.status, errorData);
      }
      
      throw createAPIError('server', errorMessage, response.status, errorData);
    }
    
    let data: Record<string, unknown>;
    try {
      data = await response.json();
    } catch (e) {
      logError('Invalid Response', {
        url,
        model,
        status: response.status,
        error: e,
      });
      throw createAPIError('invalid_response', '无法解析 API 响应。响应格式不正确。', response.status, e);
    }

    console.group('📥 [API Response Data]');
    console.log('  choices:', data.choices);
    console.groupEnd();

    const content = (data as any).choices?.[0]?.message?.content;
    
    if (!content) {
      logError('Empty Response', {
        url,
        model,
        data,
      });
      throw createAPIError('invalid_response', 'API 返回内容为空。请检查模型是否可用或稍后重试。', response.status, data);
    }
    
    console.group('📝 [AI Content]');
    console.log('原始内容:', content);
    console.groupEnd();
    
    try {
      console.group('🔄 [JSON Parse]');
      const rawResult = JSON.parse(content);
      console.log('解析结果:', rawResult);
      console.groupEnd();
      
      const camelCaseResult = convertKeysToCamelCase(rawResult);
      console.log('转换后:', camelCaseResult);
      
      const validatedResult = validateAnalysisResult(camelCaseResult);
      console.log('✅ [API Success] 解析和验证成功');
      return validatedResult;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : '未知错误';
      
      logError('Response Validation Error', {
        url,
        model,
        content: content.substring(0, 500) + (content.length > 500 ? '...' : ''),
        error: errorMsg,
      });
      
      throw createAPIError('invalid_response', 
        `AI 返回的数据格式不符合预期。\n\n错误原因: ${errorMsg}\n\n请检查模型是否正确返回了 JSON 格式的数据。\n\n返回内容预览:\n${content.substring(0, 300)}...`, 
        response.status, e);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && (error as any).apiErrorType) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw createAPIError('timeout', 
        `API 调用超时 (${APP_CONFIG.API_TIMEOUT / 1000}秒)。\n可能的原因：\n1. 网络连接不稳定\n2. 模型响应较慢（大模型可能需要更长时间）\n3. 服务暂时不可用\n\n建议：请检查网络连接或稍后重试。`,
        undefined, error);
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      logError('Network Error', {
        error: error.message,
      });
      throw createAPIError('network', 
        `网络连接失败。\n可能的原因：\n1. 网络连接中断\n2. 服务暂时不可用\n\n建议：请检查您的网络连接后重试。`,
        undefined, error);
    }
    
    logError('Unknown Error', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    throw createAPIError('unknown', 
      `发生未知错误: ${error instanceof Error ? error.message : error}`,
      undefined, error);
  }
}
