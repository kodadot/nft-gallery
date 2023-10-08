import VueSocialSharing from 'vue-social-sharing'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueSocialSharing)
})
