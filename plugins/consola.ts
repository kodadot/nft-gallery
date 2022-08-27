import consola from 'consola'

declare module 'vue/types/vue' {
  // this.$consola inside Vue components
  interface Vue {
    $consola
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('consola', consola)
})
