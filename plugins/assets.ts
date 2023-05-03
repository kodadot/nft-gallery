export default ({ store }): void => {
  const { urlPrefix } = usePrefix()

  if (['snek', 'bsx'].includes(urlPrefix.value)) {
    store.dispatch('assets/fetchAssetList', urlPrefix.value)
  }
}
