export const APP_CONFIG = {
  API_BASE_URL: 'https://api.siliconflow.cn/v1',
  DEFAULT_MODEL: 'deepseek-ai/DeepSeek-V3.2',
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.7,
  API_TIMEOUT: 60000,
  MAX_HISTORY_COUNT: 50,
  MIN_TASK_LENGTH: 5,
  MAX_TASK_LENGTH: 500,
  STORAGE_KEYS: {
    HISTORY: 'sihua_history',
    CONFIG: 'sihua_config',
  },
};

export const AVAILABLE_MODELS = [
  { value: 'deepseek-ai/DeepSeek-V3.2', label: 'DeepSeek V3.2 (推荐)', description: 'DeepSeek最新模型，性能优秀' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', description: 'OpenAI轻量模型' },
  { value: 'Qwen/Qwen2.5-72B-Instruct', label: 'Qwen 2.5 72B', description: '阿里千问大模型' },
  { value: 'deepseek-ai/DeepSeek-R1', label: 'DeepSeek R1', description: 'DeepSeek推理模型' },
  { value: 'meta-llama/Llama-3.3-70B-Instruct', label: 'Llama 3.3 70B', description: 'Meta开源大模型' },
  { value: 'THUDM/glm-4-9b-chat', label: 'GLM-4 9B', description: '智谱清言模型' },
];
