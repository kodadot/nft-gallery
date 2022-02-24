export enum SupportWallet {
  PolkadotJs = 'polkadot-js',
  MetaMask = 'metamask',
  Clover = 'clover',
  Math = 'mathwallet',
  Ledger = 'ledger',
  Nova = 'nova',
  Talisman = 'talisman',
}

export const WalletModalOption = {
  SelectWallet: 'SelectWallet',
  SelectSubstrateAccount: 'SelectSubstrateAccount',
  NoExtension: 'NoExtension',
  PolkadotJs: SupportWallet.PolkadotJs,
  Clover: SupportWallet.Clover,
  Ledger: SupportWallet.Ledger,
  MetaMask: SupportWallet.MetaMask,
  Math: SupportWallet.Math,
  Nova: SupportWallet.Nova,
  Talisman: SupportWallet.Talisman,
}

export const SubstrateWallets = [
  SupportWallet.PolkadotJs,
  SupportWallet.Clover,
  SupportWallet.Math,
  SupportWallet.Nova,
  SupportWallet.Talisman,
]

export interface Wallet {
  img: any
  name: string
  source: SupportWallet
  walletUrl: string
  guideUrl: string
  isSupportBrowserExtension: boolean
  isSupportMobileApp: boolean
}

export const supportWalletObj = {
  [SupportWallet.PolkadotJs]: {
    // img: require('/src/assets/img/logo-polkadot-js.png'),
    name: 'Polkadot.js',
    source: SupportWallet.PolkadotJs,
    walletUrl: 'https://polkadot.js.org/extension/',
    guideUrl: 'https://www.youtube.com/watch?v=r-fAy7Ta_vY',
    isSupportBrowserExtension: true,
    isSupportMobileApp: false,
  },
  [SupportWallet.MetaMask]: {
    // img: require('/src/assets/img/metamask.png'),
    name: 'MetaMask',
    source: SupportWallet.MetaMask,
    walletUrl: 'https://metamask.io/',
    guideUrl: 'https://metamask.io/',
    isSupportBrowserExtension: true,
    isSupportMobileApp: true,
  },
  [SupportWallet.Clover]: {
    // img: require('/src/assets/img/logo-clover.png'),
    name: 'Clover',
    source: SupportWallet.Clover,
    walletUrl: 'https://clover.finance/',
    guideUrl: 'https://docs.clover.finance/quick-start/about-clover',
    isSupportBrowserExtension: true,
    isSupportMobileApp: false,
  },
  [SupportWallet.Ledger]: {
    // img: require('@/assets/partners/logo-ledger.svg'),
    name: 'Ledger',
    source: SupportWallet.Ledger,
    walletUrl: 'https://www.ledger.com/ledger-live',
    guideUrl: 'https://www.ledger.com/ledger-live',
    isSupportBrowserExtension: false,
    isSupportMobileApp: false,
  },
  [SupportWallet.Math]: {
    // img: require('/src/assets/img/logo-mathwallet.png'),
    name: 'Math Wallet',
    source: SupportWallet.Math,
    walletUrl: 'https://mathwallet.org/en-us/',
    guideUrl: 'https://blog.mathwallet.org/?p=540',
    isSupportBrowserExtension: true,
    isSupportMobileApp: true,
  },
  [SupportWallet.Nova]: {
    // img: require('/src/assets/img/logo-nova.png'),
    name: 'Nova Wallet',
    source: SupportWallet.Nova,
    walletUrl: 'https://novawallet.io/',
    guideUrl: 'https://novawallet.io/',
    isSupportBrowserExtension: false,
    isSupportMobileApp: true,
  },
  [SupportWallet.Talisman]: {
    // img: require('@/assets/partners/logo-talisman.svg'),
    name: 'Talisman',
    source: SupportWallet.Talisman,
    walletUrl: 'https://app.talisman.xyz/spiritkeys',
    guideUrl: 'https://app.talisman.xyz/',
    isSupportBrowserExtension: true,
    isSupportMobileApp: false,
  },
}

export const objToArray = (obj: any): any[] => {
  const keys = Object.keys(obj)
  const array = keys.map((k) => obj[k])
  return array
}

export const supportWallets = objToArray(supportWalletObj) as Wallet[]
