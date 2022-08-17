import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import { SupportWalletExtension } from '@/utils/config/wallets'
import logoClover from '@/assets/partners/logo-clover.png'

export class CloverWallet extends BaseDotsamaWallet {
  img = logoClover
  extensionName = 'clover'
  name = 'Clover'
  source = SupportWalletExtension.Clover
  walletUrl = 'https://clover.finance/'
  guideUrl = 'https://docs.clover.finance/quick-start/about-clover'
  isBrowserExtension = true
  isMobileApp = false
}
