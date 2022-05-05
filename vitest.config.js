import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { createVuePlugin } from 'vite-plugin-vue2'

export default defineConfig({
  test: {
    include: ['**/?(*.)+(spec).+(ts|tsx|js)'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '~': resolve(__dirname, './'),
    },
  },
  plugins: [createVuePlugin()],
})
