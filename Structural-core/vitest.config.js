import { defineConfig } from 'vite'
import path from 'path'

// https://github.com/temporalio/ui/blob/main/vitest.config.ts
export default defineConfig({
    root: '.',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@test': path.resolve(__dirname, './test'),
        },
    },
    test: {
        globals: true,
        coverage: {
            reporter: ['text', 'json', 'html'],
        },
    },

})