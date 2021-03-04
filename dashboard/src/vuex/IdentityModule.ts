import { Registration, IdentityInfo } from '@polkadot/types/interfaces/identity/types';
import Connector from '@vue-polkadot/vue-api';
import Vue from 'vue'


export interface IdentityMap {
  [address: string]: Registration
}

export interface IdentityStruct {
  identities: IdentityMap;
}

export interface IdenityRequest {
  address: string;
  identity: Registration
}

const defaultState: IdentityStruct = {
  identities: {},
};


const IdentityModule = {
  state: { ...defaultState },
  mutations: {
    addIdentity(state: IdentityStruct, identityRequest: IdenityRequest) {
      const { address, identity  } = identityRequest;
      if (!state.identities[address]) {
        Vue.set(state.identities, address, identity)
      }
    }
    // addAvaibleOption(state: SettingsStruct, settings: Partial<SettingsStruct>) {

    // }
  },
  actions: {
    setIdentity({commit}: any, identityRequest: IdenityRequest) {
      commit('addIdentity', identityRequest);
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
    }
  },
 getters: {
  availableIdentities(state: IdentityStruct): IdentityMap {
     return state.identities
   },
   getIdentityFor(state: IdentityStruct): (address: string) => Registration | undefined {
    return (address: string) => state.identities[address];
  }
 }
}


export default IdentityModule
