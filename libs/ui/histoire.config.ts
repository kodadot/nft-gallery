import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue2'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [
    HstVue(),
  ],
  vite: {
    plugins: [vue()]
  }
})