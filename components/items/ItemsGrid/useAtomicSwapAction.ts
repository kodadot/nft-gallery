import type { NFTWithMetadata } from '@/composables/useNft'

export const ATOMIC_SWAP_PAGES = [
  'prefix-swap-id',
  'prefix-swap-id-offer',
  'prefix-swap-id-review',
]

export default (nft: NFTWithMetadata) => {
  const route = useRoute()
  const { swap, step } = storeToRefs(useAtomicSwapsStore())

  const routeName = computed(() => route.name?.toString() as string)

  const showAtomicSwapAction = computed(() => ATOMIC_SWAP_PAGES.includes(routeName.value))

  const itemsKey = computed(() => {
    if (step.value === SwapStep.DESIRED) {
      return 'desired'
    }

    if (step.value === SwapStep.OFFERED) {
      return 'offered'
    }
  })

  const items = computed(() => {
    const items = swap.value?.[itemsKey.value || '']
    return items
  })

  const isItemSelected = computed(() => {
    return step.value === SwapStep.REVIEW ? false : items.value?.some(item => item.id === nft.id)
  })

  const onAtomicSwapSelect = () => {
    if (!itemsKey.value || !swap.value) {
      return
    }

    if (isItemSelected.value) {
      swap.value[itemsKey.value] = items.value.filter(item => item.id !== nft.id)
    }
    else {
      swap.value[itemsKey.value].push(nft)
    }
  }

  return {
    onAtomicSwapSelect,
    showAtomicSwapAction,
    isItemSelected,
  }
}
