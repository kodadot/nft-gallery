export default defineNuxtRouteMiddleware(() => {
  const { isHydrating } = useNuxtApp()
  const { neoModal } = useProgrammatic()

  const isInitialLoad = process.client && isHydrating

  if (!isInitialLoad) {
    neoModal.closeAll()
  }
})
