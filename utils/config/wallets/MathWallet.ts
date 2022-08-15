import { SupportWalletExtension } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import logoMathWallet from '@/assets/partners/logo-mathwallet.png'

export class MathWallet extends BaseDotsamaWallet {
  img = logoMathWallet
  extensionName = 'mathwallet'
  name = 'Math Wallet'
  source = SupportWalletExtension.Math
  walletUrl = 'https://mathwallet.org/en-us/'
  guideUrl = 'https://blog.mathwallet.org/?p=540'
  isBrowserExtension = false
  isMobileApp = true
}
