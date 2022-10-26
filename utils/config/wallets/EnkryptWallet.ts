import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import { SupportWalletExtension } from '@/utils/config/wallets'
import logoEnkrypt from '@/assets/partners/logo-enkrypt.png'

export class EnkryptWallet extends BaseDotsamaWallet {
  img = logoEnkrypt
  extensionName = 'enkrypt'
  name = 'Enkrypt'
  source = SupportWalletExtension.Enkrypt
  walletUrl = 'https://www.enkrypt.com/#downloads'
  guideUrl = 'https://www.enkrypt.com/'
  isBrowserExtension = true
  isMobileApp = false
}
