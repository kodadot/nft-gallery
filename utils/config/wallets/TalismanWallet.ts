import { SupportWalletExtension } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import logo from '@/assets/partners/logo-talisman.svg'

export class TalismanWallet extends BaseDotsamaWallet {
  img = logo
  extensionName = 'talisman'
  name = 'Talisman'
  source = SupportWalletExtension.Talisman
  walletUrl = 'https://app.talisman.xyz/spiritkeys'
  guideUrl = 'https://app.talisman.xyz/'
  isBrowserExtension = true
  isMobileApp = false
}
