export default ({ store }): void => {
  const account = store.getters.getAuthAddress
  if (account) {
    // Fetch and Subscribe to balance changes
    store.dispatch('fetchBalance', { address: account })
  }
}
