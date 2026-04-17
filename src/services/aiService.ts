import type { SihuaInfo, AnalysisResult } from '../types';
import { buildAnalysisPrompt } from '../utils/promptBuilder';
import { APP_CONFIG } from '../constants/appConfig';

export interface APIError {
  type: 'network' | 'timeout' | 'auth' | 'rate_limit' | 'server' | 'invalid_response' | 'unknown';
  message: string;
  status?: number;
  originalError?: unknown;
}

function createAPIError(
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

function logError(type: string, details: Record<string, unknown>) {
  console.group(`🔴 [API Error] ${type}`);
  Object.entries(details).forEach(([key, value]) => {
    console.log(`  ${key}:`, value);
  });
  console.groupEnd();
}

export async function analyzeTask(
  task: string,
  sihuaInfo: SihuaInfo,
  apiKey: string,
  model: string = APP_CONFIG.DEFAULT_MODEL
): Promise<AnalysisResult> {
  const url = `${APP_CONFIG.API_BASE_URL}/chat/completions`;
  
  console.group('📤 [API Request] analyzeTask');
  console.log('  URL:', url);
  console.log('  Model:', model);
  console.log('  Task length:', task.length);
  console.groupEnd();

  const prompt = buildAnalysisPrompt(task, sihuaInfo);
  
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
        'Authorization': `Bearer ${apiKey}`,
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
        throw createAPIError('auth', `API Key 无效或已过期。请检查您的 API Key 配置。\n详细信息: ${errorMessage}`, response.status, errorData);
      }
      
      if (response.status === 429) {
        throw createAPIError('rate_limit', `请求过于频繁，请稍后重试。\n详细信息: ${errorMessage}`, response.status, errorData);
      }
      
      if (response.status >= 500) {
        throw createAPIError('server', `服务器错误 (${response.status})。请稍后重试或联系支持。\n详细信息: ${errorMessage}`, response.status, errorData);
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
    
    try {
      const result = JSON.parse(content) as AnalysisResult;
      console.log('✅ [API Success] 解析响应成功');
      return result;
    } catch (e) {
      logError('JSON Parse Error', {
        url,
        model,
        content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        error: e,
      });
      throw createAPIError('invalid_response', `解析 AI 响应失败。响应不是有效的 JSON 格式。\n响应内容预览: ${content.substring(0, 100)}...`, response.status, e);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && (error as any).apiErrorType) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw createAPIError('timeout', 
        `API 调用超时 (${APP_CONFIG.API_TIMEOUT / 1000}秒)。\n可能的原因：\n1. 网络连接不稳定\n2. 模型响应较慢（大模型可能需要更长时间）\n3. 硅基流动服务暂时不可用\n\n建议：请检查网络连接或稍后重试。`,
        undefined, error);
    }
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      logError('Network Error', {
        error: error.message,
        url: APP_CONFIG.API_BASE_URL,
      });
      throw createAPIError('network', 
        `网络连接失败。\n可能的原因：\n1. 无法连接到硅基流动 API (${APP_CONFIG.API_BASE_URL})\n2. 网络连接中断\n3. 防火墙阻止了连接\n\n建议：请检查您的网络连接，确保可以访问 siliconflow.cn`,
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

export async function testApiKey(apiKey: string): Promise<boolean> {
  const url = `${APP_CONFIG.API_BASE_URL}/models`;
  
  console.group('🔍 [API Test] testApiKey');
  console.log('  URL:', url);
  console.groupEnd();
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    console.log('🔍 [API Test Response] status:', response.status);
    
    if (!response.ok) {
      logError('API Test Failed', {
        status: response.status,
        statusText: response.statusText,
      });
    }
    
    return response.ok;
  } catch (error) {
    logError('API Test Network Error', {
      error: error instanceof Error ? error.message : error,
    });
    return false;
  }
}
