import { emptyObject } from '@/utils/empty'
import { ApiFactory, identityOf, onApiConnect } from '@kodadot1/sub-api'
import { Registration } from '@polkadot/types/interfaces/identity/types'
import consola from 'consola'
import Vue from 'vue'
import { formatAddress } from '@/utils/account'
import type { ApiPromise } from '@polkadot/api'
import { getChainEndpointByPrefix } from '@/utils/chain'

declare type Unsubscribe = () => void
type UnsubscribePromise = Promise<Unsubscribe>

export interface IdentityMap {
  [address: string]: Registration
}

type BalanceMap = Record<string, string>
type AddBalanceRequest = {
  balance: string
  prefix: string
}
type ChangeAddressRequest = {
  address: string
  apiUrl: string
}

export interface Auth {
  address: string
  source: 'keyring' | 'extension' | 'ledger'
  balance: BalanceMap
  tokens: BalanceMap // <id, amount>
}

export interface IdentityStruct {
  identities: IdentityMap
  auth: Auth
}

export interface IdenityRequest {
  address: string
  identity: Registration
}

const defaultState: IdentityStruct = {
  identities: emptyObject<IdentityMap>(),
  auth: {
    ...emptyObject<Auth>(),
    balance: emptyObject<BalanceMap>(),
    tokens: emptyObject<BalanceMap>(),
  },
}

let balanceSub: Unsubscribe = () => void 0
let tokenSub: Unsubscribe = () => void 0

function subscribeBalance(
  api: ApiPromise,
  address: string,
  cb: (value: string) => void
): UnsubscribePromise {
  return api.derive.balances.all(address, ({ availableBalance }) => {
    cb(availableBalance.toString())
  })
}

function free({ free }: any) {
  return free.toString()
}

function subscribeTokens(
  api: ApiPromise,
  address: string,
  cb: (value: BalanceMap) => void
): UnsubscribePromise {
  if (api.query.tokens) {
    return api.query.tokens.accounts.multi([[address, '5']], ([ksm]: any[]) =>
      cb({
        '5': free(ksm),
      })
    )
  }

  return Promise.resolve(() => void 0)
}

// Disabling namespace to match with the original repo
export const namespaced = false

export const state = () => defaultState

export const mutations = {
  addIdentity(state: IdentityStruct, identityRequest: IdenityRequest): void {
    const { address, identity } = identityRequest
    if (!state.identities[address]) {
      Vue.set(state.identities, address, identity)
    }
  },
  addAuth(state: IdentityStruct, authRequest: Auth): void {
    state.auth = { ...authRequest, balance: emptyObject<BalanceMap>() }
  },
  addBalance(
    state: IdentityStruct,
    { balance, prefix }: AddBalanceRequest
  ): void {
    Vue.set(state.auth.balance, prefix, balance)
  },
  changeAddressFormat(state: IdentityStruct, ss58Prefix: number): void {
    if (state.auth.address) {
      const address = formatAddress(state.auth.address, ss58Prefix)
      Vue.set(state.auth, 'address', address)
      localStorage.setItem('kodaauth', address)
    }
  },
  setTokenListBalance(state: IdentityStruct, request: BalanceMap): void {
    Vue.set(state.auth, 'tokens', request)
  },
}

export const actions = {
  setIdentity({ commit }: any, identityRequest: IdenityRequest): void {
    commit('addIdentity', identityRequest)
  },
  async fetchIdentity({ dispatch, rootState }: any, address: string) {
    const endpoint = rootState.setting.apiUrl
    try {
      const api = await ApiFactory.useApiInstance(endpoint)
      const optionIdentity = await identityOf(api, address)
      const identity = optionIdentity?.unwrapOr(null)
      if (identity) {
        dispatch('setIdentity', { address, identity })
      }
    } catch (e) {
      consola.error('[FETCH IDENTITY] Unable to get identity', e)
    }
  },
  fetchBalance(
    { commit, dispatch, rootState },
    { address, apiUrl }: ChangeAddressRequest
  ) {
    const directEndpoint = getChainEndpointByPrefix(rootState.setting.urlPrefix)
    const endpoint = apiUrl || directEndpoint || rootState.setting.apiUrl
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
          dispatch('setBalance', balance)
        })

        tokenSub = await subscribeTokens(api, address, (balance) => {
          commit('setTokenListBalance', balance)
        })
      } catch (e) {
        consola.error('[ERR: BALANCE]', e)
      }
    })
  },
  setAuth({ commit, dispatch }, authRequest: Auth): void {
    commit('addAuth', authRequest)
    dispatch('fetchBalance', { address: authRequest.address })
  },
  setBalance({ commit, rootState }, balance: string): void {
    const prefix = rootState.setting.urlPrefix
    commit('addBalance', { prefix, balance })
  },
  setCorrectAddressFormat({ commit }, ss58Prefix: number): void {
    commit('changeAddressFormat', ss58Prefix)
  },
  setCorrectAddressBalance({ dispatch, state }, apiUrl: string): void {
    if (state.auth.address) {
      const address = state.auth.address
      dispatch('fetchBalance', { address, apiUrl })
    }
  },
}

export const getters = {
  availableIdentities(state: IdentityStruct): IdentityMap {
    return state.identities
  },
  getIdentityFor(
    state: IdentityStruct
  ): (address: string) => Registration | undefined {
    return (address: string) => state.identities[address]
  },
  getAuth(state: IdentityStruct): Auth {
    return state.auth
  },
  getAuthAddress(state: IdentityStruct): string {
    return state.auth.address
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAuthBalance(
    state: IdentityStruct,
    _: any,
    { setting: { urlPrefix } }: any
  ): string {
    return state.auth.balance[urlPrefix] || '0'
  },
  getTokenBalanceOf(state: IdentityStruct): (tokenId: string) => string {
    return (tokenId: string) =>
      state.auth.tokens ? state.auth.tokens[tokenId] || '0' : '0'
  },
}
