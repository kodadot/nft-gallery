import type { NFTWithMetadata } from '@/composables/useNft'

export const ATOMIC_SWAP_PAGES = [
  'prefix-swap-id',
  'prefix-swap-id-offer',
  'prefix-swap-id-review',
]

export default (nft: NFTWithMetadata) => {
  const route = useRoute()
  const { lastSwap } = storeToRefs(useAtomicSwapsStore())

  const routeName = computed(() => route.name?.toString() as string)

  const showAtomicSwapAction = computed(() => ATOMIC_SWAP_PAGES.includes(routeName.value))

  const isDesiredSelection = computed(() => routeName.value === 'prefix-swap-id')
  const isOfferedSelection = computed(() => routeName.value === 'prefix-swap-id-offer')

  const itemsKey = computed(() => {
    if (isDesiredSelection.value) {
      return 'desired'
    }

    if (isOfferedSelection.value) {
      return 'offered'
    }
  })

  const items = computed(() => {
    const items = lastSwap.value?.[itemsKey.value || '']
    return items
  })

  const isItemSelected = computed(() => items.value?.some(item => item.id === nft.id))

  const onAtomicSwapSelect = () => {
    if (!itemsKey.value) {
      return
    }

    const updatedSwap = lastSwap.value

    if (isItemSelected.value) {
      updatedSwap[itemsKey.value] = items.value.filter(item => item.id !== nft.id)
    }
    else {
      updatedSwap[itemsKey.value].push(nft)
    }
  }

  return {
    onAtomicSwapSelect,
    showAtomicSwapAction,
    isItemSelected,
  }
}
