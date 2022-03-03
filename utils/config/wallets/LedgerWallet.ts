import { SupportWalletExtension } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'

export class LedgerWallet extends BaseDotsamaWallet {
  img = require('@/assets/partners/logo-ledger.svg')
  extensionName = 'ledger'
  name = 'Ledger'
  source = SupportWalletExtension.Ledger
  walletUrl = 'https://www.ledger.com/ledger-live'
  guideUrl = 'https://www.ledger.com/ledger-live'
  isBrowserExtension = false
  isMobileApp = false
}
