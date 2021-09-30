import { emptyObject } from '@/utils/empty'
import { Registration, IdentityInfo } from '@polkadot/types/interfaces/identity/types'
import Connector from '@vue-polkadot/vue-api'
import Vue from 'vue'


export interface IdentityMap {
  [address: string]: Registration
}

export interface Auth {
  address: string;
  source: 'keyring' | 'extension' | 'ledger'
}

export interface IdentityStruct {
  identities: IdentityMap;
  auth: Auth
}

export interface IdenityRequest {
  address: string;
  identity: Registration
}

const defaultState: IdentityStruct = {
  identities: {},
  auth: emptyObject<Auth>()
}


const IdentityModule = {
  state: { ...defaultState },
  mutations: {
    addIdentity(state: IdentityStruct, identityRequest: IdenityRequest) {
      const { address, identity  } = identityRequest
      if (!state.identities[address]) {
        Vue.set(state.identities, address, identity)
      }
    },
    addAuth(state: IdentityStruct, authRequest: Auth) {
      state.auth = {...authRequest}
    }

  },
  actions: {
    setIdentity({commit}: any, identityRequest: IdenityRequest) {
      commit('addIdentity', identityRequest)
    },
    async fetchIdentity({dispatch}: any, address: string) {
      const { api } = Connector.getInstance()
      try {
        const optionIdentity = await api?.isReady
          .then((a) => a?.query.identity?.identityOf(address))
        const identity = optionIdentity?.unwrapOr(null)
        if (identity) {
          dispatch('setIdentity', { address, identity })
        }
      } catch(e) {
        console.error('[FETCH IDENTITY] Unable to get identity', e)
      }
    },
    setAuth({commit}: any, authRequest: Auth) {
      commit('addAuth', authRequest)
    }
  },
  getters: {
    availableIdentities(state: IdentityStruct): IdentityMap {
      return state.identities
    },
    getIdentityFor(state: IdentityStruct): (address: string) => Registration | undefined {
      return (address: string) => state.identities[address]
    },
    getAuth(state: IdentityStruct): Auth {
      return state.auth
    },
    getAuthAddress(state: IdentityStruct): string {
      return state.auth.address
    }
  }
}


export default IdentityModule
