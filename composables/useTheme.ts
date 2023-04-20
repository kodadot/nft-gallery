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

  const placeholder = computed(() => {
    return isDarkMode.value ? '/placeholder.webp' : '/placeholder-white.webp'
  })

  return {
    isDarkMode,
    isLightMode: computed(() => !isDarkMode.value),
    toggleColorMode,
    placeholder,
  }
}
