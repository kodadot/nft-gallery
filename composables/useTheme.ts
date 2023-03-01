export default function () {
  const { $colorMode } = useNuxtApp()

  const isDarkMode = computed<boolean>(
    () =>
      $colorMode.preference === 'dark' ||
      document.documentElement.className.includes('dark-mode')
  )

  const toggleColorMode = (): void => {
    if (isDarkMode.value) {
      $colorMode.preference = 'light'
    } else {
      $colorMode.preference = 'dark'
    }
  }

  return {
    isDarkMode,
    isLightMode: computed(() => !isDarkMode.value),
    toggleColorMode,
  }
}
