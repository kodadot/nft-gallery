export default defineNuxtRouteMiddleware((to) => {
  const swapStore = useAtomicSwapsStore()
  const { swap, items, step } = storeToRefs(swapStore)
  const { urlPrefix } = usePrefix()

  const swapId = to.query.swapId?.toString()
  const id = to.params.id?.toString()
  const routeName = to.name?.toString()

  if (!id || !routeName) {
    return navigateTo({ name: getSwapStepRouteName(SwapStep.COUNTERPARTY) })
  }

  const routeStep = SWAP_ROUTE_NAME_STEP_MAP[routeName]

  const foundSwap = items.value
    .filter(item =>
      item.counterparty === id
      && item.id === swapId
      && item.urlPrefix === urlPrefix.value,
    ).sort((a, b) => b.createdAt - a.createdAt)[0]

  if (!foundSwap) {
    return navigateTo({ name: getSwapStepRouteName(SwapStep.DESIRED), params: { id }, query: { swapId: swapStore.createSwap(id).id } })
  }

  swap.value = foundSwap

  const swapStep = getSwapStep(swap.value)

  if (swapStep === SwapStep.CREATED) {
    return navigateTo({ name: getSwapStepRouteName(SwapStep.COUNTERPARTY) })
  }

  step.value = routeStep

  if (routeStep > swapStep) {
    return navigateTo({ name: getSwapStepRouteName(swapStep), params: { id }, query: { swapId: swap.value.id } })
  }
})
