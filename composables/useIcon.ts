export const useIcon = () => {
  const { isDarkMode } = useTheme()

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

  const signUpVoucherIcon = computed(() =>
    isDarkMode.value ? '/signup-voucher-dark.svg' : '/signup-voucher.svg',
  )

  const unlockableIcon = computed(() =>
    isDarkMode.value ? '/unlockable-dark.svg' : '/unlockable.svg',
  )

  return { getTokenIconBySymbol, signUpVoucherIcon, unlockableIcon }
}
