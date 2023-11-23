import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  sandboxDarkClass: 'dark-mode',
  setupFile: '/src/histoire.setup.ts',
  plugins: [HstVue()],
  vite: {
    // https://stackoverflow.com/questions/74902697/error-the-request-url-is-outside-of-vite-serving-allow-list-after-git-init
    server: {
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd())],
      },
    },
    css: {
      postcss: {
        plugins: [
          require('tailwindcss/nesting'),
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
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
