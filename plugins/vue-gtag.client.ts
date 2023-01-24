import VueGtag from 'vue-gtag-next'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGtag, {
    property: {
      id: nuxtApp.$config.public.googleAnalyticsId,
      isEnabled: false,
    },
  })
})
