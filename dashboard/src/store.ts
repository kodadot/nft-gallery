import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    keyringLoaded: false,
  },
  mutations: {
    keyringLoaded(state) {
      state.keyringLoaded = true;
    },
  },
  actions: {

  },
});
