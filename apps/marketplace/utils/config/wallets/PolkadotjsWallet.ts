import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import { SupportWalletExtension } from '@/utils/config/wallets'
import logoPolkadotjs from '@/assets/partners/logo-polkadot-js.png'

export class PolkadotjsWallet extends BaseDotsamaWallet {
  img = logoPolkadotjs
  extensionName = 'polkadot-js'
  name = 'Polkadot.js'
  source = SupportWalletExtension.PolkadotJs
  walletUrl = 'https://polkadot.js.org/extension/'
  guideUrl = 'https://www.youtube.com/watch?v=r-fAy7Ta_vY'
  isBrowserExtension = true
  isMobileApp = false
}
