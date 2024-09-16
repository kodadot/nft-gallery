import { defineStore } from 'pinia'
import type { ChainVM, Prefix } from '@kodadot1/static'
import { isDateWithinLastDays } from '@/utils/datetime'
import { ss58Of } from '@/utils/config/chain.config'
import { formatAddress } from '@/utils/account'

export type WalletAccount = {
  address: string
  vm: ChainVM
  name?: string
  extension?: string
  signedMessage?: string
}

type WalletHistory = { [key: string]: Date }

interface State {
  selected: WalletAccount | undefined
  history: WalletHistory | undefined
  disconnecting: boolean
}

const getOldWallet = (): WalletAccount | undefined =>
  localStorage.getItem('kodaauth')
    ? ({
        vm: 'SUB',
        address: localStorage.getItem('kodaauth') as string,
        name: localStorage.getItem('walletname') as string,
        extension: localStorage.getItem('wallet') as string,
      } as WalletAccount)
    : undefined

const RECENT_WALLET_DAYS_PERIOD = 30

export const useWalletStore = defineStore('wallet', {
  state: (): State => ({
    selected: getOldWallet(),
    history: undefined,
    disconnecting: false,
  }),
  getters: {
    getWalletVM: state => state.selected?.vm,
    getIsWalletVMChain: state => state.selected?.vm === useChain().vm.value,
    getIsSubstrate: state => state.selected?.vm === 'SUB',
    getIsEvm: state => state.selected?.vm === 'EVM',
    getSignedMessage: state => state.selected?.signedMessage,
    getRecentWallet: (state) => {
      let recent: undefined | { key: string, date: Date }
      let maxDate = new Date(0)

      Object.entries(state.history || {}).forEach(([key, isoString]) => {
        const date = new Date(isoString)

        if (date > maxDate) {
          maxDate = date
          recent = { key, date }
        }
      })

      return recent
        && isDateWithinLastDays(recent.date, RECENT_WALLET_DAYS_PERIOD)
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
    setSignedMessage(message: string | undefined) {
      if (!this.selected) {
        return
      }
      this.selected = { ...this.selected, signedMessage: message }
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

      if (this.getIsSubstrate && isSub(prefix)) {
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
