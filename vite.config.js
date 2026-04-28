import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [
            react(),
            {
                name: 'copy-vendor',
                closeBundle: function () {
                    var vendorDir = resolve(__dirname, 'dist/vendor');
                    if (!existsSync(vendorDir)) {
                        mkdirSync(vendorDir, { recursive: true });
                    }
                    var src = resolve(__dirname, 'vendor/lunar.js');
                    var dest = resolve(vendorDir, 'lunar.js');
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
                    rewrite: function (path) { return '/chat/completions'; },
                    headers: {
                        'Authorization': "Bearer ".concat(env.API_KEY || ''),
                    },
                },
            },
        },
    };
});
