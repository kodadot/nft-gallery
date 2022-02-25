import { SupportWallet } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'

export class LedgerWallet extends BaseDotsamaWallet {
  // img: require('@/assets/partners/logo-nova.png'),
  extensionName = 'ledger'
  img = ''
  name = 'Ledger'
  source = SupportWallet.Ledger
  walletUrl = 'https://www.ledger.com/ledger-live'
  guideUrl = 'https://www.ledger.com/ledger-live'
  isBrowserExtension = false
  isMobileApp = false
}
