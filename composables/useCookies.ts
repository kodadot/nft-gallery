export default () => {
  const cookieControl = useCookieControl()
  const { enableAnalytics, disableAnalytics } = useGtag()

  const cookieConsentGiven = computed(() =>
    cookieControl.cookiesEnabledIds.value?.includes('ga'),
  )

  const openModal = () => (cookieControl.isModalActive.value = true)

  watch(
    () => cookieControl.cookiesEnabledIds.value,
    () => {
      if (!cookieConsentGiven.value) {
        window.location.reload()
      }
    },
    { deep: true },
  )

  watch(
    cookieConsentGiven,
    (cookieConsentGiven) => {
      if (cookieConsentGiven || cookieConsentGiven === undefined) {
        enableAnalytics()
      } else {
        disableAnalytics()
      }
    },
    { immediate: true },
  )

  return { openModal }
}
