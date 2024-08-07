const PERSISTED_STORES = ['preferences', 'wallet']

export default function () {
  const { disconnect: disconnectWeb3Modal } = useWagmi()
  const shoppingCartStore = useShoppingCartStore()
  const walletStore = useWalletStore()
  const identityStore = useIdentityStore()

  const logout = async () => {
    const isEvm = walletStore.getIsEvm

    identityStore.resetAuth()
    sessionStorage.clear()
    // don't use localStorage.clear(), web3modal uses localstorage to save data
    // there's no way to regerate those values unless hard reload is made
    PERSISTED_STORES.forEach(store => localStorage.removeItem(store))
    shoppingCartStore.clear()

    walletStore.setDisconnecting(true)
    walletStore.clear()

    if (isEvm) {
      await disconnectWeb3Modal().catch((error) => {
        console.warn('[WEB3MODAL::CONNECTION] Failed disconnecting', error)
      })
    }

    walletStore.setDisconnecting(false)
  }

  return {
    logout,
  }
}
