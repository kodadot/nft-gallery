export default ({ store }): void => {
  const account = store.getters.getAuthAddress
  if (account) {
    store.dispatch('fetchBalance', account)

    // Subscribe to balance changes
    store.dispatch('subscribeBalance', account)
  }
}
