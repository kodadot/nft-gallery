import { SupportWallet } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'

export class TalismanWallet extends BaseDotsamaWallet {
  img = require('@/assets/partners/logo-talisman.svg')
  extensionName = 'talisman'
  name = 'Talisman'
  source = SupportWallet.Talisman
  walletUrl = 'https://app.talisman.xyz/spiritkeys'
  guideUrl = 'https://app.talisman.xyz/'
  isBrowserExtension = true
  isMobileApp = false
}
