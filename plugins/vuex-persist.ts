import VuexPersistence from 'vuex-persist'

export default ({ store }): void => {
  new VuexPersistence({
    key: 'setting',
    storage: window.localStorage,
    modules: ['identity'],
  }).plugin(store)
}
