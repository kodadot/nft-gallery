import { createPinia } from 'pinia'

const pinia = createPinia()
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(pinia, {})
})
