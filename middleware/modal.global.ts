export default defineNuxtRouteMiddleware(() => {
  const nuxtApp = useNuxtApp()
  const { neoModal } = useProgrammatic()

  const isInitialLoad = process.client && nuxtApp.isHydrating

  if (!isInitialLoad) {
    neoModal.closeAll()
  }
})
