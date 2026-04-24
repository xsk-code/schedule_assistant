import Taro from '@tarojs/taro';
import type { CollectedItem, AIResponse } from '@/types';
import { APP_CONFIG } from '@/constants/appConfig';
import { buildConversationPrompt } from '@/utils/promptBuilder';
import { createAPIError, logError } from './aiService';

function validateAIResponse(data: unknown): AIResponse {
  console.group('🔍 [Conversation Validation] 开始验证 AI 响应格式');
  console.log('原始数据:', data);

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

  console.log('✅ [Conversation Validation] 验证成功');
  console.groupEnd();
  return result;
}

export async function clarifyTask(
  task: string,
  collectedInfo: CollectedItem[],
  currentRound: number,
  maxRounds: number = APP_CONFIG.CONVERSATION.MAX_ROUNDS
): Promise<AIResponse> {
  const url = `${APP_CONFIG.API_BASE_URL}/chat/completions`;
  const apiKey = APP_CONFIG.API_KEY;
  const model = APP_CONFIG.DEFAULT_MODEL;

  console.group('📤 [API Request] clarifyTask');
  console.log('  URL:', url);
  console.log('  Model:', model);
  console.log('  Round:', currentRound, '/', maxRounds);
  console.groupEnd();

  if (!apiKey) {
    throw createAPIError('auth', 'API Key 未配置。请通过环境变量 TARO_APP_API_KEY 配置您的 API Key。');
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

    console.group('📥 [API Response]');
    console.log('  Status:', response.statusCode);
    console.log('  OK:', response.statusCode === 200);
    console.groupEnd();

    if (response.statusCode !== 200) {
      let errorData: Record<string, unknown> = {};
      try {
        errorData = response.data as any;
      } catch (e) {
        errorData = { parseError: '无法解析错误响应' };
      }

      logError('API Error', {
        status: response.statusCode,
        errorData,
        url,
        model,
      });

      const errorObject = (errorData as any).error as { message?: string } | undefined;
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

    console.group('📥 [API Response Data]');
    console.log('  choices:', data.choices);
    console.groupEnd();
    
    if (!content) {
      logError('Empty Response', {
        url,
        model,
        data,
      });
      throw createAPIError('invalid_response', 'API 返回内容为空。', response.statusCode, data);
    }

    console.group('📝 [AI Content]');
    console.log('原始内容:', content);
    console.groupEnd();
    
    try {
      console.group('🔄 [JSON Parse]');
      const rawResult = JSON.parse(content);
      console.log('解析结果:', rawResult);
      console.groupEnd();

      const validatedResult = validateAIResponse(rawResult);
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
        `AI 返回的数据格式不符合预期。\n\n错误原因: ${errorMsg}\n\n返回内容预览:\n${content.substring(0, 300)}...`,
        response.statusCode, e);
    }
  } catch (error) {
    if (error instanceof Error && (error as any).apiErrorType) {
      throw error;
    }
    
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    if (errorMsg.includes('timeout') || errorMsg.includes('超时')) {
      logError('Timeout', {
        url,
        model,
        timeout: `${APP_CONFIG.API_TIMEOUT / 1000}秒`,
      });
      throw createAPIError('timeout', 
        `API 调用超时 (${APP_CONFIG.API_TIMEOUT / 1000}秒)。`,
        undefined, error);
    }
    
    if (errorMsg.includes('request') || errorMsg.includes('网络')) {
      logError('Network Error', {
        error: errorMsg,
        url: APP_CONFIG.API_BASE_URL,
      });
      throw createAPIError('network', 
        `网络连接失败。\n可能的原因：\n1. 无法连接到硅基流动 API\n2. 网络连接中断\n\n建议：请检查您的网络连接`,
        undefined, error);
    }
    
    logError('Unknown Error', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    throw createAPIError('unknown', 
      `发生未知错误: ${errorMsg}`,
      undefined, error);
  }
}
