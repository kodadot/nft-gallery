import { MetaMaskInpageProvider } from '@metamask/providers'
import { RequestArguments } from '@metamask/providers/dist/BaseProvider'
import { Maybe } from '@metamask/types'
import { EvmWallet } from '@/utils/config/wallets'

export class BaseEvmWallet implements EvmWallet {
  img = ''
  name = ''
  extensionName = ''
  source = ''
  walletUrl = ''
  guideUrl = ''
  isMobileApp = false
  isBrowserExtension = false
  isSetGlobalString = ''
  isEvmWallet = true

  initEvent?: string
  _isReady = false
  _handledReady = false
  isReady: Promise<MetaMaskInpageProvider | undefined>

  _extension: MetaMaskInpageProvider | undefined

  constructor() {
    this.isReady = this.waitReady().then((extension) => {
      this._extension = extension
      this._isReady = true

      return extension
    })
  }

  private lookupProvider() {
    return ((window && window[this.extensionName]) ||
      (window?.ethereum &&
        window?.ethereum[this.isSetGlobalString])) as MetaMaskInpageProvider
  }

  private async waitReady(
    timeout = 3000
  ): Promise<MetaMaskInpageProvider | undefined> {
    if (this._isReady) {
      return Promise.resolve(this.extension)
    }

    return new Promise((resolve) => {
      let currentProvider = this.lookupProvider()
      const initEvent = this.initEvent

      if (currentProvider) {
        this._handledReady = true
        resolve(currentProvider)
      } else if (initEvent) {
        const handleProvider = () => {
          if (this._handledReady) {
            return
          }

          this._handledReady = true

          window.removeEventListener(initEvent, handleProvider)

          currentProvider = this.lookupProvider()

          if (!currentProvider) {
            console.warn(
              `Not found provider of ${this.source}(${this.extensionName})`
            )
          }

          resolve(currentProvider)
        }

        window.addEventListener(initEvent, handleProvider, { once: true })
        setTimeout(() => {
          handleProvider()
        }, timeout)
      }
    })
  }

  get extension() {
    if (!this._extension) {
      this._extension = this.lookupProvider()
    }

    return this._extension
  }

  get installed() {
    return !!this.extension
  }

  enable = async (): Promise<boolean> => {
    await this.isReady
    const accounts = await this.request<string[]>({
      method: 'eth_requestAccounts',
    })

    console.log(accounts)

    return !!(accounts && accounts.length > 0)
  }

  getAccounts = async () => {
    if (!this._extension) {
      await this.enable()
    }

    if (!this._extension) {
      return null
    }

    const accounts = this._extension.request<string[]>({
      method: 'eth_requestAccounts',
    })

    // if (accounts) {
    //   return accounts.map((account) => {
    //     account.address = formatAccount(account.address)
    //     return {
    //       ...account,
    //       source: this._extension?.name as string,
    //       // Added extra fields here for convenience
    //       wallet: this,
    //       signer: this._extension?.signer,
    //     }
    //   })
    // }

    return accounts
  }

  request = async <T>(args: RequestArguments): Promise<Maybe<T>> => {
    await this.isReady

    return await this.extension.request<T>(args)
  }
}
