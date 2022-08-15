import { SupportWalletExtension } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import logo from '@/assets/partners/logo-polkadot-js.png'

export class PolkadotjsWallet extends BaseDotsamaWallet {
  img = logo
  extensionName = 'polkadot-js'
  name = 'Polkadot.js'
  source = SupportWalletExtension.PolkadotJs
  walletUrl = 'https://polkadot.js.org/extension/'
  guideUrl = 'https://www.youtube.com/watch?v=r-fAy7Ta_vY'
  isBrowserExtension = true
  isMobileApp = false
}
