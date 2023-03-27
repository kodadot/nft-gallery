import VuexPersistence from 'vuex-persist'

export default ({ store }): void => {
  new VuexPersistence({
    key: 'setting',
    storage: window.sessionStorage,
    modules: ['identity'],
  }).plugin(store)
}
