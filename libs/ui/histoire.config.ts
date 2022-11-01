import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue2'
import vue from '@vitejs/plugin-vue2'
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
      },
    },
  },
})
