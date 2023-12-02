import { defineStore } from 'pinia'
import { isDateWithinLastDays } from '@/utils/datetime'
import { localStorage } from '@/services/browserAPIs'

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
      name: localStorage?.getItem('walletname') || '',
    },
    history: { ...walletHistory.value },
  }),
  getters: {
    getWalletName: (state) => state.wallet.name,
    getRecentWallet: (state) => {
      let recent: undefined | { key: string; date: Date }
      let maxDate = new Date(0)

      Object.entries(state.history).forEach(([key, isoString]) => {
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
    setWallet({ name, extension }: { name: string; extension: string }) {
      this.wallet = Object.assign(this.wallet, { name })
      localStorage?.setItem('walletname', name)
      this.setRecentWallet(extension)
    },
    setRecentWallet(extensionName: string) {
      // saving only last connected wallet
      const history = { [extensionName]: new Date() }
      this.history = history
      walletHistory.value = history
    },
  },
  persist: true,
})
