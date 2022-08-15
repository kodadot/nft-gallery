import { SupportWalletExtension } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import logo from '@/assets/partners/logo-subwallet.svg'

export class SubWallet extends BaseDotsamaWallet {
  img = logo
  extensionName = 'subwallet-js'
  name = 'SubWallet'
  source = SupportWalletExtension.SubWallet
  walletUrl =
    'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn?hl=en&authuser=0'
  guideUrl = 'https://connect.subwallet.app/#/welcome'
  isBrowserExtension = true
  isMobileApp = false
}
