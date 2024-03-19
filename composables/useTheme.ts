export default function () {
  const colorMode = useColorMode()

  const isDarkMode = computed<boolean>(() => colorMode.value === 'dark')
  const isSystemMode = computed<boolean>(
    () => colorMode.preference === 'system',
  )

  const toggleColorMode = (): void => {
    if (colorMode.value === 'dark') {
      colorMode.preference = 'light'
    } else {
      colorMode.preference = 'dark'
    }
  }

  const preference = computed(() => colorMode.preference)

  const placeholder = computed(() => {
    return isDarkMode.value ? '/Kdark.webp' : '/Klight.webp'
  })

  const setColorMode = (mode: 'light' | 'dark' | 'system') => {
    colorMode.preference = mode
  }

  return {
    isDarkMode,
    isSystemMode,
    setColorMode,
    isLightMode: computed(() => !isDarkMode.value),
    preference,
    toggleColorMode,
    placeholder,
  }
}
