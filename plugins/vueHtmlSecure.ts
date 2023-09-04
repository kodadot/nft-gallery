import VueSafeHTML from 'vue-safe-html'

// support vue3 https://www.npmjs.com/package/vue-safe-html
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueSafeHTML, {})
})
