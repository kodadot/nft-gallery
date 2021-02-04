import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import SettingModule from '@vue-polkadot/vue-settings';
import Connector from '@vue-polkadot/vue-api';
import IdentityModule from './vuex/IdentityModule';
import { getInstance } from '@/components/rmrk/service/RmrkService';

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.sessionStorage,
});

interface ChangeUrlAction {
  type: string;
  payload: string;
}

const apiPlugin = (store: any) => {
  const { getInstance: Api } = Connector
  
  Api().on('connect', async (api: any) => {
    const { chainSS58, chainDecimals, chainTokens  } = api.registry
    const {genesisHash} = api
    console.log('[API] Connect to <3', store.state.setting.apiUrl, 
      { chainSS58, chainDecimals, chainTokens, genesisHash});
    store.commit('setChainProperties', {
      ss58Format: chainSS58 || 42,
      tokenDecimals: chainDecimals[0] || 12,
      tokenSymbol: chainTokens[0] || 'Unit',
      genesisHash: genesisHash || ''
    })
    const rmrkService = getInstance();

    if (rmrkService) {
      try {
        rmrkService.onUrlChange(chainSS58)
      } catch (e) {
        console.warn('[RMRK API] error', e);
      }   
    }

    const nodeInfo = store.getters.availableNodes
        .filter((o:any) => o.value === store.state.setting.apiUrl)
        .map((o:any) => {return o.info})[0]
    store.commit('setExplorer', { 'chain': nodeInfo })
  })
  Api().on('error', async (error: Error) => {
    store.commit('setError', error);
    console.warn('[API] error', error);
    // Api().disconnect()
  })
}

const myPlugin = (store: any) => {
  const { getInstance: Api } = Connector
  Api().connect(store.state.setting.apiUrl)


  store.subscribeAction(({type, payload}: ChangeUrlAction, _: any) => {
    if (type === 'setApiUrl' && payload) {
      store.commit('setLoading', true)
      Api().connect(payload)
    }
  })
};

// TODO: create instance of Texitle here as plugin

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    keyringLoaded: false,
    chainProperties: {},
    explorer: {},
    explorerOptions: {},
    development: {},
    error: null,
  },
  mutations: {
    keyringLoaded(state: any) {
      state.keyringLoaded = true;
    },
    setChainProperties(state: any, data) {
      state.chainProperties = Object.assign({}, data)
    },
    setDevelopment(state: any, data) {
      state.development = Object.assign(state.development, data)
    },
    setExplorer(state: any, data) {
      state.explorer = Object.assign(state.explorer, data)
    },
    setExplorerOptions(state: any, data) {
      state.explorerOptions = Object.assign({}, data)
    },
    setLoading(state: any, toggleTo: boolean) {
      state.loading = toggleTo;
    },
    setError(state: any, error: Error) {
      state.loading = false;
      state.error = error.message;
    }
  },
  getters: {
    getChainProperties: ({chainProperties}) => chainProperties
  },
  modules: {
    setting: SettingModule,
    identity: IdentityModule,
  },
  plugins: [vuexLocalStorage.plugin, apiPlugin, myPlugin ],
});
