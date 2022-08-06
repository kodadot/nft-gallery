import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { createVuePlugin } from 'vite-plugin-vue2'

export default defineConfig({
  plugins: [createVuePlugin(/* options */)],
  test: {
    include: ['tests/**/?(*.)+(spec|test).+(ts|tsx|js)'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    globals: true,
    environment: 'jsdom',
    alias: [{ find: /^vue$/, replacement: 'vue/dist/vue.runtime.common.js' }],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '~': resolve(__dirname, './'),
    },
  },
})
