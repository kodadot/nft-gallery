import { SupportWallet } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'

export class CloverWallet extends BaseDotsamaWallet {
  // img: require('@/assets/partners/logo-clover.png'),
  extensionName = 'clover'
  img = ''
  name = 'Clover'
  source = SupportWallet.Clover
  walletUrl = 'https://clover.finance/'
  guideUrl = 'https://docs.clover.finance/quick-start/about-clover'
  isBrowserExtension = true
  isMobileApp = false
}
