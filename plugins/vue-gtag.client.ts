import VueGtag from 'vue-gtag'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const config = useRuntimeConfig()
  nuxtApp.vueApp.use(
    VueGtag,
    {
      config: {
        // isEnabled: false,
        id: config.public.googleAnalyticsId,
      },
    },
    router
  )
})
