import { PolkadotjsWallet } from '~/utils/config/wallets/PolkadotjsWallet'
import { NovaWallet } from '~/utils/config/wallets/NovaWallet'
import { TalismanWallet } from '~/utils/config/wallets/TalismanWallet'

export enum SupportWalletExtension {
  PolkadotJs = 'polkadot-js',
  MetaMask = 'metamask',
  Clover = 'clover',
  Math = 'mathwallet',
  Ledger = 'ledger',
  Nova = 'nova',
  Talisman = 'talisman',
}

export const SubstrateWallets = [
  SupportWalletExtension.PolkadotJs,
  SupportWalletExtension.Clover,
  SupportWalletExtension.Math,
  SupportWalletExtension.Nova,
  SupportWalletExtension.Talisman,
]

export const SupportedWallets = [
  new PolkadotjsWallet(),
  new NovaWallet(),
  new TalismanWallet(),
]

export function getWalletBySource(
  source: string | unknown
): Wallet | undefined {
  return SupportedWallets.find((wallet) => {
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
