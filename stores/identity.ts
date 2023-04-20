import type { ApiPromise } from '@polkadot/api'
import { balanceOf, identityOf } from '@kodadot1/sub-api'
import { Registration } from '@polkadot/types/interfaces/identity/types'
import { defineStore } from 'pinia'
import consola from 'consola'
import { emptyObject } from '@/utils/empty'
import { formatAddress } from '@/utils/account'

export interface IdentityMap {
  [address: string]: Registration
}

type BalanceMap = Record<string, string>
type ChangeAddressRequest = {
  address: string
  apiUrl?: string
}

export interface Auth {
  address: string
  source?: 'keyring' | 'extension' | 'ledger'
  balance?: BalanceMap
  tokens?: BalanceMap // <id, amount>
}

export interface IdentityStruct {
  identities: IdentityMap
  auth: Auth
}

export interface IdenityRequest {
  address: string
  identity: Registration
}

function free({ free }: any) {
  return free.toString()
}

export const useIdentityStore = defineStore('identity', {
  state: (): IdentityStruct => ({
    identities: emptyObject<IdentityMap>(),
    auth: {
      ...emptyObject<Auth>(),
      balance: emptyObject<BalanceMap>(),
      tokens: emptyObject<BalanceMap>(),
      address: localStorage.getItem('kodaauth') || '',
    },
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
  },
  actions: {
    resetAuth() {
      this.auth = {
        ...emptyObject<Auth>(),
        balance: emptyObject<BalanceMap>(),
        tokens: emptyObject<BalanceMap>(),
      }
    },
    setIdentity(identityRequest: IdenityRequest) {
      const { address, identity } = identityRequest
      if (!this.identities[address]) {
        this.identities[address] = identity
      }
    },
    async setAuth(authRequest: Auth) {
      this.auth = { ...authRequest, balance: emptyObject<BalanceMap>() }
      await this.fetchBalance({ address: authRequest.address })
      useLocalStorage('kodaauth', authRequest.address)
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
        useLocalStorage('kodaauth', address)
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
          console.log(balance)
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
  },
})
