export default function () {
  const colorMode = useColorMode()

  const isDarkMode = computed<boolean>(
    () => colorMode.value === 'dark' || colorMode.value === 'system',
  )

  const toggleColorMode = (): void => {
    if (colorMode.value === 'dark') {
      colorMode.preference = 'light'
    } else {
      colorMode.preference = 'dark'
    }
  }

  const placeholder = computed(() => {
    return isDarkMode.value ? '/Kdark.webp' : '/Klight.webp'
  })

  return {
    isDarkMode,
    isLightMode: computed(() => !isDarkMode.value),
    toggleColorMode,
    placeholder,
  }
}
