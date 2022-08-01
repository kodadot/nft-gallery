import { emptyObject } from '@/utils/empty'
import { ApiFactory, onApiConnect, identityOf } from '@kodadot1/sub-api'
import { Registration } from '@polkadot/types/interfaces/identity/types'
import consola from 'consola'
import Vue from 'vue'
import { formatAddress } from '@/utils/account'

declare type Unsubscribe = () => void

export interface IdentityMap {
  [address: string]: Registration
}

export interface Auth {
  address: string
  source: 'keyring' | 'extension' | 'ledger'
  balance: string
}

export interface IdentityStruct {
  identities: IdentityMap
  auth: Auth
  balanceSub: Unsubscribe
}

export interface IdenityRequest {
  address: string
  identity: Registration
}

const defaultState: IdentityStruct = {
  identities: {},
  auth: emptyObject<Auth>(),
  balanceSub: () => void 0,
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
    state.auth = { ...authRequest }
  },
  addBalance(state: IdentityStruct, balance: string): void {
    Vue.set(state.auth, 'balance', balance)
  },
  addBalanceSub(state: IdentityStruct, sub: Unsubscribe): void {
    // Unsubscribe previous subscription
    state.balanceSub()

    // Set new subscription
    Vue.set(state, 'balanceSub', sub)
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
  async fetchBalance({ commit, dispatch, rootState }, address: string) {
    const endpoint = rootState.setting.apiUrl
    onApiConnect(endpoint, async (api) => {
      try {
        const balanceSub = await api.derive.balances.all(
          address,
          ({ availableBalance }) => {
            dispatch('setBalance', availableBalance.toString())
          }
        )
        commit('addBalanceSub', balanceSub)
      } catch (e) {
        consola.error('[ERR: BALANCE]', e)
      }
    })
  },
  setAuth({ commit, dispatch }, authRequest: Auth): void {
    commit('addAuth', authRequest)
    dispatch('fetchBalance', authRequest.address)
  },
  setBalance({ commit }, balance: string): void {
    commit('addBalance', balance)
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
  getAuthBalance(state: IdentityStruct): string {
    return state.auth.balance
  },
}
