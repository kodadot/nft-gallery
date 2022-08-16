import { BaseDotsamaWallet } from '@/utils/config/wallets/BaseDotsamaWallet'
import { SupportWalletExtension } from '@/utils/config/wallets'
import logoLedger from '@/assets/partners/logo-ledger.svg'

export class LedgerWallet extends BaseDotsamaWallet {
  img = logoLedger
  extensionName = 'ledger'
  name = 'Ledger'
  source = SupportWalletExtension.Ledger
  walletUrl = 'https://www.ledger.com/ledger-live'
  guideUrl = 'https://www.ledger.com/ledger-live'
  isBrowserExtension = false
  isMobileApp = false
}
