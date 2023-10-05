import { sanitizeUrl } from '@braintree/sanitize-url'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('safeHref', {
    beforeMount(el, { value: url }) {
      el.setAttribute('href', sanitizeUrl(url))
    },
    updated(el, { value: url }) {
      el.setAttribute('href', sanitizeUrl(url))
    },
  })
})
