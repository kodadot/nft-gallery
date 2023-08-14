import { isMobileDevice } from '~/utils/extension'

// wallet logo
import { BaseDotsamaWallet } from './wallets/BaseDotsamaWallet'

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
  [SupportWalletExtension.Math]: SupportWalletExtension.PolkadotJs, // mathwallet
  [SupportWalletExtension.Nova]: SupportWalletExtension.PolkadotJs, // nova
}

const getWalletExtensionSource = (
  walletExtension: SupportWalletExtension
): SupportWalletExtension => {
  return WalletExtensionProxyMap[walletExtension] || walletExtension
}

const buildWalletConfig = (
  walletExtension,
  img,
  name,
  walletUrl,
  guideUrl,
  isBrowserExtension = false,
  isMobileApp = false
): WalletConfig => ({
  img,
  name,
  extensionName: walletExtension,
  source: getWalletExtensionSource(walletExtension),
  walletUrl,
  guideUrl,
  isBrowserExtension,
  isMobileApp,
})

export const WalletConfigMap: IWalletConfigMap = {
  [SupportWalletExtension.PolkadotJs]: buildWalletConfig(
    SupportWalletExtension.PolkadotJs,
    '/partners/logo-polkadot-js.png',
    'Polkadot.js',
    'https://polkadot.js.org/extension/',
    'https://www.youtube.com/watch?v=r-fAy7Ta_vY',
    true
  ),
  [SupportWalletExtension.Clover]: buildWalletConfig(
    SupportWalletExtension.Clover,
    '/partners/logo-clover.png',
    'CLV Wallet',
    'https://chrome.google.com/webstore/detail/clv-wallet/nhnkbkgjikgcigadomkphalanndcapjk',
    'https://docs.clv.org/use-clv-wallet/clv-extension-wallet',
    true
  ),
  [SupportWalletExtension.Ledger]: buildWalletConfig(
    SupportWalletExtension.Ledger,
    '/partners/logo-ledger.svg',
    'Ledger',
    'https://www.ledger.com/ledger-live',
    'https://www.ledger.com/ledger-live'
  ),
  [SupportWalletExtension.Math]: buildWalletConfig(
    SupportWalletExtension.Math,
    '/partners/logo-mathwallet.png',
    'Math Wallet',
    'https://mathwallet.org/en-us/',
    'https://blog.mathwallet.org/?p=540',
    false,
    true
  ),
  [SupportWalletExtension.Nova]: buildWalletConfig(
    SupportWalletExtension.Nova,
    '/partners/logo-nova.png',
    'Nova',
    'https://novawallet.io/',
    'https://novawallet.io/',
    false,
    true
  ),
  [SupportWalletExtension.SubWallet]: buildWalletConfig(
    SupportWalletExtension.SubWallet,
    '/partners/logo-subwallet.svg',
    'SubWallet',
    'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn?hl=en&authuser=0',
    'https://connect.subwallet.app/#/welcome',
    true,
    true
  ),
  [SupportWalletExtension.Talisman]: buildWalletConfig(
    SupportWalletExtension.Talisman,
    '/partners/logo-talisman.svg',
    'Talisman',
    'https://app.talisman.xyz/spiritkeys',
    'https://app.talisman.xyz/',
    true
  ),
  [SupportWalletExtension.Enkrypt]: buildWalletConfig(
    SupportWalletExtension.Enkrypt,
    '/partners/logo-enkrypt.png',
    'Enkrypt',
    'https://www.enkrypt.com/#downloads',
    'https://www.enkrypt.com/',
    true
  ),
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
  SupportWalletExtension.SubWallet,
]
const PCWalletExtensionList = [
  SupportWalletExtension.Enkrypt,
  SupportWalletExtension.Talisman,
  SupportWalletExtension.PolkadotJs,
  SupportWalletExtension.SubWallet,
  SupportWalletExtension.Clover,
]

const createWalletInstance = (
  walletExtension: SupportWalletExtension
): BaseDotsamaWallet => {
  const config = WalletConfigMap[walletExtension]
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
  const sourceIds = new Set(wallets.map((d) => d.source))
  const allWalletsUpdates = [
    ...wallets,
    ...allWallets.filter((d) => !sourceIds.has(d.source)),
  ]
  return allWalletsUpdates
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
