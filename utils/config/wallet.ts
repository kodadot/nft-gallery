export enum SupportWallet {
  PolkadotJs = 'polkadot-js',
  MetaMask = 'metamask',
  Clover = 'clover',
  Math = 'mathwallet',
  Nova = 'nova',
}

export const WalletModalOption = {
  SelectWallet: 'SelectWallet',
  SelectSubstrateAccount: 'SelectSubstrateAccount',
  NoExtension: 'NoExtension',
  PolkadotJs: SupportWallet.PolkadotJs,
  Clover: SupportWallet.Clover,
  MetaMask: SupportWallet.MetaMask,
  Math: SupportWallet.Math,
  Nova: SupportWallet.Nova,
}

export const SubstrateWallets = [
  SupportWallet.PolkadotJs,
  SupportWallet.Clover,
  SupportWallet.Math,
  SupportWallet.Nova,
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
}

export const objToArray = (obj: any): any[] => {
  const keys = Object.keys(obj)
  const array = keys.map((k) => obj[k])
  return array
}

export const supportWallets = objToArray(supportWalletObj) as Wallet[]
