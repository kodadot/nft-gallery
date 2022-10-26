import { isMobileDevice } from '~/utils/extension'

// wallet logo
import logoPolkadotjs from '@/assets/partners/logo-polkadot-js.png'
import logoClover from '@/assets/partners/logo-clover.png'
import logoLedger from '@/assets/partners/logo-ledger.svg'
import logoMathWallet from '@/assets/partners/logo-mathwallet.png'
import logoNova from '@/assets/partners/logo-nova.png'
import logoSubWallet from '@/assets/partners/logo-subwallet.svg'
import logoTalisman from '@/assets/partners/logo-talisman.svg'
import logoEnkrypt from '@/assets/partners/logo-enkrypt.png'
import { BaseDotsamaWallet } from './wallets/BaseDotsamaWallet'

export enum SupportWalletExtension {
  PolkadotJs = 'polkadot-js',
  MetaMask = 'metamask',
  Clover = 'clover',
  Ledger = 'ledger',
  Math = 'mathwallet',
  Nova = 'nova',
  SubWallet = 'subwallet-js',
  Talisman = 'talisman',
  Enkrypt = 'enkrypt',
}

// source as 'polkadot-js' in mobile app
export const WalletExtensionProxyMap = {
  [SupportWalletExtension.PolkadotJs]: SupportWalletExtension.PolkadotJs,
  [SupportWalletExtension.MetaMask]: SupportWalletExtension.MetaMask,
  [SupportWalletExtension.Clover]: SupportWalletExtension.Clover,
  [SupportWalletExtension.Ledger]: SupportWalletExtension.Ledger,
  [SupportWalletExtension.Math]: SupportWalletExtension.PolkadotJs, // mathwallet
  [SupportWalletExtension.Nova]: SupportWalletExtension.PolkadotJs, // nova
  [SupportWalletExtension.Talisman]: SupportWalletExtension.Talisman,
  [SupportWalletExtension.Enkrypt]: SupportWalletExtension.Enkrypt,
}

export interface WalletConfig {
  img: string
  extensionName: SupportWalletExtension
  source: SupportWalletExtension
  name: string
  walletUrl: string
  guideUrl: string
  isBrowserExtension: boolean
  isMobileApp: boolean
}
type IWalletConfigMap = Partial<Record<SupportWalletExtension, WalletConfig>>

export const WalletConfigMap: IWalletConfigMap = {
  [SupportWalletExtension.PolkadotJs]: {
    img: logoPolkadotjs,
    name: 'Polkadot.js',
    extensionName: SupportWalletExtension.PolkadotJs,
    source: WalletExtensionProxyMap[SupportWalletExtension.PolkadotJs],
    walletUrl: 'https://polkadot.js.org/extension/',
    guideUrl: 'https://www.youtube.com/watch?v=r-fAy7Ta_vY',
    isBrowserExtension: true,
    isMobileApp: false,
  },
  [SupportWalletExtension.Clover]: {
    img: logoClover,
    name: 'Clover',
    extensionName: SupportWalletExtension.Clover,
    source: WalletExtensionProxyMap[SupportWalletExtension.Clover],
    walletUrl: 'https://clover.finance/',
    guideUrl: 'https://docs.clover.finance/quick-start/about-clover',
    isBrowserExtension: true,
    isMobileApp: false,
  },
  [SupportWalletExtension.Ledger]: {
    img: logoLedger,
    name: 'Ledger',
    extensionName: SupportWalletExtension.Ledger,
    source: WalletExtensionProxyMap[SupportWalletExtension.Ledger],
    walletUrl: 'https://www.ledger.com/ledger-live',
    guideUrl: 'https://www.ledger.com/ledger-live',
    isBrowserExtension: false,
    isMobileApp: false,
  },
  [SupportWalletExtension.Math]: {
    img: logoMathWallet,
    name: 'Math Wallet',
    extensionName: SupportWalletExtension.Math,
    source: WalletExtensionProxyMap[SupportWalletExtension.Math],
    walletUrl: 'https://mathwallet.org/en-us/',
    guideUrl: 'https://blog.mathwallet.org/?p=540',
    isBrowserExtension: false,
    isMobileApp: true,
  },
  [SupportWalletExtension.Nova]: {
    img: logoNova,
    name: 'Nova',
    extensionName: SupportWalletExtension.Nova,
    source: WalletExtensionProxyMap[SupportWalletExtension.Nova],
    walletUrl: 'https://novawallet.io/',
    guideUrl: 'https://novawallet.io/',
    isBrowserExtension: false,
    isMobileApp: true,
  },
  [SupportWalletExtension.SubWallet]: {
    img: logoSubWallet,
    name: 'SubWallet',
    extensionName: SupportWalletExtension.SubWallet,
    source: WalletExtensionProxyMap[SupportWalletExtension.SubWallet],
    walletUrl:
      'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn?hl=en&authuser=0',
    guideUrl: 'https://connect.subwallet.app/#/welcome',
    isBrowserExtension: true,
    isMobileApp: false,
  },
  [SupportWalletExtension.Talisman]: {
    img: logoTalisman,
    name: 'Talisman',
    extensionName: SupportWalletExtension.Talisman,
    source: WalletExtensionProxyMap[SupportWalletExtension.Talisman],
    walletUrl: 'https://app.talisman.xyz/spiritkeys',
    guideUrl: 'https://app.talisman.xyz/',
    isBrowserExtension: true,
    isMobileApp: false,
  },
  [SupportWalletExtension.Enkrypt]: {
    img: logoEnkrypt,
    name: 'Enkrypt',
    extensionName: SupportWalletExtension.Enkrypt,
    source: WalletExtensionProxyMap[SupportWalletExtension.Enkrypt],
    walletUrl: 'https://www.enkrypt.com/#downloads',
    guideUrl: 'https://www.enkrypt.com/',
    isBrowserExtension: true,
    isMobileApp: false,
  },
}

export const SubstrateWallets = [
  SupportWalletExtension.PolkadotJs,
  SupportWalletExtension.Clover,
  SupportWalletExtension.Math,
  SupportWalletExtension.Nova,
  SupportWalletExtension.SubWallet,
  SupportWalletExtension.Talisman,
  SupportWalletExtension.Enkrypt,
]

const MobileWalletExtensionList = [
  SupportWalletExtension.Math,
  SupportWalletExtension.Nova,
]
const PCWalletExtensionList = [
  SupportWalletExtension.Enkrypt,
  SupportWalletExtension.Talisman,
  SupportWalletExtension.PolkadotJs,
  SupportWalletExtension.SubWallet,
]

const createWalletInstance = (
  walletExtensionProxy: SupportWalletExtension
): BaseDotsamaWallet => {
  const realExtension = WalletExtensionProxyMap[walletExtensionProxy]
  const config = WalletConfigMap[realExtension]
  return new BaseDotsamaWallet(config)
}

const createWalletInstanceList = (
  walletList: SupportWalletExtension[]
): BaseDotsamaWallet[] => {
  return walletList.map((walletExtension) =>
    createWalletInstance(walletExtension)
  )
}

export const SupportedWallets = () => {
  if (isMobileDevice) {
    return createWalletInstanceList(MobileWalletExtensionList)
  }
  const allWallets = createWalletInstanceList(PCWalletExtensionList)
  const wallets = allWallets.filter((wallet) => wallet.installed)
  return wallets.length > 0 ? wallets : allWallets
}

export function getWalletBySource(
  source: string | unknown
): Wallet | undefined {
  return SupportedWallets().find((wallet) => {
    return wallet.extensionName === source
  })
}

export function isWalletInstalled(source: string | unknown): boolean {
  const wallet = getWalletBySource(source)
  return wallet?.installed as boolean
}

export type SubscriptionFn = (
  accounts: WalletAccount[] | undefined
) => void | Promise<void>

export interface WalletAccount {
  address: string
  source: string
  name?: string
  wallet?: Wallet
  signer?: unknown
}

interface WalletData {
  extensionName: string
  source: string
  name: string
  walletUrl: string
  guideUrl: string
  img: string
  isBrowserExtension: boolean
  isMobileApp: boolean
}

interface WalletExtension {
  installed: boolean | undefined

  // The raw extension object which will have everything a dapp developer needs.
  // Refer to a specific wallet's extension documentation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extension: any

  // The raw signer object for convenience. Usually the implementer can derive this from the extension object.
  // Refer to a specific wallet's extension documentation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signer: any
}

interface Signer {
  // Sign function
  sign?: (address: string, payload: string) => unknown
}

interface Connector {
  enable: () => unknown

  // The subscribe to accounts function
  subscribeAccounts: (callback: SubscriptionFn) => unknown
}

export interface Wallet
  extends WalletData,
    WalletExtension,
    Connector,
    Signer {}
