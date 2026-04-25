import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/chat': {
          target: 'https://api.siliconflow.cn/v1',
          changeOrigin: true,
          rewrite: (path) => '/chat/completions',
          headers: {
            'Authorization': `Bearer ${env.API_KEY || ''}`,
          },
        },
      },
    },
  }
})
