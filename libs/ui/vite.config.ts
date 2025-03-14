import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'KodaBrick',
      fileName: 'koda-brick',
    },
    // rollupOptions: {
    //   external: ['vue', '@oruga-ui/oruga-next', 'bulma', '@vueuse/core', '@fortawesome/vue-fontawesome', 'three'],
    // },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
