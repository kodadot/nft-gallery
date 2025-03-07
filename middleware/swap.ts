import { type Prefix } from '@kodadot1/static'
import { isAddress } from '@polkadot/util-crypto'
import { SwapStep } from '@/components/swap/types'

export default defineNuxtRouteMiddleware((to) => {
  const swapStore = useAtomicSwapStore()
  const { swap, items, step } = storeToRefs(swapStore)

  const prefix = to.params.prefix?.toString() as Prefix
  const swapId = to.query.swapId?.toString()
  const id = to.params.id?.toString()
  const routeName = to.name?.toString()
  if (!id || !routeName) {
    return navigateTo({ name: getSwapStepRouteName(SwapStep.COUNTERPARTY) })
  }

  const foundSwap = items.value
    .filter(item =>
      item.counterparty === id
      && item.id === swapId
      && item.urlPrefix === prefix,
    )[0]

  if (!foundSwap) {
    if (isAddress(id)) {
      return navigateTo({
        name: getSwapStepRouteName(SwapStep.DESIRED),
        params: { id, prefix },
        query: { swapId: swapStore.createSwap(id).id },
      })
    }
    return navigateTo({ name: getSwapStepRouteName(SwapStep.COUNTERPARTY, true), params: { id, prefix } })
  }
  const isCollectionSwap = foundSwap.isCollectionSwap

  swap.value = foundSwap

  const swapStep = getSwapStep(swap.value)

  if (swapStep === SwapStep.CREATED) {
    return navigateTo({ name: getSwapStepRouteName(SwapStep.COUNTERPARTY, isCollectionSwap), params: { prefix } })
  }
  const routeStep = getRouteNameStepMap(isCollectionSwap)[routeName]
  step.value = routeStep

  if (routeStep > swapStep) {
    return navigateTo({ name: getSwapStepRouteName(swapStep, isCollectionSwap), params: { id, prefix }, query: { swapId: swap.value.id } })
  }
})
