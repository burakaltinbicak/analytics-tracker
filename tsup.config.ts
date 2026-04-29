import { defineConfig } from 'tsup'

export default defineConfig({
    entry: { tracker: 'src/index.ts' },
    format: ['iife'],
    globalName: 'Tracker',
    minify: true,
    outDir: 'dist',
    outExtension: () => ({ js: '.js' }),
})