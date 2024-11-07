export default defineNuxtRouteMiddleware((to) => {
  const { toast } = useToast()
  const atomicSwapsStore = useAtomicSwapsStore()
  const { lastSwap, counterparty } = storeToRefs(atomicSwapsStore)

  const id = to.params.id?.toString()

  if (!id) {
    return navigateTo({ name: 'prefix-swap' })
  }

  counterparty.value = id

  if (to.name === 'prefix-swap-id' && !lastSwap.value) {
    atomicSwapsStore.createSwap()
    return
  }

  if (!lastSwap.value) {
    toast('First select the NFTs you want to offer')
    return navigateTo({ name: 'prefix-swap-id', params: { id } })
  }
})
