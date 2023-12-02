export default function () {
  const colorMode = useColorMode()

  const isDarkMode = ref()
  const isLightMode = ref()
  const placeholder = ref()

  watchPostEffect(() => {
    isDarkMode.value = colorMode.value === 'dark'
    isLightMode.value = colorMode.value === 'light'
    placeholder.value =
      colorMode.value === 'dark' ? '/Kdark.webp' : '/Klight.webp'
  })

  const toggleColorMode = (): void => {
    if (colorMode.value === 'dark') {
      colorMode.preference = 'light'
    } else {
      colorMode.preference = 'dark'
    }
  }

  return {
    isDarkMode,
    isLightMode,
    toggleColorMode,
    placeholder,
  }
}
