export default function () {
  const { disconnect: disconnectWeb3Modal } = useWagmi()
  const shoppingCartStore = useShoppingCartStore()
  const walletStore = useWalletStore()
  const identityStore = useIdentityStore()

  const logout = async () => {
    identityStore.resetAuth()
    sessionStorage.clear()
    localStorage.clear()
    shoppingCartStore.clear()

    walletStore.setDisconnecting(true)
    walletStore.clear()
    if (walletStore.getIsEvm) {
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
