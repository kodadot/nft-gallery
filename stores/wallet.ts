import { defineStore } from 'pinia'
import { isDateWithinLastDays } from '@/utils/datetime'
import type { ChainVM, Prefix } from '@kodadot1/static'
import { ss58Of } from '@/utils/config/chain.config'

export type WalletAccount = {
  address: string
  vm: ChainVM
  name?: string
  extension?: string
}

type WalletHistory = { [key: string]: Date }

interface State {
  selected: WalletAccount | undefined
  history: WalletHistory | undefined
  disconnecting: boolean
}

const getOldWallet = (): WalletAccount | undefined => {
  if (!localStorage.getItem('kodaauth')) {
    return undefined
  }

  const wallet = {
    vm: 'SUB',
    address: localStorage.getItem('kodaauth') as string,
    name: localStorage.getItem('walletname') as string,
    extension: localStorage.getItem('wallet') as string,
  } as WalletAccount

  return wallet
}

const RECENT_WALLET_DAYS_PERIOD = 30

export const useWalletStore = defineStore('wallet', {
  state: (): State => ({
    selected: getOldWallet(),
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
    setWallet(account: WalletAccount) {
      this.selected = account
      if (account.extension) {
        this.setRecentWallet(account.extension)
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
      const account = this.selected

      if (!account) {
        return
      }

      if (this.getIsSubstrate) {
        const address = formatAddress(account.address, ss58Of(prefix))

        if (address === account.address) {
          return
        }

        this.setWallet({ ...account, address: address })
      }
    },
    switchChain(prefix: Prefix) {
      this.setCorrectAddressFormat(prefix)
    },
  },
  persist: true,
})
