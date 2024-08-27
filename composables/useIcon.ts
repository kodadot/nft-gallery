import type { Prefix } from '@kodadot1/static'

const getTokenIconBySymbol = (token: string) => {
  switch (token.toLowerCase()) {
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

  const signUpVoucherIcon = computed(() =>
    isDarkMode.value ? '/signup-voucher-dark.svg' : '/signup-voucher.svg',
  )

  const unlockableIcon = computed(() =>
    isDarkMode.value ? '/unlockable-dark.svg' : '/unlockable.svg',
  )

  const getChainIcon = (prefix: Prefix | null): string | null => {
    switch (prefix) {
      case 'ahp':
        return isDarkMode.value ? '/chain/ahp_dark.svg' : '/chain/ahp.svg'
      case 'ahk':
        return isDarkMode.value ? '/chain/ahk_dark.svg' : '/chain/ahk.svg'
      case 'base':
        return isDarkMode.value ? '/chain/base_dark.svg' : '/chain/base.svg'
      case 'mnt':
        return isDarkMode.value ? '/chain/mnt_dark.svg' : '/chain/mnt.svg'
      default:
        return null
    }
  }

  return {
    getTokenIconBySymbol,
    signUpVoucherIcon,
    unlockableIcon,
    getChainIcon,
  }
}
