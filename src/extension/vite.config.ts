import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import path from 'node:path';

export default defineConfig({
    plugins: [crx({ manifest })],
    build: {
        // 빌드 결과물이 저장될 폴더 (NestJS public 폴더로 지정도 가능)
        outDir: 'dist',
        rollupOptions: {
            // 추가적인 입력 파일이 있다면 여기에 지정
        },
    },
    resolve: {
        alias: {
            '@extension': path.resolve(__dirname, '.'),
            '@app': path.resolve(__dirname, '../app'),
        },
    },
});
