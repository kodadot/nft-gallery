import { Prefix } from '@kodadot1/static'

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
        return '/chain/ahp.svg'
      case 'ahk':
        return '/token/kusama_asset_hub.svg'
      case 'base':
        return '/chain/base.svg'
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
