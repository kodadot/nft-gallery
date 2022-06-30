import { SupportWalletExtension } from '@/utils/config/wallets'
import { BaseEvmWallet } from '@/utils/config/wallets/BaseEvmWallet'

export class MetamaskWallet extends BaseEvmWallet {
  img = require('@/assets/partners/logo-metamask.svg')
  extensionName = 'ethereum'
  name = 'MetaMask'
  source = SupportWalletExtension.MetaMask
  walletUrl = 'https://metamask.io/download/'
  guideUrl = 'https://metamask.io/faqs/'
  isBrowserExtension = true
  isMobileApp = false
  isSetGlobalString = 'isMetaMask'
  initEvent = 'ethereum#initialized'
}
