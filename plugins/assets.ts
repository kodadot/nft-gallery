export default ({ store }): void => {
  const prefix = store.getters.currentUrlPrefix
  if (prefix === 'snek') {
    store.dispatch('assets/fetchAssetList', prefix)
  }
}
