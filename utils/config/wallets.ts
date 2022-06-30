import { PolkadotjsWallet } from '~/utils/config/wallets/PolkadotjsWallet'
import { MetamaskWallet } from '~/utils/config/wallets/MetamaskWallet'
import { MathWallet } from '~/utils/config/wallets/MathWallet'
import { NovaWallet } from '~/utils/config/wallets/NovaWallet'
import { SubWallet } from '~/utils/config/wallets/SubWallet'
import { TalismanWallet } from '~/utils/config/wallets/TalismanWallet'
import { isMobileDevice } from '~/utils/extension'
import { MetaMaskInpageProvider } from '@metamask/providers'
import { RequestArguments } from '@metamask/providers/dist/BaseProvider'
import { Maybe } from '@metamask/providers/dist/utils'

// source as 'polkadot-js' in mobile app
export enum SupportWalletExtension {
  PolkadotJs = 'polkadot-js',
  MetaMask = 'metamask',
  Clover = 'clover',
  Ledger = 'ledger',
  Math = 'polkadot-js', // mathwallet
  Nova = 'polkadot-js', // nova
  SubWallet = 'subwallet-js',
  Talisman = 'talisman',
}

export const SubstrateWallets = [
  SupportWalletExtension.PolkadotJs,
  SupportWalletExtension.MetaMask,
  SupportWalletExtension.Clover,
  SupportWalletExtension.Math,
  SupportWalletExtension.Nova,
  SupportWalletExtension.SubWallet,
  SupportWalletExtension.Talisman,
]

export const SupportedWallets = isMobileDevice
  ? [new MathWallet(), new NovaWallet()]
  : [
      new PolkadotjsWallet(),
      new MetamaskWallet(),
      new SubWallet(),
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
  enable: () => Promise<unknown>

  // The subscribe to accounts function
  subscribeAccounts: (callback: SubscriptionFn) => Promise<unknown>
}

export interface EvmWalletInfo extends WalletData {
  isSetGlobalString: string
  initEvent?: string
}

export interface EvmWallet extends EvmWalletInfo {
  installed: boolean
  extension: MetaMaskInpageProvider | undefined
  isReady: Promise<MetaMaskInpageProvider | undefined>

  request<T>(args: RequestArguments): Promise<Maybe<T>>
  enable(): Promise<boolean>
}

export interface Wallet
  extends WalletData,
    WalletExtension,
    Connector,
    Signer {}
