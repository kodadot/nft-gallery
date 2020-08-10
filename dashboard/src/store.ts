import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import SettingModule from '@vue-polkadot/vue-settings';
import Connector from '@vue-polkadot/vue-api';

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
    const { chainSS58, chainDecimals, chainToken  } = api.registry
    console.log('[API] Connect to <3', store.state.setting.apiUrl, 
      { chainSS58, chainDecimals, chainToken});
    store.commit('setChainProperties', {
      ss58Format: chainSS58 || 42,
      tokenDecimals: chainDecimals || 12,
      tokenSymbol: chainToken || 'Unit'
    })
    const nodeInfo = store.getters.availableNodes
        .filter((o:any) => o.value === store.state.setting.apiUrl)
        .map((o:any) => {return o.info})[0]
    store.commit('setExplorer', { 'chain': nodeInfo })
  })
  Api().on('error', async (error: Error) => {
    store.commit('setError', error);
    console.warn('[API] error', error);
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
  // // called when the store is initialized
  // store.subscribe(({ type, payload }: any, state: any) => {
  //   if (type === 'setSettings' && payload.apiUrl) {
  //     Connector.getInstance().changeApiUrl(payload.apiUrl);
  //   }
  // });
};

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false,
    keyringLoaded: false,
    chainProperties: {},
    explorer: {},
    explorerOptions: {},
    error: null,
  },
  mutations: {
    keyringLoaded(state: any) {
      state.keyringLoaded = true;
    },
    setChainProperties(state: any, data) {
      state.chainProperties = Object.assign({}, data)
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
  },
  plugins: [vuexLocalStorage.plugin, apiPlugin, myPlugin ],
});
