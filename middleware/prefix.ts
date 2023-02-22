export default function ({ store, route }): void {
  const prefix = route.params.prefix

  if (store.getters.currentUrlPrefix !== prefix && prefix) {
    store.dispatch('setUrlPrefix', prefix)
  }
}
