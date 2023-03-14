import VuexPersistence from 'vuex-persist'

export default ({ store }): void => {
  new VuexPersistence({
    key: 'preferences',
    storage: window.localStorage,
  }).plugin(store)
  new VuexPersistence({
    key: 'setting',
    storage: window.sessionStorage,
  }).plugin(store)
}
