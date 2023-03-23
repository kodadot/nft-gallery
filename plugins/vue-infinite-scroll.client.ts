import InfiniteLoading from 'vue-infinite-loading'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(InfiniteLoading, {})
})
