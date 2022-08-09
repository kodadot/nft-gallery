import { emptyObject } from '@/utils/empty'
import { ApiFactory, onApiConnect, identityOf } from '@kodadot1/sub-api'
import { Registration } from '@polkadot/types/interfaces/identity/types'
import consola from 'consola'
import Vue from 'vue'
import { formatAddress } from '@/utils/account'
import type { ApiPromise } from '@polkadot/api'

declare type Unsubscribe = () => void
type UnsubscribePromise = Promise<Unsubscribe>

export interface IdentityMap {
  [address: string]: Registration
}

type BalanceMap = Record<string, string>

export interface Auth {
  address: string
  source: 'keyring' | 'extension' | 'ledger'
  balance: BalanceMap
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
  auth: { ...emptyObject<Auth>(), balance: emptyObject<BalanceMap>() },
}

let balanceSub: Unsubscribe = () => void 0

function subscribeBalance(
  api: ApiPromise,
  address: string,
  cb: (value: string) => void
): UnsubscribePromise {
  return api.derive.balances.all(address, ({ availableBalance }) => {
    cb(availableBalance.toString())
  })
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
    { balance, prefix }: { balance: string; prefix: string }
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
  async fetchBalance({ dispatch, rootState }, address: string) {
    const endpoint = rootState.setting.apiUrl
    const prefix = rootState.setting.urlPrefix
    if (!address) {
      balanceSub()
      return
    }
    onApiConnect(endpoint, async (api) => {
      try {
        if (balanceSub) {
          balanceSub()
        }

        balanceSub = await subscribeBalance(api, address, (balance) => {
          consola.log('[SET_BALANCE]', address, balance, endpoint, prefix)
          dispatch('setBalance', balance)
        })
      } catch (e) {
        consola.error('[ERR: BALANCE]', e)
      }
    })
  },
  setAuth({ commit, dispatch }, authRequest: Auth): void {
    commit('addAuth', authRequest)
    dispatch('fetchBalance', authRequest.address)
  },
  setBalance({ commit, rootState }, balance: string): void {
    const prefix = rootState.setting.urlPrefix
    consola.log('[ADD_BALANCE]', prefix, balance)
    commit('addBalance', { prefix, balance })
  },
  setCorrectAddressFormat(
    { commit, dispatch, state },
    ss58Prefix: number
  ): void {
    consola.log('[SET CORRECT ADDRESS FORMAT]', ss58Prefix)
    commit('changeAddressFormat', ss58Prefix)
    if (state.auth.address) {
      const address = formatAddress(state.auth.address, ss58Prefix)
      dispatch('fetchBalance', address)
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
    consola.log('[getAuthBalance]', urlPrefix, state.auth.balance)
    return state.auth.balance[urlPrefix] || '0'
  },
}
