import { balanceOf, identityOf } from '@kodadot1/sub-api'
import { Registration } from '@polkadot/types/interfaces/identity/types'
import { defineStore } from 'pinia'
import consola from 'consola'
import { emptyObject } from '@/utils/empty'
import { formatAddress } from '@/utils/account'
import { Prefix } from '@kodadot1/static'
import Vue from 'vue'

const DEFAULT_BALANCE_STATE = {
  bsx: '0',
  ksm: '0',
  rmrk: '0',
  snek: '0',
  stmn: '0',
  glmr: '0',
  movr: '0',
}

export interface IdentityMap {
  [address: string]: Registration
}

type Key = Prefix | string | number
type BalanceMap<T extends Key = string> = Record<T, string>
type ChangeAddressRequest = {
  address: string
  apiUrl?: string
}

type ChainType = 'kusama' | 'basilisk' | 'statemine'
type ChainDetail = {
  balance: string
  nativeBalance: string
  usd: string
  selected: boolean
  address: string
}
type ChainToken = Partial<Record<'ksm' | 'bsx', ChainDetail>>

interface MultiBalances {
  address: string
  chains: Partial<Record<ChainType, ChainToken>>
}

const DEFAULT_MULTI_BALANCE_STATE: MultiBalances = {
  address: '',
  chains: {},
}

export interface Auth {
  address: string
  source?: 'keyring' | 'extension' | 'ledger'
  balance?: BalanceMap<Prefix>
  tokens?: BalanceMap<number> // <id, amount>
}

export interface IdentityStruct {
  identities: IdentityMap
  auth: Auth
  multiBalances: MultiBalances
}

export interface IdenityRequest {
  address: string
  identity: Registration
}

export const useIdentityStore = defineStore('identity', {
  state: (): IdentityStruct => ({
    identities: emptyObject<IdentityMap>(),
    auth: {
      ...emptyObject<Auth>(),
      balance: DEFAULT_BALANCE_STATE,
      tokens: {
        '1': '0',
        '5': '0',
      },
      address: localStorage.getItem('kodaauth') || '',
    },
    multiBalances: DEFAULT_MULTI_BALANCE_STATE,
  }),
  getters: {
    availableIdentities: (state) => state.identities,
    getAuth: (state) => state.auth,
    getAuthAddress: (state) => state.auth.address,
    getIdentityFor: (state) => (address: string) => state.identities[address],
    getTokenBalanceOf: (state) => (tokenId: string) =>
      state.auth.tokens ? state.auth.tokens[tokenId] || '0' : '0',
    getAuthBalance: (state) => {
      const { urlPrefix } = usePrefix()
      return state.auth.balance
        ? state.auth.balance[urlPrefix.value] || '0'
        : '0'
    },
    getTotalUsd: (state) => {
      if (
        state.multiBalances &&
        Object.values(state.multiBalances?.chains || 0).length > 0
      ) {
        return Object.values(state.multiBalances.chains)
          .flatMap((chain) => Object.values(chain))
          .reduce((total, token) => total + parseFloat(token.usd), 0)
      }

      return 0
    },
    getStatusMultiBalances: (state) => {
      let sum = 0
      for (const key in state.multiBalances.chains) {
        if (state.multiBalances.chains.hasOwnProperty(key)) {
          sum += Object.keys(state.multiBalances.chains[key]).length
        }
      }

      return sum < 4 ? 'loading' : 'done'
    },
  },
  actions: {
    resetAuth() {
      this.auth = {
        ...emptyObject<Auth>(),
        balance: DEFAULT_BALANCE_STATE,
        tokens: emptyObject<BalanceMap>(),
      }
      Vue.set(this.multiBalances, 'address', '')
      Vue.set(this.multiBalances, 'chains', {})
      localStorage.removeItem('kodaauth')
    },
    setIdentity(identityRequest: IdenityRequest) {
      const { address, identity } = identityRequest
      if (!this.identities[address]) {
        this.identities[address] = identity
      }
    },
    async setAuth(authRequest: Auth) {
      this.auth = { ...authRequest, balance: DEFAULT_BALANCE_STATE }
      Vue.set(this.multiBalances, 'address', '')
      Vue.set(this.multiBalances, 'chains', {})
      await this.fetchBalance({ address: authRequest.address })
      localStorage.setItem('kodaauth', authRequest.address)
    },
    setBalance(prefix: string, balance: string) {
      if (this.auth.balance) {
        this.auth.balance[prefix] = balance
      }
    },
    setPrefixBalance(balance: string) {
      const { urlPrefix } = usePrefix()
      if (this.auth.balance) {
        this.auth.balance[urlPrefix.value] = balance
      }
    },
    setTokenListBalance(request: BalanceMap) {
      this.auth.tokens = request
    },
    setCorrectAddressFormat(ss58Prefix: number) {
      if (this.auth.address) {
        const address = formatAddress(this.auth.address, ss58Prefix)
        this.auth.address = address
        localStorage.setItem('kodaauth', address)
      }
    },
    async setCorrectAddressBalance(apiUrl: string) {
      if (this.auth.address) {
        const address = this.auth.address
        await this.fetchBalance({ address, apiUrl })
      }
    },
    async fetchBalance({ address }: ChangeAddressRequest) {
      const { apiInstance } = useApi()
      try {
        const api = await apiInstance.value
        const balance = await balanceOf(api, address)
        if (balance) {
          this.setPrefixBalance(balance)
        }
      } catch (e) {
        consola.error('[FETCH BALANCE] Unable to get user balance', e)
      }
    },
    async fetchIdentity(address: string) {
      // useIdentity()
      const { apiInstance } = useApi()
      try {
        const api = await apiInstance.value
        const optionIdentity = await identityOf(api, address)
        const identity = optionIdentity?.unwrapOr(null)
        if (identity) {
          this.identities[address] = identity
        }
      } catch (e) {
        consola.error('[FETCH IDENTITY] Unable to get identity', e)
      }
    },
    setMultiBalances({ address, chains, chainType }) {
      this.multiBalances = {
        ...this.multiBalances,
        address,
        chains: {
          ...this.multiBalances.chains,
          [chainType]: {
            ...this.multiBalances.chains[chainType],
            ...chains[chainType],
          },
        },
      }
    },
  },
  persist: true,
})
