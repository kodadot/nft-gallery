import { emptyObject } from '@/utils/empty'
import { Registration } from '@polkadot/types/interfaces/identity/types'
import Connector from '@kodadot1/sub-api'
import Vue from 'vue'
import onApiConnect from '~/utils/api/general'
import consola from 'consola'

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
}

export const actions = {
  setIdentity({ commit }: any, identityRequest: IdenityRequest): void {
    commit('addIdentity', identityRequest)
  },
  async fetchIdentity({ dispatch }: any, address: string) {
    const { api } = Connector.getInstance()
    try {
      const optionIdentity = await api?.isReady.then((a) =>
        a?.query.identity?.identityOf(address)
      )
      const identity = optionIdentity?.unwrapOr(null)
      if (identity) {
        dispatch('setIdentity', { address, identity })
      }
    } catch (e) {
      consola.error('[FETCH IDENTITY] Unable to get identity', e)
    }
  },
  async fetchBalance({ commit, dispatch }, address: string) {
    onApiConnect(async (api) => {
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
