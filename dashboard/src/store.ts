import Vue from 'vue';
import Vuex from 'vuex';
// import VuexPersist from 'vuex-persist';
// import * as localForage from "localforage";
import SettingModule from '@vue-polkadot/vue-settings';
import S from '@vue-polkadot/vue-api';



// const vuexLocalStorage = new VuexPersist({
//   key: 'vuex', // The key to store the state on in the storage provider.
//   storage: localForage, // or window.sessionStorage or localForage
//   // Function that passes the state and returns the state with only the objects you want to store.
//   // reducer: state => state,
//   // Function that passes a mutation and lets you decide if it should update the state in localStorage.
//   // filter: mutation => (true)
// })

const myPlugin = (store: any) => {
  // called when the store is initialized
  store.subscribe(({ type, payload }: any, state: any) => {
    if (type === 'setSettings' && payload.apiUrl) {
      S.getInstance().changeApiUrl(payload.apiUrl);
    }
  });
};


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    setting: SettingModule,
  },
  plugins: [myPlugin],
});
