import { emptyObject } from '@/utils/empty'
import { Registration } from '@polkadot/types/interfaces/identity/types'
import Connector from '@kodadot1/sub-api'
import Vue from 'vue'

export interface IdentityMap {
  [address: string]: Registration
}

export interface Auth {
  address: string
  source: 'keyring' | 'extension' | 'ledger'
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
  identities: {},
  auth: emptyObject<Auth>(),
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
      console.error('[FETCH IDENTITY] Unable to get identity', e)
    }
  },
  setAuth({ commit }: any, authRequest: Auth): void {
    commit('addAuth', authRequest)
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
}
