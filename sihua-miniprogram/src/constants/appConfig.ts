export const APP_CONFIG = {
  API_BASE_URL: 'https://api.siliconflow.cn/v1',
  API_KEY: process.env.TARO_APP_API_KEY || '',
  DEFAULT_MODEL: 'deepseek-ai/DeepSeek-V3.2',
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.7,
  API_TIMEOUT: 120000,
  MAX_HISTORY_COUNT: 50,
  MIN_TASK_LENGTH: 5,
  MAX_TASK_LENGTH: 500,
  STORAGE_KEYS: {
    HISTORY: 'sihua_history',
    CONFIG: 'sihua_config',
    SETTINGS: 'sihua_settings'
  },
  CONVERSATION: {
    MAX_ROUNDS: 5
  }
};
