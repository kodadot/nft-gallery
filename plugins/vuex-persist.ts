import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    key: 'history',
    storage: window.localStorage,
    reducer: (state: any) => ({history: { visitedNFTs: state.history.visitedNFTs }})
  }).plugin(store);
}
