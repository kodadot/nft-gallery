export default defineNuxtRouteMiddleware((to) => {
  const { toast } = useToast()
  const { accountId } = useAuth()
  const atomicSwapsStore = useAtomicSwapsStore()
  const { swap, counterparty } = storeToRefs(atomicSwapsStore)

  const id = to.params.id?.toString()

  if (!id) {
    return navigateTo({ name: 'prefix-swap' })
  }

  counterparty.value = id

  watchEffect(() => {
    if (swap.value) {
      atomicSwapsStore.updateItem({
        ...swap.value,
        creator: accountId.value ? accountId.value : undefined,
      })
    }
  })

  if (to.name === 'prefix-swap-id' && !swap.value) {
    atomicSwapsStore.createSwap(id)
    return
  }

  if (!swap.value) {
    toast('First select the NFTs you want to offer')
    return navigateTo({ name: 'prefix-swap-id', params: { id } })
  }
})
