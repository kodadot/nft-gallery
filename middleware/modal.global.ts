export default defineNuxtRouteMiddleware(() => {
  const { isHydrating } = useNuxtApp()
  const { neoModal } = useProgrammatic()

  const isInitialLoad = import.meta.client && isHydrating

  if (!isInitialLoad) {
    neoModal.closeAll()
  }
})
