export default function () {
  const colorMode = useColorMode()

  const isDarkMode = computed<boolean>(
    () =>
      colorMode.preference === 'dark' ||
      document.documentElement.className.includes('dark-mode'),
  )

  const toggleColorMode = (): void => {
    console.log('current: ' + colorMode.preference)
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
    colorMode,
  }
}
