import type { ApiPromise } from '@polkadot/api'
import { identityOf, onApiConnect } from '@kodadot1/sub-api'
import { Registration } from '@polkadot/types/interfaces/identity/types'
import { defineStore } from 'pinia'
import consola from 'consola'
import { emptyObject } from '@/utils/empty'
import { formatAddress } from '@/utils/account'
import { getChainEndpointByPrefix } from '@/utils/chain'
import {
  Unsubscribe,
  UnsubscribePromise,
  subscribeBalance,
} from '@/utils/balance'

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

let balanceSub: Unsubscribe = () => void 0
let tokenSub: Unsubscribe = () => void 0

function free({ free }: any) {
  return free.toString()
}

async function subscribeTokens(
  api: ApiPromise,
  address: string,
  prefix: string,
  cb: (value: BalanceMap) => void
): UnsubscribePromise {
  if (api.query.tokens) {
    const realKusamaTokenId = prefix === 'bsx' || prefix === 'rmrk' ? '1' : '5'
    return await api.query.tokens.accounts.multi(
      [[address, realKusamaTokenId]],
      ([ksm]: unknown[]) =>
        cb({
          [realKusamaTokenId]: free(ksm),
        })
    )
  }

  return Promise.resolve(() => void 0)
}

export const useIdentityStore = defineStore('identity', {
  state: (): IdentityStruct => ({
    identities: emptyObject<IdentityMap>(),
    auth: {
      ...emptyObject<Auth>(),
      balance: emptyObject<BalanceMap>(),
      tokens: emptyObject<BalanceMap>(),
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
    setAuth(authRequest: Auth) {
      this.auth = { ...authRequest, balance: emptyObject<BalanceMap>() }
      this.fetchBalance({ address: authRequest.address })
      useLocalStorage('kodaauth', authRequest.address)
    },
    setBalance(prefix: string, balance: string) {
      this.auth.balance[prefix] = balance
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
    setCorrectAddressBalance(apiUrl: string) {
      if (this.auth.address) {
        const address = this.auth.address
        this.fetchBalance({ address, apiUrl })
      }
    },
    fetchBalance({ address, apiUrl }: ChangeAddressRequest) {
      const { urlPrefix } = usePrefix()
      const directEndpoint = getChainEndpointByPrefix(urlPrefix.value)
      const endpoint = String(apiUrl || directEndpoint)

      if (!address) {
        balanceSub()
        tokenSub()
        return
      }

      onApiConnect(endpoint, async (api) => {
        try {
          if (balanceSub) {
            balanceSub()
          }

          if (tokenSub) {
            tokenSub()
          }

          balanceSub = await subscribeBalance(api, address, (balance) => {
            this.setBalance(urlPrefix.value, balance)
          })

          tokenSub = await subscribeTokens(
            api,
            address,
            urlPrefix.value,
            (balance) => {
              this.setTokenListBalance(balance)
            }
          )
        } catch (e) {
          consola.error('[ERR: BALANCE]', e)
        }
      })
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
