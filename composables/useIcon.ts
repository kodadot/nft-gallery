const getTokenIconBySymbol = (token: string) => {
  switch (token.toLowerCase()) {
    case 'bsx':
      return '/token/bsx.svg'
    case 'dot':
      return '/token/dot.svg'
    case 'ksm':
      return '/token/ksm.svg'
    default:
      return '/token/ksm.svg'
  }
}

export const useIcon = () => {
  const { isDarkMode } = useTheme()

  const unlockableIcon = computed(() =>
    isDarkMode.value ? '/unlockable-dark.svg' : '/unlockable.svg',
  )

  return { getTokenIconBySymbol, unlockableIcon }
}
