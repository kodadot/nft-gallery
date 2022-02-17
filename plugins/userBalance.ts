export default ({ store }): void => {
  const account = store.getters.getAuthAddress
  if (account) {
    // Subscribe to balance changes
    store.dispatch('fetchBalance', account)
  }
}
