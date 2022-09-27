export default ({ store }): void => {
  const prefix = store.getters.currentUrlPrefix
  if (['snek', 'bsx'].includes(prefix)) {
    store.dispatch('assets/fetchAssetList', prefix)
  }
}
