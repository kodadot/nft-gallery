import type { Signer as InjectedSigner } from '@polkadot/api/types'
import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { SubscriptionFn, Wallet } from '@/utils/config/wallets'
import { logError } from '@/utils/mappers'
import {
  InjectedAccount,
  InjectedExtension,
  InjectedMetadata,
  InjectedProvider,
  InjectedWindow,
} from '@polkadot/extension-inject/types'

const DAPP_NAME = 'Kodadot'

export class BaseDotsamaWallet implements Wallet {
  img = ''
  name = ''
  extensionName = '' // source SupportWalletExtensionn
  source = ''
  walletUrl = ''
  guideUrl = ''
  isMobileApp = false
  isBrowserExtension = false

  _extension: InjectedExtension | undefined
  _signer: InjectedSigner | undefined
  _metadata: InjectedMetadata | undefined
  _provider: InjectedProvider | undefined

  // API docs: https://polkadot.js.org/docs/extension/
  get extension() {
    return this._extension
  }

  // API docs: https://polkadot.js.org/docs/extension/
  get signer() {
    return this._signer
  }

  get metadata() {
    return this._metadata
  }

  get provider() {
    return this._provider
  }

  get installed() {
    const injectedWindow = window as Window & InjectedWindow
    const injectedExtension = injectedWindow?.injectedWeb3?.[this.extensionName]

    return !!injectedExtension
  }

  get rawExtension() {
    const injectedWindow = window as Window & InjectedWindow
    const injectedExtension = injectedWindow?.injectedWeb3?.[this.extensionName]
    return injectedExtension
  }

  enable = async () => {
    if (!this.installed) {
      return
    }

    try {
      const injectedExtension = this.rawExtension
      const rawExtension = await injectedExtension?.enable(DAPP_NAME)
      if (!rawExtension) {
        return
      }

      const extension: InjectedExtension = {
        ...rawExtension,
        // Manually add `InjectedExtensionInfo` so as to have a consistent response.
        name: this.extensionName,
        version: injectedExtension.version,
      }

      this._extension = extension
      this._signer = extension.signer
      this._metadata = extension.metadata
      this._provider = extension.provider
    } catch (err) {
      logError(err, (msg) => console.warn('[ENABLE] Unable to enable :)', msg))
    }
  }

  subscribeAccounts = async (callback: SubscriptionFn) => {
    if (!this._extension) {
      await this.enable()
    }

    if (!this._extension) {
      callback(undefined)
      return null
    }

    const unsubscribe = this._extension.accounts.subscribe(
      (accounts: InjectedAccount[]) => {
        const accountsWithWallet = accounts.map((account) => {
          account.address = encodeAddress(decodeAddress(account.address), 2)
          return {
            ...account,
            source: this._extension?.name as string,
            // Added extra fields here for convenience
            wallet: this,
            signer: this._extension?.signer,
          }
        })
        callback(accountsWithWallet)
      }
    )

    return unsubscribe
  }

  getAccounts = async () => {
    if (!this._extension) {
      await this.enable()
    }

    if (!this._extension) {
      return null
    }

    const accounts = await this._extension.accounts.get()

    return accounts.map((account) => {
      return {
        ...account,
        source: this._extension?.name as string,
        // Added extra fields here for convenience
        wallet: this,
        signer: this._extension?.signer,
      }
    })
  }
}
