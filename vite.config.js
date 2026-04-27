import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'copy-vendor',
        closeBundle() {
          const vendorDir = resolve(__dirname, 'dist/vendor');
          if (!existsSync(vendorDir)) {
            mkdirSync(vendorDir, { recursive: true });
          }
          const src = resolve(__dirname, 'vendor/lunar.js');
          const dest = resolve(vendorDir, 'lunar.js');
          if (existsSync(src)) {
            copyFileSync(src, dest);
          }
        },
      },
    ],
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
  };
});
