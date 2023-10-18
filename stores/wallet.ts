import { chain } from 'lodash'
import { defineStore } from 'pinia'
import { isDateWithinLastDays } from '@/utils/datetime'

type WalletHistory = { [key: string]: Date }
interface State {
  wallet: {
    name: string
  }
  history: WalletHistory
}

const RECENT_WALLET_DAYS_PERIOD = 30

export const walletHistory = useLocalStorage<WalletHistory>(
  'wallet-history',
  {},
)

export const useWalletStore = defineStore('wallet', {
  state: (): State => ({
    wallet: {
      name: (process.client && localStorage.getItem('walletname')) || '',
    },
    history: { ...walletHistory.value },
  }),
  getters: {
    getWalletName: (state) => state.wallet.name,
    getRecentWallet: (state) => {
      const recent: undefined | { key; date } = chain(state.history)
        .map((date, key) => ({ key, date: new Date(date) }))
        .maxBy('date')
        .value()
      return recent &&
        isDateWithinLastDays(recent.date, RECENT_WALLET_DAYS_PERIOD)
        ? recent.key
        : null
    },
  },
  actions: {
    setWallet({ name, extension }: { name: string; extension: string }) {
      this.wallet = Object.assign(this.wallet, { name })
      if (process.client) {
        localStorage.setItem('walletname', name)
      }
      this.setRecentWallet(extension)
    },
    setRecentWallet(extensionName: string) {
      // saving only last connected wallet
      const history = { [extensionName]: new Date() }
      this.history = history
      walletHistory.value = history
    },
  },
})
