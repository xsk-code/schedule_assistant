import type { SihuaInfo, AnalysisResult } from '../types';
import { buildAnalysisPrompt } from '../utils/promptBuilder';
import { APP_CONFIG } from '../constants/appConfig';

export async function analyzeTask(
  task: string,
  sihuaInfo: SihuaInfo,
  apiKey: string
): Promise<AnalysisResult> {
  const prompt = buildAnalysisPrompt(task, sihuaInfo);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.API_TIMEOUT);
  
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: APP_CONFIG.DEFAULT_MODEL,
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
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `API调用失败: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('API返回内容为空');
    }
    
    try {
      return JSON.parse(content) as AnalysisResult;
    } catch {
      throw new Error('解析AI响应失败');
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('API调用超时，请稍后重试');
    }
    throw error;
  }
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
