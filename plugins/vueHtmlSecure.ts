import VueDOMPurifyHTML from 'vue-dompurify-html'

// support vue3 https://www.npmjs.com/package/vue-dompurify-html
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDOMPurifyHTML, {
    default: {
      ALLOWED_TAGS: ['a', 'strong'],
      ALLOWED_ATTR: ['href', 'target'],
    },
  })
})
