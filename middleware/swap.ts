const ROUTE_NAME_STEP_MAP = {
  'prefix-swap': SwapStep.COUNTERPARTY,
  'prefix-swap-id': SwapStep.DESIRED,
  'prefix-swap-id-offer': SwapStep.OFFERED,
  'prefix-swap-id-review': SwapStep.REVIEW,
}

export default defineNuxtRouteMiddleware((to) => {
  const { toast } = useToast()
  const atomicSwapsStore = useAtomicSwapsStore()
  const { swap, items, step } = storeToRefs(atomicSwapsStore)
  const { urlPrefix } = usePrefix()

  const id = to.params.id?.toString()
  const routeName = to.name?.toString()

  if (!id || !routeName) {
    return navigateTo({ name: ROUTE_NAME_STEP_MAP[SwapStep.COUNTERPARTY] })
  }

  step.value = ROUTE_NAME_STEP_MAP[routeName]
  swap.value = items.value
    .filter(item =>
      item.counterparty === id
      && item.urlPrefix === urlPrefix.value,
    ).sort((a, b) => b.createdAt - a.createdAt)[0]

  if (to.name === ROUTE_NAME_STEP_MAP[SwapStep.DESIRED] && !swap.value) {
    atomicSwapsStore.createSwap(id)
    return
  }

  if (!swap.value) {
    toast('First select the NFTs you want to offer')
    return navigateTo({ name: ROUTE_NAME_STEP_MAP[SwapStep.DESIRED], params: { id } })
  }
})
