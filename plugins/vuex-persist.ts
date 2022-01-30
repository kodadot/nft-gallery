import VuexPersistence from 'vuex-persist'

export default ({ store }): void => {
  new VuexPersistence({
    key: 'history',
    storage: window.localStorage,
    reducer: (state: any) => ({
      history: { visitedNFTs: state.history.visitedNFTs },
    }),
  }).plugin(store)
  new VuexPersistence({
    key: 'preferences',
    storage: window.localStorage,
  }).plugin(store)
  new VuexPersistence({
    key: 'setting',
    storage: window.sessionStorage,
  }).plugin(store)
}
