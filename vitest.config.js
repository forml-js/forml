import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        coverage: {
            enabled: true,
            provider: 'v8',
            include: ['packages/*/src/**/*.{js,jsx}'],
            reporter: ['html-spa', 'lcov', 'text'],
            htmlDir: 'coverage',
        },
        projects: ['packages/*'],
    },
});
