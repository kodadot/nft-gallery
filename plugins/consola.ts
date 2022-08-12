import { defineNuxtPlugin } from '#app'
import consola from 'consola'

declare module 'vue/types/vue' {
  // this.$consola inside Vue components
  interface Vue {
    $consola
  }
}

// https://github.com/nuxt/bridge/issues/91#issuecomment-1097958580
declare module '#app' {
  interface NuxtAppCompat {
    $consola: typeof consola
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('consola', consola)
})
