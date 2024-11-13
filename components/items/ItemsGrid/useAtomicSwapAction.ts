import type { NFTWithMetadata } from '@/composables/useNft'
import { SwapStep } from '@/components/swap/types'

export default (nft: NFTWithMetadata) => {
  const route = useRoute()
  const atomicSwapStore = useAtomicSwapsStore()
  const { step, stepItems } = storeToRefs(atomicSwapStore)

  const routeName = computed(() => route.name?.toString() as string)

  const showAtomicSwapAction = computed(() => ATOMIC_SWAP_PAGES.includes(routeName.value))

  const isItemSelected = computed(() => {
    return step.value === SwapStep.REVIEW ? false : stepItems.value?.some(item => item.id === nft.id)
  })

  const onAtomicSwapSelect = () => {
    if (isItemSelected.value) {
      atomicSwapStore.removeStepItem(nft.id)
    }
    else {
      atomicSwapStore.updateStepItems([
        ...stepItems.value,
        {
          id: nft.id,
          collectionId: nft.collection.id,
          sn: nft.sn,
          name: nft.name,
          meta: nft.meta,
        },
      ])
    }
  }

  return {
    onAtomicSwapSelect,
    showAtomicSwapAction,
    isItemSelected,
  }
}
