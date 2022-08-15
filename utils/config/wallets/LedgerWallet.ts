import { SupportWalletExtension } from '@/utils/config/wallets'
import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import logo from '@/assets/partners/logo-ledger.svg'

export class LedgerWallet extends BaseDotsamaWallet {
  img = logo
  extensionName = 'ledger'
  name = 'Ledger'
  source = SupportWalletExtension.Ledger
  walletUrl = 'https://www.ledger.com/ledger-live'
  guideUrl = 'https://www.ledger.com/ledger-live'
  isBrowserExtension = false
  isMobileApp = false
}
