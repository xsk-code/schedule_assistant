import type { CollectedItem, AIResponse } from '../types';
import { APP_CONFIG } from '../constants/appConfig';
import { createAPIError, logError } from './aiService';

function buildConversationPrompt(
  task: string,
  collectedInfo: CollectedItem[],
  currentRound: number,
  maxRounds: number
): string {
  const collectedInfoText = collectedInfo.length > 0
    ? collectedInfo.map((item, index) =>
      `第 ${index + 1} 轮 - 问题：${item.question}\n回答：${item.answer}`
    ).join('\n\n')
    : '（尚无收集的信息）';

  return `【系统角色】
你是一个任务需求澄清助手。你的职责是通过精准的追问，帮助用户明确任务的关键信息。

【当前任务】
${task}

【已收集的信息】
${collectedInfoText}

【当前进度】
当前是第 ${currentRound} 轮，最多 ${maxRounds} 轮

【追问原则】
1. 每次只问 1 个问题
2. 问题要具体、可回答
3. 选项要覆盖常见情况，必须提供"其他"选项作为最后一个选项
4. 当收集到足够信息时，主动结束对话

【判断信息充分的标准】
- 任务目标已明确
- 关键约束条件已确认（如时间、资源）
- 期望效果已了解

【输出格式要求（严格JSON格式）】
当需要继续追问时，输出：
{
  "needsMoreInfo": true,
  "question": "问题内容",
  "options": ["选项1", "选项2", "选项3", "其他"],
  "reasoning": "为什么问这个问题"
}

当信息足够时，输出：
{
  "needsMoreInfo": false,
  "reasoning": "为什么信息已经足够",
  "summary": "你对任务的理解总结"
}

【重要要求】
1. 输出必须是严格的JSON格式，不要有任何额外的文字说明
2. options 数组必须包含 4 个选项，最后一个必须是"其他"
3. 问题要聚焦于任务的关键维度：时间、资源、预期效果、优先级等
4. 如果是第 ${maxRounds} 轮，请直接输出 needsMoreInfo: false，不再继续追问`;
}

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
  apiKey: string,
  model: string = APP_CONFIG.DEFAULT_MODEL,
  maxRounds: number = 5
): Promise<AIResponse> {
  const url = `${APP_CONFIG.API_BASE_URL}/chat/completions`;

  console.group('📤 [API Request] clarifyTask');
  console.log('  URL:', url);
  console.log('  Model:', model);
  console.log('  Round:', currentRound, '/', maxRounds);
  console.groupEnd();

  const prompt = buildConversationPrompt(task, collectedInfo, currentRound, maxRounds);

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
        max_tokens: 1000,
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
        `API 调用超时 (${APP_CONFIG.API_TIMEOUT / 1000}秒)。\n可能的原因：\n1. 网络连接不稳定\n2. 模型响应较慢\n3. 硅基流动服务暂时不可用\n\n建议：请检查网络连接或稍后重试。`,
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
