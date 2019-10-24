import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import SettingModule from '@vue-polkadot/vue-settings';
import Connector from '@vue-polkadot/vue-api';

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.sessionStorage,
});


const myPlugin = (store: any) => {
  // called when the store is initialized
  store.subscribe(({ type, payload }: any, state: any) => {
    if (type === 'setSettings' && payload.apiUrl) {
      Connector.getInstance().changeApiUrl(payload.apiUrl);
    }
  });
};

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    keyringLoaded: false,
  },
  mutations: {
    keyringLoaded(state: any) {
      state.keyringLoaded = true;
    },
  },
  modules: {
    setting: SettingModule,
  },
  plugins: [myPlugin, vuexLocalStorage.plugin ],
});
