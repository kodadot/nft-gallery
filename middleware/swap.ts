export default defineNuxtRouteMiddleware((to) => {
  const { toast } = useToast()
  const swapStore = useAtomicSwapsStore()
  const { swap, items, step } = storeToRefs(swapStore)
  const { urlPrefix } = usePrefix()

  const id = to.params.id?.toString()
  const routeName = to.name?.toString()

  if (!id || !routeName) {
    return navigateTo({ name: getSwapStepRouteName(SwapStep.COUNTERPARTY) })
  }

  step.value = SWAP_ROUTE_NAME_STEP_MAP[routeName]
  swap.value = items.value
    .filter(item =>
      item.counterparty === id
      && item.urlPrefix === urlPrefix.value,
    ).sort((a, b) => b.createdAt - a.createdAt)[0]

  if (to.name === getSwapStepRouteName(SwapStep.DESIRED) && !swap.value) {
    swapStore.createSwap(id)
    return
  }

  if (!swap.value) {
    toast('First select the NFTs you want to offer')
    return navigateTo({ name: getSwapStepRouteName(SwapStep.DESIRED), params: { id } })
  }
})
