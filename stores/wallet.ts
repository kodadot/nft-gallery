import { defineStore } from 'pinia'
import { isDateWithinLastDays } from '@/utils/datetime'
import type { ChainVM, Prefix } from '@kodadot1/static'
import { ss58Of } from '@/utils/config/chain.config'

type Wallet = {
  address: string
  vm: ChainVM
  name?: string
  extension?: string
}

type WalletHistory = { [key: string]: Date }

interface State {
  selected: Wallet | undefined
  history: WalletHistory | undefined
  disconnecting: boolean
}

const RECENT_WALLET_DAYS_PERIOD = 30

export const useWalletStore = defineStore('wallet', {
  state: (): State => ({
    selected: undefined,
    history: undefined,
    disconnecting: false,
  }),
  getters: {
    getIsSubstrate: (state) => state.selected?.vm === 'SUB',
    getIsEvm: (state) => state.selected?.vm === 'EVM',
    getRecentWallet: (state) => {
      let recent: undefined | { key: string; date: Date }
      let maxDate = new Date(0)

      Object.entries(state.history || {}).forEach(([key, isoString]) => {
        const date = new Date(isoString)

        if (date > maxDate) {
          maxDate = date
          recent = { key, date }
        }
      })

      return recent &&
        isDateWithinLastDays(recent.date, RECENT_WALLET_DAYS_PERIOD)
        ? recent.key
        : null
    },
  },
  actions: {
    setDisconnecting(value: boolean) {
      this.disconnecting = value
    },
    setWallet(wallet: Wallet) {
      this.selected = wallet
      if (wallet.extension) {
        this.setRecentWallet(wallet.extension)
      }
    },
    setRecentWallet(extensionName: string) {
      // saving only last connected wallet
      this.history = { [extensionName]: new Date() }
    },
    clear() {
      this.selected = undefined
    },
    setCorrectAddressFormat(prefix: Prefix) {
      const wallet = this.selected

      if (!wallet) {
        return
      }

      if (this.getIsSubstrate) {
        const address = formatAddress(wallet.address, ss58Of(prefix))

        if (address === wallet.address) {
          return
        }

        this.setWallet({ ...wallet, address: address })
      }
    },
    switchChain(prefix: Prefix) {
      this.setCorrectAddressFormat(prefix)
    },
  },
  persist: true,
})
