import Taro from '@tarojs/taro';
import type { CollectedItem, AIResponse } from '@/types';
import { APP_CONFIG } from '@/constants/appConfig';
import { buildConversationPrompt } from '@/utils/promptBuilder';
import { createAPIError } from './aiService';
import { storageService } from './storageService';

function validateAIResponse(data: unknown): AIResponse {
  if (typeof data !== 'object' || data === null) {
    throw new Error('响应不是对象类型');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.needsMoreInfo !== 'boolean') {
    throw new Error('needsMoreInfo 必须是布尔值');
  }

  const result: AIResponse = {
    needsMoreInfo: obj.needsMoreInfo,
  };

  if (obj.needsMoreInfo) {
    if (typeof obj.question !== 'string') {
      throw new Error('question 必须是字符串');
    }
    if (!Array.isArray(obj.options)) {
      throw new Error('options 必须是数组');
    }
    if (obj.options.length === 0) {
      throw new Error('options 数组不能为空');
    }

    result.question = obj.question;
    result.options = obj.options.map((opt: unknown) => String(opt));
    result.reasoning = typeof obj.reasoning === 'string' ? obj.reasoning : undefined;
  } else {
    result.reasoning = typeof obj.reasoning === 'string' ? obj.reasoning : undefined;
    result.summary = typeof obj.summary === 'string' ? obj.summary : undefined;
  }

  return result;
}

export async function clarifyTask(
  task: string,
  collectedInfo: CollectedItem[],
  currentRound: number,
  maxRounds: number = APP_CONFIG.CONVERSATION.MAX_ROUNDS
): Promise<AIResponse> {
  const url = `${APP_CONFIG.API_BASE_URL}/chat/completions`;
  const savedSettings = storageService.getSettings();
  const apiKey = APP_CONFIG.API_KEY || savedSettings.apiKey || '';
  const model = APP_CONFIG.DEFAULT_MODEL;

  if (!apiKey) {
    throw createAPIError('auth', 'API Key 未配置。请在「我的」页面中设置 API Key，或在开发环境中配置 TARO_APP_API_KEY 环境变量。');
  }

  const prompt = buildConversationPrompt(task, collectedInfo, currentRound, maxRounds);

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
        max_tokens: 1000,
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
      throw createAPIError('invalid_response', 'API 返回内容为空。', response.statusCode, data);
    }
    
    try {
      const rawResult = JSON.parse(content);
      const validatedResult = validateAIResponse(rawResult);
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
        `API 调用超时 (${APP_CONFIG.API_TIMEOUT / 1000}秒)。`,
        undefined, error);
    }
    
    throw createAPIError('unknown', 
      `发生未知错误: ${errorMsg}`,
      undefined, error);
  }
}
