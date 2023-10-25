import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  sandboxDarkClass: 'dark-mode',
  setupFile: '/src/histoire.setup.ts',
  plugins: [HstVue()],
  vite: {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, '../../'),
        '~': resolve(__dirname, '../../'),
        '@google/model-viewer': './__mocks__/model-viewer.js',
      },
    },
  },
})
