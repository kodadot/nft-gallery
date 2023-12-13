export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:beforeMount', (app) => {
    app.$nuxt.$i18n.locale.value = usePreferencesStore().getUserLocale
  })
})
