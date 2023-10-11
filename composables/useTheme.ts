export default function () {
  const colorMode = useColorMode()

  const isDarkMode = computed<boolean>(() => colorMode.preference === 'dark')

  const toggleColorMode = (): void => {
    if (colorMode.preference === 'dark') {
      colorMode.preference = 'light'
    } else {
      colorMode.preference = 'dark'
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
